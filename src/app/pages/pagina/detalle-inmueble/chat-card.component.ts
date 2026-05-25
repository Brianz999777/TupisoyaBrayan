import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ChatService } from '../../service/chat.service';
import { Auth } from '../../service/auth.service';
import { MensajeChat, SalaChat, MensajeInboundDTO } from '../../interfaces/chat.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div class="flex items-center gap-3 p-6 border-b border-gray-100 dark:border-gray-700">
        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
          <i class="pi pi-comments text-white text-sm"></i>
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Contactar</h3>
          <p class="text-sm text-gray-400">Habla directamente con el propietario</p>
        </div>
      </div>

      <div class="flex flex-col h-[400px]">
        <div class="flex-1 overflow-y-auto p-4 space-y-3" #scrollContainer>
          @if (cargando_historial()) {
            <div class="flex items-center justify-center h-full">
              <i class="pi pi-spin pi-spinner text-2xl text-emerald-400"></i>
            </div>
          } @else if (mensajes().length === 0) {
            <div class="flex flex-col items-center justify-center h-full text-center px-4">
              <div class="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-3">
                <i class="pi pi-comment text-2xl text-emerald-400"></i>
              </div>
              <p class="text-sm font-bold text-gray-900 dark:text-white mb-1">Sin mensajes aún</p>
              <p class="text-xs text-gray-400">Pregunta al dueño sobre el inmueble. ¡Sé el primero en escribir!</p>
            </div>
          } @else {
            @for (msg of mensajes(); track msg.id_mensaje || $index) {
              <div class="flex" [ngClass]="{'justify-end': msg.emisor_email === email_usuario(), 'justify-start': msg.emisor_email !== email_usuario()}">
                <div
                  class="max-w-[80%] rounded-2xl px-4 py-2.5"
                  [ngClass]="{
                    'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-md': msg.emisor_email === email_usuario(),
                    'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md': msg.emisor_email !== email_usuario()
                  }"
                >
                  <p class="text-sm leading-relaxed whitespace-pre-wrap break-words">{{ msg.contenido }}</p>
                  <div class="flex items-center gap-1 mt-1" [ngClass]="{'justify-end': msg.emisor_email === email_usuario(), 'justify-start': msg.emisor_email !== email_usuario()}">
                    <span class="text-[10px]" [ngClass]="msg.emisor_email === email_usuario() ? 'text-emerald-100' : 'text-gray-400'">
                      {{ msg.fecha_envio ? (msg.fecha_envio | date:'HH:mm') : '' }}
                    </span>
                    @if (msg.emisor_email === email_usuario() && msg.leido !== undefined) {
                      <i class="pi ml-1" style="font-size: 14px !important;" [ngClass]="msg.leido ? 'pi-check-circle text-blue-400 drop-shadow-sm' : 'pi-check text-gray-400'" [title]="msg.leido ? 'Leído' : 'Enviado'"></i>
                    }
                  </div>
                </div>
              </div>
            }
          }
        </div>

        <div class="border-t border-gray-100 dark:border-gray-700 p-4">
          @if (!sala_activa()) {
            <button
              pButton
              [disabled]="iniciando_chat()"
              (click)="iniciar_o_crear_sala()"
              class="!bg-gradient-to-r !from-emerald-500 !to-teal-500 !text-white !font-bold !rounded-full !border-0 !px-6 !py-2.5 hover:!from-emerald-600 hover:!to-teal-600 !transition-all !shadow-lg !shadow-emerald-500/25 !w-full"
            >
              @if (iniciando_chat()) {
                <i class="pi pi-spin pi-spinner mr-2"></i>
              }
              {{ iniciando_chat() ? 'Iniciando chat...' : 'Chatear con el dueño' }}
            </button>
          } @else {
            <div class="flex gap-2">
              <input
                type="text"
                pInputText
                [ngModel]="texto_input()"
                (ngModelChange)="texto_input.set($event)"
                (keyup.enter)="enviar_mensaje()"
                (focus)="marcar_mensajes_como_leidos()"
                placeholder="Escribe un mensaje..."
                maxlength="1000"
                class="flex-1 !rounded-full !border-gray-200 dark:!border-gray-600 !bg-gray-50 dark:!bg-gray-700"
              />
              <button
                pButton
                icon="pi pi-send"
                [disabled]="!texto_input().trim() || enviando()"
                (click)="enviar_mensaje()"
                class="!w-10 !h-10 !rounded-full !bg-gradient-to-r !from-emerald-500 !to-teal-500 !text-white !border-0 hover:!from-emerald-600 hover:!to-teal-600 !transition-all !shadow-md !shadow-emerald-500/25 !flex !items-center !justify-center"
              ></button>
            </div>
          }
        </div>
      </div>
    </div>

    <p-toast position="top-right" />
  `,
  styles: [`
    :host {
      display: block;
    }
    .overflow-y-auto::-webkit-scrollbar {
      width: 4px;
    }
    .overflow-y-auto::-webkit-scrollbar-track {
      background: transparent;
    }
    .overflow-y-auto::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 4px;
    }
    .dark .overflow-y-auto::-webkit-scrollbar-thumb {
      background: #4b5563;
    }
  `]
})
export class ChatCard implements OnInit, OnDestroy, OnChanges {
  @Input() id_prop!: number;
  @Input() email_vendedor!: string;
  @Input() nro_doc_vendedor!: string;

  private chatService = inject(ChatService);
  private auth = inject(Auth);
  private messageService = inject(MessageService);

  mensajes = signal<MensajeChat[]>([]);
  texto_input = signal('');
  sala_activa = signal<SalaChat | null>(null);
  cargando_historial = signal(false);
  iniciando_chat = signal(false);
  enviando = signal(false);
  email_usuario = signal('');
  nro_doc_usuario = signal('');

  private suscripcion_mensajes: Subscription | null = null;
  private polling_interval: any = null;
  private ya_inicializado = false;

  constructor() {
    const token = this.auth.getToken();
    const user = token ? this.auth.getUser() : null;
    if (user) {
      this.email_usuario.set(user.email_dto);
      this.nro_doc_usuario.set(user.nro_doc_dto);
    }
  }

  ngOnInit() {
    if (this.auth.getToken()) {
      this.chatService.conectar_websocket();
    }
    this.intentar_cargar_sala();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['nro_doc_vendedor'] && !changes['nro_doc_vendedor'].firstChange) {
      this.intentar_cargar_sala();
    }
    if (changes['email_vendedor'] && !changes['email_vendedor'].firstChange) {
      this.intentar_cargar_sala();
    }
  }

  private intentar_cargar_sala(): void {
    if (this.ya_inicializado) return;
    if (!this.email_usuario() || !this.nro_doc_vendedor) return;
    if (this.email_usuario() === this.email_vendedor) return;
    this.ya_inicializado = true;
    this.cargar_sala_existente();
  }

  ngOnDestroy() {
    this.detener_polling();
    if (this.suscripcion_mensajes) {
      this.suscripcion_mensajes.unsubscribe();
    }
    const sala = this.sala_activa();
    if (sala) {
      this.chatService.desuscribirse_de_sala(sala.id_sala);
    }
  }

  private cargar_sala_existente() {
    this.iniciando_chat.set(true);
    this.chatService.obtener_o_crear_sala(this.id_prop, this.nro_doc_usuario(), this.nro_doc_vendedor).subscribe({
      next: (sala: SalaChat) => {
        this.sala_activa.set(sala);
        this.iniciando_chat.set(false);
        this.cargar_historial();
        this.iniciar_polling();
        this.suscribirse_ws_sala(sala.id_sala);
      },
      error: () => {
        this.iniciando_chat.set(false);
      }
    });
  }

  iniciar_o_crear_sala() {
    if (!this.email_usuario()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Inicia sesión',
        detail: 'Debes iniciar sesión para chatear con el dueño.'
      });
      return;
    }

    if (this.email_usuario() === this.email_vendedor) {
      this.messageService.add({
        severity: 'info',
        summary: 'Eres el dueño',
        detail: 'No puedes chatear contigo mismo. Espera a que un interesado te escriba.'
      });
      return;
    }

    this.iniciando_chat.set(true);
    this.chatService.obtener_o_crear_sala(this.id_prop, this.nro_doc_usuario(), this.nro_doc_vendedor).subscribe({
      next: (sala: SalaChat) => {
        this.sala_activa.set(sala);
        this.iniciando_chat.set(false);
        this.cargar_historial();
        this.iniciar_polling();
        this.suscribirse_ws_sala(sala.id_sala);
      },
      error: () => {
        this.iniciando_chat.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo iniciar el chat.'
        });
      }
    });
  }

  private cargar_historial() {
    const sala = this.sala_activa();
    if (!sala) return;

    this.cargando_historial.set(true);
    this.chatService.cargar_historial(sala.id_sala).subscribe({
      next: (historial: MensajeChat[]) => {
        this.mensajes.set(historial);
        this.cargando_historial.set(false);
        this.scroll_al_final();
      },
      error: () => {
        this.cargando_historial.set(false);
      }
    });
  }

  private suscribirse_ws_sala(id_sala: number): void {
    this.suscripcion_mensajes = this.chatService.nuevo_mensaje$.subscribe((mensaje: MensajeChat | null) => {
      if (mensaje && mensaje.id_sala === id_sala) {
        this.mensajes.update(msgs => {
          const existe = msgs.some(m => m.id_mensaje === mensaje.id_mensaje);
          if (existe) return msgs;
          // Si el mensaje es de otro, marcarlo como leído automáticamente
          const leido = mensaje.emisor_email !== this.email_usuario();
          return [...msgs, { ...mensaje, leido }];
        });
        this.scroll_al_final();
      }
    });

    this.chatService.suscribirse_a_sala(id_sala);
  }

  /** Marca todos los mensajes de otros como leídos (localmente) */
  marcar_mensajes_como_leidos(): void {
    this.mensajes.update(msgs =>
      msgs.map(m => {
        if (m.emisor_email !== this.email_usuario()) {
          return { ...m, leido: true };
        }
        return m;
      })
    );
  }

  enviar_mensaje() {
    const texto = this.texto_input().trim();
    if (!texto || !this.sala_activa()) return;

    const sala = this.sala_activa()!;
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
        next: (msg: MensajeChat) => {
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

  private iniciar_polling() {
    this.polling_interval = setInterval(() => {
      const sala = this.sala_activa();
      if (sala) {
        this.chatService.cargar_historial(sala.id_sala).subscribe({
          next: (historial: MensajeChat[]) => {
            const actuales = this.mensajes();
            if (historial.length !== actuales.length) {
              this.mensajes.set(historial);
              this.scroll_al_final();
            }
          }
        });
      }
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
      const container = document.querySelector('.overflow-y-auto');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }
}
