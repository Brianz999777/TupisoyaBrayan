import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { UserDTO } from '../../interfaces/user-dto';
import { Auth } from '../../service/auth.service';
import { NotificacionService } from '../../service/notificacion.service';
import { Notificacion } from '../../interfaces/notificacion';

@Component({
    selector: 'topbar-widget',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        StyleClassModule,
        ButtonModule,
        RippleModule,
        AvatarModule,
        TooltipModule
    ],
    template: `
        <a class="flex items-center cursor-pointer" (click)="router.navigate(['/landing'])">
            <img src="/demo/images/galleria/logo.png" alt="TuPisoYa Logo" class="h-16 md:h-24 mr-20">
        </a>

        <a pButton [text]="true" severity="secondary" [rounded]="true" pRipple class="lg:hidden!" pStyleClass="@next" enterFromClass="hidden" leaveToClass="hidden" [hideOnOutsideClick]="true">
            <i class="pi pi-bars text-2xl!"></i>
        </a>

        <div class="items-center bg-surface-0 dark:bg-surface-900 grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
            <ul class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer gap-8">
                <li>
                    <a (click)="router.navigate(['/landing'])" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl hover:text-primary-500 transition-colors">
                        <span>Home</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate(['/nosotros'])" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl hover:text-primary-500 transition-colors">
                        <span>Nosotros</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate(['/servicios'])" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl hover:text-primary-500 transition-colors">
                        <span>Servicios</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate(['/contacto'])" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl hover:text-primary-500 transition-colors">
                        <span>Contacto</span>
                    </a>
                </li>
                @if (isLoggedIn) {
                    <li>
                        <a (click)="router.navigate(['/publicaciones'])" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl hover:text-primary-500 transition-colors">
                            <span>Publicaciones</span>
                        </a>
                    </li>
                }
            </ul>
            <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2 items-center">
                <!-- Si está logueado: notificaciones + avatar + nombre -->
                @if (isLoggedIn) {
                    <!-- Botón de notificaciones con contador -->
                    <div class="noti-wrapper" (mouseenter)="showNotiPanel = true" (mouseleave)="showNotiPanel = false" (click)="showNotiPanel = true">
                        <button pButton
                            pRipple
                            [rounded]="true"
                            [text]="true"
                            class="noti-btn"
                            pTooltip="Notificaciones"
                            tooltipPosition="bottom">
                            <i class="pi pi-bell text-xl"></i>
                            @if (notificacionesNoLeidas > 0) {
                                <span class="noti-badge">{{ notificacionesNoLeidas }}</span>
                            }
                        </button>

                        <!-- Panel de notificaciones -->
                        @if (showNotiPanel) {
                            <div class="noti-panel">
                                <div class="noti-header">
                                    <h3 class="noti-title">Notificaciones</h3>
                                    @if (notificacionesNoLeidas > 0) {
                                        <span class="noti-count-badge">{{ notificacionesNoLeidas }} sin leer</span>
                                    }
                                </div>
                                @if (notificacionesCargando) {
                                    <div class="flex items-center justify-center py-6">
                                        <i class="pi pi-spin pi-spinner text-2xl text-gray-400"></i>
                                    </div>
                                } @else if (notificaciones.length === 0) {
                                    <div class="text-center py-8">
                                        <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                                            <i class="pi pi-inbox text-2xl text-gray-400"></i>
                                        </div>
                                        <p class="text-gray-500 font-medium">No hay notificaciones</p>
                                        <p class="text-gray-400 text-sm mt-1">Las notificaciones aparecerán aquí</p>
                                    </div>
                                } @else {
                                    <div class="noti-scrollable">
                                        @for (noti of notificaciones; track noti.id_noti) {
                                            <div class="noti-item" [class.noti-unread]="!noti.leida_noti" (click)="irANotificacion(noti)">
                                                <div class="noti-item-dot" [class.bg-purple-500]="!noti.leida_noti" [class.bg-gray-300]="noti.leida_noti"></div>
                                                <div class="noti-item-content">
                                                    <span class="noti-item-text" [class.font-bold]="!noti.leida_noti" [class.text-gray-500]="noti.leida_noti">
                                                        {{ noti.mensaje_noti }}
                                                    </span>
                                                    <span class="noti-item-time">{{ noti.fecha_noti | date:'dd/MM/yyyy HH:mm' }}</span>
                                                </div>
                                                @if (!noti.leida_noti) {
                                                    <span class="noti-unread-dot"></span>
                                                }
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        }
                    </div>

                    <!-- Avatar + Nombre + Perfil -->
                    <button pButton
                        pRipple
                        [rounded]="true"
                        [text]="true"
                        class="user-profile-btn"
                        (click)="router.navigate(['/perfil'])"
                        pTooltip="Ir a mi perfil"
                        tooltipPosition="bottom">
                        <div class="flex items-center gap-3">
                            <p-avatar
                                [label]="getInitials()"
                                size="normal"
                                shape="circle"
                                styleClass="topbar-avatar"
                                [style]="{ 'background': 'linear-gradient(135deg, #D4E157, #A3C92A)', 'color': '#1A262F', 'font-weight': '800', 'width': '36px', 'height': '36px', 'font-size': '0.85rem' }"
                            ></p-avatar>
                            <span class="font-bold text-surface-900 dark:text-surface-0 hidden md:inline">{{ getFullName() }}</span>
                        </div>
                    </button>
                } @else {
                    <button pButton pRipple label="Iniciar Sesión" routerLink="/login" [rounded]="true" [text]="true"></button>
                    <button pButton pRipple label="Registrarse" routerLink="/register" [rounded]="true"></button>
                }
            </div>
        </div>
    `,
    styles: [`
        .user-profile-btn {
            &:hover {
                background: rgba(212, 225, 87, 0.15) !important;
            }
        }
        .topbar-avatar {
            transition: transform 0.2s ease;
        }
        .user-profile-btn:hover .topbar-avatar {
            transform: scale(1.1);
        }
        .noti-wrapper {
            position: relative;
        }
        .noti-btn {
            position: relative;
            &:hover {
                background: rgba(212, 225, 87, 0.15) !important;
            }
        }
        .noti-badge {
            position: absolute;
            top: -2px;
            right: -2px;
            background: #ef4444;
            color: #fff;
            font-size: 0.65rem;
            font-weight: 700;
            min-width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            padding: 0 4px;
            border: 2px solid var(--surface-ground, #f8fafc);
        }
        .noti-panel {
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            width: 380px;
            max-height: 480px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
            border: 1px solid rgba(0,0,0,0.06);
            z-index: 1000;
            overflow: hidden;
            animation: notiFadeIn 0.2s ease;
        }
        @keyframes notiFadeIn {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .noti-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.85rem 1rem;
            border-bottom: 1px solid #f1f5f9;
            .noti-title {
                font-size: 1rem;
                font-weight: 700;
                color: #1e293b;
                margin: 0;
            }
            .noti-count-badge {
                background: #8b5cf6;
                color: #fff;
                font-size: 0.7rem;
                font-weight: 700;
                padding: 0.15rem 0.5rem;
                border-radius: 999px;
            }
        }
        .noti-scrollable {
            max-height: 380px;
            overflow-y: auto;
            &::-webkit-scrollbar {
                width: 5px;
            }
            &::-webkit-scrollbar-track {
                background: transparent;
            }
            &::-webkit-scrollbar-thumb {
                background: #d1d5db;
                border-radius: 999px;
            }
        }
        .noti-item {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            padding: 0.85rem 1rem;
            cursor: pointer;
            transition: background 0.2s ease;
            border-bottom: 1px solid #f8fafc;
            &:hover {
                background: #f8fafc;
            }
            &:last-child {
                border-bottom: none;
            }
            .noti-item-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                flex-shrink: 0;
                margin-top: 4px;
            }
            .noti-item-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 0.15rem;
                min-width: 0;
                .noti-item-text {
                    font-size: 0.85rem;
                    color: #1e293b;
                    line-height: 1.4;
                    word-wrap: break-word;
                }
                .noti-item-time {
                    font-size: 0.75rem;
                    color: #94a3b8;
                }
            }
            .noti-unread-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #8b5cf6;
                flex-shrink: 0;
                margin-top: 5px;
            }
        }
        .noti-unread {
            background: #f5f3ff !important;
            &:hover {
                background: #ede9fe !important;
            }
        }
        :host-context(.dark) {
            .noti-panel {
                background: #1e293b;
                border-color: rgba(255,255,255,0.08);
            }
            .noti-header {
                border-color: rgba(255,255,255,0.05);
                .noti-title { color: #f1f5f9; }
            }
            .noti-item {
                border-color: rgba(255,255,255,0.03);
                &:hover {
                    background: rgba(255,255,255,0.03);
                }
                .noti-item-content .noti-item-text {
                    color: #e2e8f0;
                }
            }
            .noti-unread {
                background: rgba(139, 92, 246, 0.1) !important;
                &:hover {
                    background: rgba(139, 92, 246, 0.15) !important;
                }
            }
            .noti-badge {
                border-color: #0f172a;
            }
        }
    `]
})
export class TopbarWidget implements OnInit {
    isLoggedIn = false;
    user: UserDTO | null = null;
    notificaciones: Notificacion[] = [];
    notificacionesCargando = false;
    notificacionesNoLeidas = 0;
    showNotiPanel = false;

    constructor(
        public router: Router,
        private authService: Auth,
        private notificacionService: NotificacionService
    ) {}

    ngOnInit() {
        this.isLoggedIn = this.authService.isLoggedIn();
        this.user = this.authService.getUser();
        if (this.isLoggedIn && this.user?.email_dto) {
            this.cargarNotificaciones();
        }
    }

    cargarNotificaciones() {
        if (!this.user?.email_dto) return;
        this.notificacionesCargando = true;
        this.notificacionService.listarNotificaciones(this.user.email_dto).subscribe({
            next: (data) => {
                // Ordenar por fecha descendente (último primero)
                const ordenadas = [...data].sort((a, b) => {
                    if (!a.fecha_noti) return 1;
                    if (!b.fecha_noti) return -1;
                    return new Date(b.fecha_noti).getTime() - new Date(a.fecha_noti).getTime();
                });
                this.notificaciones = ordenadas.slice(0, 7);
                this.notificacionesNoLeidas = data.filter(n => !n.leida_noti).length;
                this.notificacionesCargando = false;
            },
            error: (err) => {
                console.error('[Topbar] Error al cargar notificaciones:', err);
                this.notificacionesCargando = false;
            }
        });
    }

    irANotificacion(noti: Notificacion) {
        // Marcar como leída si no lo está
        if (!noti.leida_noti) {
            this.notificacionService.marcarLeida(noti.id_noti).subscribe({
                next: () => {
                    noti.leida_noti = true;
                    this.notificacionesNoLeidas = Math.max(0, this.notificacionesNoLeidas - 1);
                },
                error: (err) => console.error('[Topbar] Error al marcar notificación como leída:', err)
            });
        }
        // Redirigir al landing con query params (el landing ya maneja ?detalle=ID&tipo=TIPO)
        const tipo = noti.tipo_prop_noti?.toLowerCase() || 'venta';
        const id = noti.id_prop_noti;
        if (id) {
            this.router.navigate(['/landing'], {
                queryParams: { detalle: id, tipo: tipo }
            });
        } else {
            this.router.navigate(['/landing']);
        }
        this.showNotiPanel = false;
    }

    getInitials(): string {
        if (!this.user) return '?';
        const apellidos = this.user.apellidos_dto || '';
        return apellidos.charAt(0).toUpperCase() || '?';
    }

    getFullName(): string {
        if (!this.user) return 'Usuario';
        return this.user.apellidos_dto || 'Usuario';
    }
}
