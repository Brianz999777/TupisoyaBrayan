import { Component, OnInit, OnDestroy, HostListener, Input } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { Subscription } from 'rxjs';
import { Auth } from '../../service/auth.service';
import { UserDTO } from '../../interfaces/user-dto';
import { ChatService } from '../../service/chat.service';

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
        TooltipModule,
        BadgeModule
    ],
    template: `
        <nav [ngClass]="(isHero && !isScrolled) ? 'bg-transparent border-transparent py-[1.1rem]' : 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-800/50 py-3.5'"
             class="fixed top-0 left-0 right-0 z-50 px-6 lg:px-16 transition-all duration-300">
            <div class="max-w-[117rem] mx-auto flex items-center justify-between">
                <!-- Logo -->
                <a class="flex items-center gap-3 cursor-pointer group" (click)="goToLanding()">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200/50 group-hover:scale-105 transition-transform">
                        <i class="pi pi-home text-white text-xl"></i>
                    </div>
                    <span [ngClass]="(isHero && !isScrolled) ? 'text-white' : 'text-gray-900 dark:text-white'"
                          class="text-2xl font-black tracking-tight transition-colors duration-300">
                        TuPisoYa
                    </span>
                </a>

                <!-- Desktop Nav -->
                <div class="hidden lg:flex items-center gap-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-full px-3 py-2 border-2 border-emerald-500/20 dark:border-emerald-500/35 shadow-lg shadow-emerald-500/5">
                    <a (click)="goToLanding()" class="px-6 py-3 rounded-full text-base font-bold text-gray-800 dark:text-gray-100 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white dark:hover:text-white transition-all duration-300 cursor-pointer">
                        Inicio
                    </a>
                    <a (click)="router.navigate(['/comprar'])" class="px-6 py-3 rounded-full text-base font-bold text-gray-800 dark:text-gray-100 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white dark:hover:text-white transition-all duration-300 cursor-pointer">
                        Comprar
                    </a>
                    <a (click)="router.navigate(['/alquilar'])" class="px-6 py-3 rounded-full text-base font-bold text-gray-800 dark:text-gray-100 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white dark:hover:text-white transition-all duration-300 cursor-pointer">
                        Alquilar
                    </a>
                    <a (click)="router.navigate(['/nosotros'])" class="px-6 py-3 rounded-full text-base font-bold text-gray-800 dark:text-gray-100 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white dark:hover:text-white transition-all duration-300 cursor-pointer">
                        Nosotros
                    </a>
                    <a (click)="router.navigate(['/contacto'])" class="px-6 py-3 rounded-full text-base font-bold text-gray-800 dark:text-gray-100 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white dark:hover:text-white transition-all duration-300 cursor-pointer">
                        Contacto
                    </a>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-3">
                    @if (isLoggedIn) {
                        <!-- Botón de mensajes con badge -->
                        <div (click)="router.navigate(['/mensajes'])"
                            [ngClass]="(isHero && !isScrolled) ? 'bg-white/10 hover:bg-white/20 border-white/20' : 'bg-gray-100/70 hover:bg-gray-200/70 dark:bg-gray-800/70 dark:hover:bg-gray-700 border-gray-200/50 dark:border-gray-700'"
                            class="relative w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-sm border"
                            pTooltip="Mensajes" tooltipPosition="bottom">
                            <i class="pi pi-comments" [ngClass]="(isHero && !isScrolled) ? 'text-white' : 'text-gray-600 dark:text-gray-300'"></i>
                            @if (total_no_leidos > 0) {
                                <span class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
                                    {{ total_no_leidos > 99 ? '99+' : total_no_leidos }}
                                </span>
                            }
                        </div>

                        <div (click)="router.navigate(['/perfil'])"
                            [ngClass]="(isHero && !isScrolled) ? 'bg-white/10 hover:bg-white/20 border-white/20' : 'bg-gray-100/70 hover:bg-gray-200/70 dark:bg-gray-800/70 dark:hover:bg-gray-700 border-gray-200/50 dark:border-gray-700'"
                            class="flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full border shadow-sm transition-all duration-300 cursor-pointer group">
                            <span [ngClass]="(isHero && !isScrolled) ? 'text-white' : 'text-gray-700 dark:text-gray-200'"
                                  class="text-sm font-semibold tracking-wide">
                                {{ user?.nombre_dto || user?.email_dto || 'Usuario' }}
                                @if (user?.type === 'juridica') {
                                    <span [ngClass]="(isHero && !isScrolled) ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'"
                                          class="text-xs ml-1">(Empresa)</span>
                                }
                            </span>
                            <p-avatar [label]="getInitials()" size="normal" shape="circle"
                                [style]="{ 'background': 'linear-gradient(135deg, #34d399, #14b8a6)', 'color': '#fff', 'font-weight': '700', 'width': '32px', 'height': '32px', 'font-size': '0.8rem' }">
                            </p-avatar>
                        </div>
                    } @else {
                        <button pButton pRipple label="Entrar" routerLink="/login" [rounded]="true" [text]="true"
                            [ngClass]="(isHero && !isScrolled) ? '!text-white hover:!bg-white/10' : '!text-gray-700 dark:!text-gray-200 hover:!bg-gray-100 dark:hover:!bg-gray-800'"
                            class="!text-sm !font-semibold transition-all duration-300"></button>
                        <button pButton pRipple label="Registrarse" routerLink="/register" [rounded]="true"
                            class="!text-sm !font-semibold !bg-gradient-to-r !from-emerald-500 !to-teal-500 !border-0 !text-white !shadow-lg !shadow-emerald-500/20 !px-5 hover:scale-[1.03] transition-transform duration-300"></button>
                    }
                    <!-- Mobile menu -->
                    <button pButton [rounded]="true" [text]="true" class="lg:!hidden !w-10 !h-10 !rounded-xl"
                        [ngClass]="(isHero && !isScrolled) ? '!text-white hover:!bg-white/10' : '!text-gray-700 dark:!text-gray-200 hover:!bg-gray-100 dark:hover:!bg-gray-800'"
                        pStyleClass="@next" enterFromClass="hidden" leaveToClass="hidden" [hideOnOutsideClick]="true">
                        <i class="pi pi-bars text-lg"></i>
                    </button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div class="hidden lg:hidden mt-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-gray-700">
                <div class="flex flex-col gap-1">
                    <a (click)="goToLanding()" class="px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer">Inicio</a>
                    <a (click)="router.navigate(['/comprar'])" class="px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer">Comprar</a>
                    <a (click)="router.navigate(['/alquilar'])" class="px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer">Alquilar</a>
                    <a (click)="router.navigate(['/nosotros'])" class="px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer">Nosotros</a>
                    <a (click)="router.navigate(['/contacto'])" class="px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer">Contacto</a>
                </div>
            </div>
        </nav>
    `
})
export class TopbarWidget implements OnInit, OnDestroy {
    @Input() isHero = true;

    isLoggedIn = false;
    user: UserDTO | null = null;
    isScrolled = false;
    total_no_leidos = 0;

    private suscripcion_no_leidos: Subscription | null = null;

    constructor(
        public router: Router,
        private authService: Auth,
        private chatService: ChatService
    ) {}

    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.isScrolled = window.scrollY > 20;
    }

    ngOnInit() {
        this.isLoggedIn = this.authService.isLoggedIn();
        this.user = this.authService.getUser();
        if (this.isLoggedIn) {
            this.suscripcion_no_leidos = this.chatService.total_no_leidos$.subscribe(total => {
                this.total_no_leidos = total;
            });
        }
    }

    ngOnDestroy() {
        if (this.suscripcion_no_leidos) {
            this.suscripcion_no_leidos.unsubscribe();
        }
    }

    goToLanding() {
        this.router.navigate(['/landing'], { queryParams: {} });
    }

    getInitials(): string {
        if (!this.user) return '?';
        const nombre = this.user.nombre_dto || '';
        return nombre.charAt(0).toUpperCase() || '?';
    }
}
