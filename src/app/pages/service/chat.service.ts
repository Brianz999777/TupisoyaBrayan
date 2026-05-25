import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { MensajeChat, SalaChat, MensajeInboundDTO } from '../interfaces/chat.model';
import { Auth } from './auth.service';
import { ChatWebSocketService } from './chat-websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private wsService = inject(ChatWebSocketService);
  private readonly api_url = '/tupisoya/api/chat';

  private mensaje_source = new BehaviorSubject<MensajeChat | null>(null);
  public nuevo_mensaje$ = this.mensaje_source.asObservable();

  /** Total de mensajes no leídos en todas las salas (para el badge del topbar) */
  private total_no_leidos_source = new BehaviorSubject<number>(0);
  public total_no_leidos$ = this.total_no_leidos_source.asObservable();

  /** Mapa: id_sala -> cantidad de mensajes no leídos */
  private no_leidos_por_sala: Map<number, number> = new Map();

  /** Polling global para detectar mensajes nuevos */
  private polling_global_interval: any = null;
  private ultimos_mensajes_por_sala: Map<number, number> = new Map();

  constructor() {
    // Iniciar polling global automáticamente si el usuario ya está logueado
    if (this.auth.getToken()) {
      setTimeout(() => this.iniciar_polling_global(), 1000);
    }
  }

  private verificar_autenticacion(): boolean {
    const token = this.auth.getToken();
    if (!token) return false;
    return true;
  }

  obtener_o_crear_sala(id_prop: number, nro_doc_comprador: string, nro_doc_vendedor: string): Observable<SalaChat> {
    if (!this.verificar_autenticacion()) {
      return throwError(() => new Error('Debes iniciar sesión para usar el chat'));
    }
    const url = `${this.api_url}/sala?id_prop=${id_prop}&nro_doc_comprador=${nro_doc_comprador}&nro_doc_vendedor=${nro_doc_vendedor}`;
    return this.http.post<SalaChat>(url, {});
  }

  listar_chats_del_usuario(nro_doc: string): Observable<SalaChat[]> {
    if (!this.verificar_autenticacion()) {
      return throwError(() => new Error('Debes iniciar sesión para usar el chat'));
    }
    return this.http.get<SalaChat[]>(`${this.api_url}/usuario/${nro_doc}`);
  }

  cargar_historial(id_sala: number): Observable<MensajeChat[]> {
    if (!this.verificar_autenticacion()) {
      return throwError(() => new Error('Debes iniciar sesión para usar el chat'));
    }
    return this.http.get<MensajeChat[]>(`${this.api_url}/sala/${id_sala}/mensajes`);
  }

  enviar_mensaje_ws(mensaje: MensajeInboundDTO): void {
    if (!this.verificar_autenticacion()) return;
    this.wsService.enviar_mensaje('/app/chat.enviarMensaje', mensaje);
  }

  enviar_mensaje_http(mensaje: MensajeChat): Observable<MensajeChat> {
    if (!this.verificar_autenticacion()) {
      return throwError(() => new Error('Debes iniciar sesión para usar el chat'));
    }
    return this.http.post<MensajeChat>(`${this.api_url}/mensaje`, mensaje);
  }

  suscribirse_a_sala(id_sala: number): void {
    this.wsService.suscribirse(`/topic/sala/${id_sala}`, (mensaje: any) => {
      this.mensaje_source.next(mensaje as MensajeChat);
    });
  }

  desuscribirse_de_sala(id_sala: number): void {
    this.wsService.desuscribirse(`/topic/sala/${id_sala}`);
  }

  conectar_websocket(): void {
    const token = this.auth.getToken();
    if (token) {
      this.wsService.conectar(token);
      this.iniciar_polling_global();
    }
  }

  desconectar_websocket(): void {
    this.wsService.desconectar();
    this.detener_polling_global();
  }

  esta_conectado_ws(): boolean {
    return this.wsService.esta_conectado();
  }

  // ========== GESTIÓN DE MENSAJES NO LEÍDOS ==========

  /** Incrementa el contador de no leídos para una sala específica */
  incrementar_no_leidos(id_sala: number): void {
    const actual = this.no_leidos_por_sala.get(id_sala) || 0;
    this.no_leidos_por_sala.set(id_sala, actual + 1);
    this.actualizar_total_no_leidos();
  }

  /** Marca una sala como leída (cuando el usuario entra al chat) */
  marcar_sala_como_leida(id_sala: number): void {
    this.no_leidos_por_sala.set(id_sala, 0);
    this.actualizar_total_no_leidos();
  }

  /** Obtiene los no leídos de una sala específica */
  obtener_no_leidos_sala(id_sala: number): number {
    return this.no_leidos_por_sala.get(id_sala) || 0;
  }

  /** Inicializa los contadores desde la lista de chats (el backend devuelve no_leidos) */
  inicializar_no_leidos(chats: SalaChat[]): void {
    this.no_leidos_por_sala.clear();
    for (const chat of chats) {
      if (chat.no_leidos && chat.no_leidos > 0) {
        this.no_leidos_por_sala.set(chat.id_sala, chat.no_leidos);
      }
    }
    this.actualizar_total_no_leidos();
  }

  private actualizar_total_no_leidos(): void {
    let total = 0;
    this.no_leidos_por_sala.forEach((cantidad) => {
      total += cantidad;
    });
    this.total_no_leidos_source.next(total);
  }

  // ========== POLLING GLOBAL PARA NO LEÍDOS ==========

  /** Inicia un polling global que verifica mensajes nuevos en todas las salas del usuario */
  iniciar_polling_global(): void {
    this.detener_polling_global();
    const user = this.auth.getUser();
    if (!user) return;

    const email = user.email_dto;
    const nro_doc = user.nro_doc_dto;

    this.polling_global_interval = setInterval(() => {
      this.listar_chats_del_usuario(nro_doc).subscribe({
        next: (salas) => {
          for (const sala of salas) {
            this.cargar_historial(sala.id_sala).subscribe({
              next: (historial) => {
                const cantidad_anterior = this.ultimos_mensajes_por_sala.get(sala.id_sala) || 0;
                if (historial.length > cantidad_anterior) {
                  // Hay mensajes nuevos, verificar si son de otro usuario
                  const mensajes_nuevos = historial.slice(cantidad_anterior);
                  const mensajes_de_otro = mensajes_nuevos.filter(m => m.emisor_email !== email);
                  if (mensajes_de_otro.length > 0) {
                    this.incrementar_no_leidos(sala.id_sala);
                  }
                }
                this.ultimos_mensajes_por_sala.set(sala.id_sala, historial.length);
              }
            });
          }
        }
      });
    }, 10000); // Cada 10 segundos
  }

  /** Detiene el polling global */
  detener_polling_global(): void {
    if (this.polling_global_interval) {
      clearInterval(this.polling_global_interval);
      this.polling_global_interval = null;
    }
  }
}
