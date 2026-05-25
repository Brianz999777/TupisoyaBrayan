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
    this.wsService.suscribirse(`/topic/sala/${id_sala}`, (mensaje: MensajeChat) => {
      this.mensaje_source.next(mensaje);
    });
  }

  desuscribirse_de_sala(id_sala: number): void {
    this.wsService.desuscribirse(`/topic/sala/${id_sala}`);
  }

  conectar_websocket(): void {
    const token = this.auth.getToken();
    if (token) {
      this.wsService.conectar(token);
    }
  }

  desconectar_websocket(): void {
    this.wsService.desconectar();
  }
}
