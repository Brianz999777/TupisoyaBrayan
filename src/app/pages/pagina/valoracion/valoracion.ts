import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TopbarWidget } from '../topbar/topbarwidget.component';
import { FooterWidget } from '../topbar/footerwidget';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-valoracion',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, TopbarWidget, FooterWidget, ButtonModule, RippleModule, InputTextModule],
    template: `
        <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950">
            <topbar-widget class="py-6 px-6 lg:px-20 flex items-center justify-between relative lg:static" />
            <div class="flex-1">
                <!-- Hero -->
                <section class="relative pt-32 pb-28 overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"></div>
                    <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2"></div>
                    <div class="absolute bottom-0 left-0 w-80 h-80 bg-teal-200/20 dark:bg-teal-500/5 rounded-full blur-3xl translate-y-1/2"></div>
                    <div class="relative z-10 max-w-[90rem] mx-auto px-8 lg:px-24 text-center">
                        <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">Valoración <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">gratuita</span></h1>
                        <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Descubre el valor real de tu inmueble en menos de 2 minutos con nuestro algoritmo inteligente.</p>
                    </div>
                </section>

                <!-- Stepper -->
                <div class="max-w-2xl mx-auto px-6 -mt-14 relative z-20" *ngIf="paso < 4">
                    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl shadow-emerald-500/5 border border-gray-100 dark:border-gray-700">
                        <div class="flex justify-between mb-4 relative">
                            <div class="absolute top-5 left-[12.5%] right-[12.5%] h-1 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
                            <div class="absolute top-5 left-[12.5%] h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 z-0"
                                [style.width]="((paso - 1) / 2) * 75 + '%'"></div>
                            <div *ngFor="let i of [1, 2, 3]" class="flex flex-col items-center gap-2 z-10">
                                <div class="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300"
                                    [class]="paso >= i ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'">
                                    <i *ngIf="paso > i" class="pi pi-check text-sm"></i>
                                    <span *ngIf="paso <= i">{{ i }}</span>
                                </div>
                                <span class="text-[10px] font-bold uppercase tracking-wider text-center"
                                    [class]="paso >= i ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'">
                                    {{ ['Ubicación', 'Detalles', 'Contacto'][i - 1] }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Formulario -->
                <section class="py-12 bg-gray-50 dark:bg-gray-900/50">
                    <div class="max-w-2xl mx-auto px-6">
                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-10 shadow-xl shadow-emerald-500/5 border border-gray-100 dark:border-gray-700">
                            <!-- Paso 1: Tipo y Ubicación -->
                            <div *ngIf="paso === 1">
                                <div class="text-center pb-6 border-b border-gray-100 dark:border-gray-700">
                                    <h2 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">¿Dónde está tu inmueble?</h2>
                                    <p class="text-gray-500 dark:text-gray-400 font-medium">Selecciona el tipo y la ubicación.</p>
                                </div>
                                <div class="mt-8 space-y-6">
                                    <div class="flex flex-col gap-2">
                                        <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo de Inmueble</label>
                                        <div class="grid grid-cols-2 gap-4">
                                            <button (click)="datos.tipo = 'piso'"
                                                [class]="datos.tipo === 'piso' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5 shadow-lg shadow-emerald-500/10' : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300'"
                                                class="relative p-6 border-2 rounded-2xl flex flex-col items-center gap-3 transition-all group">
                                                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <i class="pi pi-building text-2xl text-white"></i>
                                                </div>
                                                <span class="font-black text-gray-900 dark:text-white">Piso</span>
                                                <div class="absolute top-3 right-3">
                                                    <i *ngIf="datos.tipo === 'piso'" class="pi pi-check-circle text-xl text-emerald-500"></i>
                                                    <i *ngIf="datos.tipo !== 'piso'" class="pi pi-circle text-xl text-gray-300 dark:text-gray-600"></i>
                                                </div>
                                            </button>
                                            <button (click)="datos.tipo = 'casa'"
                                                [class]="datos.tipo === 'casa' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5 shadow-lg shadow-emerald-500/10' : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300'"
                                                class="relative p-6 border-2 rounded-2xl flex flex-col items-center gap-3 transition-all group">
                                                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <i class="pi pi-home text-2xl text-white"></i>
                                                </div>
                                                <span class="font-black text-gray-900 dark:text-white">Casa</span>
                                                <div class="absolute top-3 right-3">
                                                    <i *ngIf="datos.tipo === 'casa'" class="pi pi-check-circle text-xl text-emerald-500"></i>
                                                    <i *ngIf="datos.tipo !== 'casa'" class="pi pi-circle text-xl text-gray-300 dark:text-gray-600"></i>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Código Postal</label>
                                        <input type="text" [(ngModel)]="datos.cp" placeholder="Ej: 28001"
                                            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
                                    </div>
                                </div>
                                <div class="mt-8">
                                    <button (click)="siguiente()" [disabled]="!datos.tipo || !datos.cp"
                                        class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">
                                        Continuar
                                        <i class="pi pi-arrow-right text-sm"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Paso 2: Detalles técnicos -->
                            <div *ngIf="paso === 2">
                                <div class="text-center pb-6 border-b border-gray-100 dark:border-gray-700">
                                    <h2 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">Detalles técnicos</h2>
                                    <p class="text-gray-500 dark:text-gray-400 font-medium">Cuéntanos las características principales.</p>
                                </div>
                                <div class="mt-8 space-y-6">
                                    <div class="flex flex-col gap-2">
                                        <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Superficie (m² útiles)</label>
                                        <div class="relative">
                                            <input type="number" [(ngModel)]="datos.m2" placeholder="Ej: 85"
                                                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400 pr-14" />
                                            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">m²</span>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-2 gap-6">
                                        <div class="flex flex-col gap-2">
                                            <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Habitaciones</label>
                                            <div class="flex items-center bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                                                <button (click)="datos.hab = Math.max(1, datos.hab - 1)" class="p-3.5 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all text-gray-500"><i class="pi pi-minus text-sm"></i></button>
                                                <span class="flex-1 text-center font-black text-xl text-gray-900 dark:text-white">{{ datos.hab }}</span>
                                                <button (click)="datos.hab = datos.hab + 1" class="p-3.5 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all text-gray-500"><i class="pi pi-plus text-sm"></i></button>
                                            </div>
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Baños</label>
                                            <div class="flex items-center bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                                                <button (click)="datos.banos = Math.max(1, datos.banos - 1)" class="p-3.5 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all text-gray-500"><i class="pi pi-minus text-sm"></i></button>
                                                <span class="flex-1 text-center font-black text-xl text-gray-900 dark:text-white">{{ datos.banos }}</span>
                                                <button (click)="datos.banos = datos.banos + 1" class="p-3.5 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all text-gray-500"><i class="pi pi-plus text-sm"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-8 flex gap-4">
                                    <button (click)="paso = 1"
                                        class="w-1/3 py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all inline-flex items-center justify-center gap-2">
                                        <i class="pi pi-arrow-left text-sm"></i>
                                        Volver
                                    </button>
                                    <button (click)="siguiente()" [disabled]="!datos.m2"
                                        class="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">
                                        Continuar
                                        <i class="pi pi-arrow-right text-sm"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Paso 3: Contacto -->
                            <div *ngIf="paso === 3">
                                <div class="text-center pb-6 border-b border-gray-100 dark:border-gray-700">
                                    <h2 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">¿A dónde enviamos el informe?</h2>
                                    <p class="text-gray-500 dark:text-gray-400 font-medium">Te enviaremos el estudio de mercado completo a tu email.</p>
                                </div>
                                <div class="mt-8 space-y-6">
                                    <div class="p-5 bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 flex items-start gap-3">
                                        <i class="pi pi-info-circle text-emerald-500 mt-0.5 flex-shrink-0"></i>
                                        <p class="text-sm font-medium text-emerald-800 dark:text-emerald-300">Utilizamos tecnología de Big Data y algoritmos de Machine Learning propios para calcular el precio más exacto del mercado.</p>
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tu nombre</label>
                                        <input type="text" [(ngModel)]="datos.nombre" placeholder="Ej: Carlos García"
                                            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tu email</label>
                                        <input type="email" [(ngModel)]="datos.email" placeholder="ejemplo@email.com"
                                            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
                                    </div>
                                </div>
                                <div class="mt-8">
                                    <button (click)="siguiente()" [disabled]="!datos.email || !datos.nombre"
                                        class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">
                                        <i class="pi pi-chart-line text-sm"></i>
                                        Obtener valoración gratis
                                    </button>
                                </div>
                            </div>

                            <!-- Paso 4: Resultado -->
                            <div *ngIf="paso === 4" class="text-center">
                                <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6">
                                    <i class="pi pi-check-circle text-4xl text-white"></i>
                                </div>
                                <h2 class="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3">¡Valoración lista!</h2>
                                <p class="text-gray-500 dark:text-gray-400 mb-8">Basado en inmuebles similares en tu zona ({{ datos.cp }}), tu propiedad tiene un valor estimado de:</p>

                                <div class="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white p-8 md:p-10 rounded-2xl shadow-2xl mb-8 relative overflow-hidden">
                                    <div class="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                    <div class="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                                    <div class="relative z-10">
                                        <p class="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Valor Estimado TuPisoYa</p>
                                        <h3 class="text-4xl md:text-5xl font-black mb-6">{{ precioEstimado | currency: 'EUR' : 'symbol' : '1.0-0' }}</h3>
                                        <div class="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                                            <div class="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" style="width: 75%"></div>
                                        </div>
                                        <div class="flex justify-between mt-2 text-xs text-gray-400">
                                            <span>Mín: {{ precioEstimado * 0.9 | currency: 'EUR' : 'symbol' : '1.0-0' }}</span>
                                            <span>Máx: {{ precioEstimado * 1.1 | currency: 'EUR' : 'symbol' : '1.0-0' }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="p-5 bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 mb-8">
                                    <p class="font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2">
                                        <i class="pi pi-envelope"></i>
                                        Hemos enviado el informe detallado a <strong>{{ datos.email }}</strong>
                                    </p>
                                </div>

                                <div class="flex flex-col gap-4">
                                    <button routerLink="/publicar-anuncio"
                                        class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 inline-flex items-center justify-center gap-2">
                                        <i class="pi pi-plus-circle text-sm"></i>
                                        Publicar anuncio ahora
                                    </button>
                                    <button (click)="reiniciar()"
                                        class="text-gray-500 dark:text-gray-400 font-bold hover:text-gray-700 dark:hover:text-gray-300 transition-all py-2">
                                        Nueva valoración
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <app-footer-widget class="mt-auto" />
        </div>
    `,
    styles: [`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        input[type=number] {
            -moz-appearance: textfield;
        }
    `]
})
export class Valoracion {
    paso = 1;
    Math = Math;

    datos = {
        tipo: '',
        cp: '',
        m2: null as number | null,
        hab: 1,
        banos: 1,
        nombre: '',
        email: ''
    };

    precioEstimado = 0;

    siguiente() {
        if (this.paso < 3) {
            this.paso++;
        } else if (this.paso === 3) {
            this.calcularValoracion();
            this.paso = 4;
        }
    }

    calcularValoracion() {
        const base = this.datos.tipo === 'piso' ? 2500 : 3200;
        const factorZona = 1.1;
        this.precioEstimado = (this.datos.m2 || 0) * base * factorZona + this.datos.hab * 15000 + this.datos.banos * 10000;
    }

    reiniciar() {
        this.paso = 1;
        this.datos = {
            tipo: '',
            cp: '',
            m2: null,
            hab: 1,
            banos: 1,
            nombre: '',
            email: ''
        };
    }

    constructor(public router: Router) {}
}
