import { Component, OnInit } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import {AppFloatingConfigurator} from "@/app/layout/component/app.floatingconfigurator";
import { Auth } from '../../service/auth.service';
import { UserDTO } from '../../interfaces/user-dto';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

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
        AppFloatingConfigurator
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
                <!-- Si está logueado: mostrar avatar + nombre -->
                @if (isLoggedIn) {
                    <button pButton
                        pRipple
                        [rounded]="true"
                        [text]="true"
                        class="user-profile-btn"
                        (click)="router.navigate(['/publicaciones'])"
                        pTooltip="Mis publicaciones"
                        tooltipPosition="bottom">
                        <i class="pi pi-list text-xl"></i>
                    </button>
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
                <app-floating-configurator [float]="false"/>
            </div>
        </div>
    `,
    
})
export class TopbarWidget implements OnInit {
    isLoggedIn = false;
    user: UserDTO | null = null;

    constructor(
        public router: Router,
        private authService: Auth
    ) {}

    ngOnInit() {
        this.isLoggedIn = this.authService.isLoggedIn();
        this.user = this.authService.getUser();
    }

    getInitials(): string {
        if (!this.user) return '?';
        const nombre = this.user.nombre_representante_juri || '';
        const apellido = this.user.apellidos_dto || '';
        return (nombre.charAt(0) + apellido.charAt(0)).toUpperCase() || '?';
    }

    getFullName(): string {
        if (!this.user) return 'Usuario';
        if (this.user.type === 'juridica') {
            return this.user.nombre_representante_juri || 'Usuario';
        }
        const partes = [this.user.nombre_representante_juri ];
        return partes.filter(p => p && p !== 'N/A').join(' ') || 'Usuario';
    }
}
