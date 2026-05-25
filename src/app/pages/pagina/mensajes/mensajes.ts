import { Component, OnInit, OnDestroy, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ChatService } from '../../service/chat.service';
import { InmuebleService } from '../../service/inmueble.service';
import { Auth } from '../../service/auth.service';
import { SalaChat, MensajeChat, MensajeInboundDTO, Persona } from '../../interfaces/chat.model';
import { PersonaNatural } from '../../interfaces/persona-natural';
import { PersonaJuridica } from '../../interfaces/persona-juridica';
import { PropiedadVenta, PropiedadAlquiler } from '../../interfaces/inmueble';
import { TopbarWidget } from '../topbar/topbarwidget.component';
import { FooterWidget } from '../topbar/footerwidget';

interface ChatConDatos {
  sala: SalaChat;
  otro_usuario: Persona | null;
  propiedad: (PropiedadVenta | PropiedadAlquiler) | null;
  tipo_propiedad: 'venta' | 'alquiler' | null;
  cargando: boolean;
}

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    AvatarModule,
    BadgeModule,
    ToastModule,
    TopbarWidget,
    FooterWidget
  ],
  providers: [MessageService],
  templateUrl: './mensajes.html',
  styleUrls: ['./mensajes.scss']
})
export class Mensajes implements OnInit, OnDestroy {
  chatService = inject(ChatService);
  private inmuebleService = inject(InmuebleService);
  private messageService = inject(MessageService);

  auth = inject(Auth);
  router = inject(Router);

  chats_con_datos = signal<ChatConDatos[]>([]);
  sala_seleccionada = signal<ChatConDatos | null>(null);
  mensajes = signal<MensajeChat[]>([]);
  texto_input = signal('');
  cargando_chats = signal(false);
  cargando_mensajes = signal(false);
  enviando = signal(false);
  email_usuario = signal('');
  nro_doc_usuario = signal('');

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  private suscripcion_mensajes: Subscription | null = null;
  private polling_interval: any = null;

  constructor() {
    const user = this.auth.getUser();
    if (user) {
      this.email_usuario.set(user.email_dto);
      this.nro_doc_usuario.set(user.nro_doc_dto);
    }
  }

  ngOnInit() {
    if (this.auth.getToken()) {
      this.chatService.conectar_websocket();
      this.cargar_chats();
    }
  }

  ngOnDestroy() {
    this.detener_polling();
    if (this.suscripcion_mensajes) {
      this.suscripcion_mensajes.unsubscribe();
    }
    const sala = this.sala_seleccionada();
    if (sala) {
      this.chatService.desuscribirse_de_sala(sala.sala.id_sala);
    }
  }

  private cargar_chats() {
    if (!this.nro_doc_usuario()) return;
    this.cargando_chats.set(true);
    this.chatService.listar_chats_del_usuario(this.nro_doc_usuario()).subscribe({
      next: (salas) => {
        this.chatService.inicializar_no_leidos(salas);
        const items: ChatConDatos[] = salas.map(sala => ({
          sala,
          otro_usuario: null,
          propiedad: null,
          tipo_propiedad: null,
          cargando: true
        }));
        this.chats_con_datos.set(items);
        this.cargando_chats.set(false);
        for (const item of items) {
          this.cargar_datos_chat(item);
        }
      },
      error: () => {
        this.cargando_chats.set(false);
      }
    });
  }

  private cargar_datos_chat(item: ChatConDatos) {
    const user = this.auth.getUser();
    if (!user) return;

    // Determinar quién es el otro usuario
    const nro_doc_otro = item.sala.nro_doc_comprador === user.nro_doc_dto
      ? item.sala.nro_doc_vendedor
      : item.sala.nro_doc_comprador;

    // Cargar datos de la persona (intentar natural primero, luego jurídica)
    this.cargar_persona(item, nro_doc_otro);

    // Cargar datos de la propiedad (intentar venta primero)
    this.inmuebleService.getVentaById(item.sala.id_prop).subscribe({
      next: (prop) => {
        item.propiedad = prop;
        item.tipo_propiedad = 'venta';
        item.cargando = false;
        this.chats_con_datos.update(items => [...items]);
      },
      error: () => {
        this.inmuebleService.getAlquilerById(item.sala.id_prop).subscribe({
          next: (prop) => {
            item.propiedad = prop;
            item.tipo_propiedad = 'alquiler';
            item.cargando = false;
            this.chats_con_datos.update(items => [...items]);
          },
          error: () => {
            item.cargando = false;
            this.chats_con_datos.update(items => [...items]);
          }
        });
      }
    });
  }

  private cargar_persona(item: ChatConDatos, nro_doc: string) {
    // Intentar como persona natural
    this.inmuebleService['http'].get<PersonaNatural>(`/tupisoya/persona/natural/${nro_doc}`).subscribe({
      next: (persona) => {
        item.otro_usuario = {
          nro_doc_dto: persona.nro_doc_per,
          email_dto: '',
          nombre_dto: `${persona.nombre_per} ${persona.apellido_pat_per}`.trim(),
          apellidos_dto: persona.apellido_mat_per || '',
          foto_dto: persona.foto_per || null
        };
        this.chats_con_datos.update(items => [...items]);
      },
      error: () => {
        // Si falla, intentar como persona jurídica
        this.inmuebleService['http'].get<PersonaJuridica>(`/tupisoya/persona/juridica/${nro_doc}`).subscribe({
          next: (persona) => {
            item.otro_usuario = {
              nro_doc_dto: persona.nro_doc_per,
              email_dto: '',
              nombre_dto: persona.nombre_per || persona.nombre_representante_juri || 'Empresa',
              apellidos_dto: '',
              foto_dto: persona.foto_per || null
            };
            this.chats_con_datos.update(items => [...items]);
          },
          error: () => {
            // Si ambas fallan, mostrar datos mínimos
            item.otro_usuario = {
              nro_doc_dto: nro_doc,
              email_dto: '',
              nombre_dto: 'Usuario',
              apellidos_dto: '',
              foto_dto: null
            };
            this.chats_con_datos.update(items => [...items]);
          }
        });
      }
    });
  }

  seleccionar_chat(item: ChatConDatos) {
    const anterior = this.sala_seleccionada();
    if (anterior) {
      this.chatService.desuscribirse_de_sala(anterior.sala.id_sala);
      if (this.suscripcion_mensajes) {
        this.suscripcion_mensajes.unsubscribe();
      }
    }

    this.chatService.marcar_sala_como_leida(item.sala.id_sala);
    this.sala_seleccionada.set(item);
    this.cargar_mensajes_sala(item.sala.id_sala);
    this.suscribirse_ws_sala(item.sala.id_sala);
    this.iniciar_polling(item.sala.id_sala);
  }

  private cargar_mensajes_sala(id_sala: number) {
    this.cargando_mensajes.set(true);
    this.chatService.cargar_historial(id_sala).subscribe({
      next: (historial) => {
        this.mensajes.set(historial);
        this.cargando_mensajes.set(false);
        this.scroll_al_final();
      },
      error: () => {
        this.cargando_mensajes.set(false);
      }
    });
  }

  private suscribirse_ws_sala(id_sala: number) {
    this.suscripcion_mensajes = this.chatService.nuevo_mensaje$.subscribe((mensaje) => {
      if (mensaje && mensaje.id_sala === id_sala) {
        this.mensajes.update(msgs => {
          const existe = msgs.some(m => m.id_mensaje === mensaje.id_mensaje);
          if (existe) return msgs;
          return [...msgs, mensaje];
        });
        this.scroll_al_final();
      }
    });
    this.chatService.suscribirse_a_sala(id_sala);
  }

  enviar_mensaje() {
    const texto = this.texto_input().trim();
    if (!texto || !this.sala_seleccionada()) return;

    const sala = this.sala_seleccionada()!.sala;
    this.enviando.set(true);

    const mensaje_ws: MensajeInboundDTO = {
      id_sala: sala.id_sala,
      emisor_email: this.email_usuario(),
      contenido: texto
    };

    if (this.chatService.esta_conectado_ws()) {
      this.chatService.enviar_mensaje_ws(mensaje_ws);
      this.texto_input.set('');
      this.enviando.set(false);
    } else {
      const mensaje_http: MensajeChat = {
        id_sala: sala.id_sala,
        emisor_email: this.email_usuario(),
        contenido: texto
      };
      this.chatService.enviar_mensaje_http(mensaje_http).subscribe({
        next: (msg) => {
          this.mensajes.update(msgs => [...msgs, msg]);
          this.texto_input.set('');
          this.enviando.set(false);
          this.scroll_al_final();
        },
        error: () => {
          this.enviando.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo enviar el mensaje.'
          });
        }
      });
    }
  }

  private iniciar_polling(id_sala: number) {
    this.detener_polling();
    this.polling_interval = setInterval(() => {
      this.chatService.cargar_historial(id_sala).subscribe({
        next: (historial) => {
          const actuales = this.mensajes();
          if (historial.length > actuales.length) {
            const mensajes_nuevos = historial.slice(actuales.length);
            const mensajes_de_otro = mensajes_nuevos.filter(m => m.emisor_email !== this.email_usuario());
            if (mensajes_de_otro.length > 0) {
              this.chatService.incrementar_no_leidos(id_sala);
            }
            this.mensajes.set(historial);
            this.scroll_al_final();
          }
        }
      });
    }, 5000);
  }

  private detener_polling() {
    if (this.polling_interval) {
      clearInterval(this.polling_interval);
      this.polling_interval = null;
    }
  }

  private scroll_al_final() {
    setTimeout(() => {
      if (this.scrollContainer?.nativeElement) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  obtener_nombre(persona: Persona | null): string {
    if (!persona) return 'Cargando...';
    if (persona.nombre_dto) return persona.nombre_dto;
    if (persona.email_dto) return persona.email_dto;
    return 'Usuario';
  }

  obtener_iniciales(persona: Persona | null): string {
    const nombre = this.obtener_nombre(persona);
    return nombre.charAt(0).toUpperCase() || '?';
  }

  ir_a_propiedad(id_prop: number) {
    const item = this.sala_seleccionada();
    const tipo = item?.tipo_propiedad || 'venta';
    const ruta = tipo === 'alquiler' ? '/detalle-alquiler' : '/detalle-venta';
    this.router.navigate([ruta, id_prop]);
  }

  obtener_foto_principal(propiedad: PropiedadVenta | PropiedadAlquiler | null): string | null {
    if (!propiedad) return null;
    // Intentar foto_principal (string directa)
    const fotoPrincipal = (propiedad as any).foto_principal;
    if (fotoPrincipal && typeof fotoPrincipal === 'string') {
      return fotoPrincipal;
    }
    // Intentar fotos_urls (array de strings)
    const fotosUrls = (propiedad as any).fotos_urls;
    if (fotosUrls && Array.isArray(fotosUrls) && fotosUrls.length > 0) {
      return fotosUrls[0];
    }
    // Intentar fotos (array de objetos Foto)
    const fotos = (propiedad as any).fotos;
    if (fotos && Array.isArray(fotos) && fotos.length > 0) {
      return fotos[0].url_foto || null;
    }
    return null;
  }
}
