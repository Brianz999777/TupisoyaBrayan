import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TopbarWidget } from '../../components/topbar/topbarwidget.component';
import { FooterWidget } from '../../components/topbar/footerwidget';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-valoracion',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, TopbarWidget, FooterWidget, ButtonModule, RippleModule, InputTextModule],
    template: `
        <div class="min-h-screen flex flex-col bg-surface-0 dark:bg-surface-900">
            <topbar-widget class="py-6 px-6 lg:px-20 flex items-center justify-between relative lg:static" />
            <div class="flex-1">
                <div class="flex flex-col items-center py-12 px-6 lg:px-20">
                <!-- Header Section -->
                <div class="text-center mb-12" *ngIf="paso < 4">
                    <h1 class="text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">Valoración Online Gratuita</h1>
                    <p class="text-xl text-gray-600 dark:text-gray-400">Descubre el valor real de tu mercado en menos de 2 minutos.</p>
                </div>

                <!-- Stepper Progress -->
                <div class="w-full max-w-2xl mb-12" *ngIf="paso < 4">
                    <div class="flex items-center justify-between relative">
                        <div class="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                        <div class="absolute top-1/2 left-0 h-1 bg-primary-500 -translate-y-1/2 z-0 transition-all duration-500" [style.width]="(paso - 1) * 50 + '%'"></div>

                        <div
                            *ngFor="let i of [1, 2, 3]"
                            class="w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300"
                            [ngClass]="paso >= i ? 'bg-primary-500 text-white' : 'bg-white text-gray-400 border-2 border-gray-200'"
                        >
                            <i [class]="paso > i ? 'pi pi-check' : ''" *ngIf="paso > i"></i>
                            <span *ngIf="paso <= i">{{ i }}</span>
                        </div>
                    </div>
                </div>

                <!-- Card Container -->
                <div class="w-full max-w-2xl bg-white dark:bg-surface-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-surface-700">
                    <!-- Paso 1: Tipo y Ubicación -->
                    <div class="p-10" *ngIf="paso === 1">
                        <h2 class="text-2xl font-bold mb-8 flex items-center gap-3"><i class="pi pi-map-marker text-primary-500"></i> ¿Dónde está tu inmueble?</h2>
                        <div class="space-y-6">
                            <div class="flex flex-col gap-2">
                                <label class="font-bold text-gray-700">Tipo de Inmueble</label>
                                <div class="grid grid-cols-2 gap-4">
                                    <button
                                        (click)="datos.tipo = 'piso'"
                                        [class]="datos.tipo === 'piso' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'"
                                        class="p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all"
                                    >
                                        <i class="pi pi-building text-2xl"></i> Piso
                                    </button>
                                    <button
                                        (click)="datos.tipo = 'casa'"
                                        [class]="datos.tipo === 'casa' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'"
                                        class="p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all"
                                    >
                                        <i class="pi pi-home text-2xl"></i> Casa
                                    </button>
                                </div>
                            </div>
                            <div class="flex flex-col gap-2">
                                <label class="font-bold text-gray-700">Código Postal</label>
                                <input type="text" [(ngModel)]="datos.cp" pInputText placeholder="Ej: 28001" class="w-full p-4 text-lg" />
                            </div>
                        </div>
                        <div class="mt-10">
                            <button pButton pRipple label="Siguiente" (click)="siguiente()" [disabled]="!datos.tipo || !datos.cp" class="w-full py-4 bg-primary-600 text-white font-bold rounded-xl shadow-lg"></button>
                        </div>
                    </div>

                    <!-- Paso 2: Detalles técnicos -->
                    <div class="p-10" *ngIf="paso === 2">
                        <h2 class="text-2xl font-bold mb-8 flex items-center gap-3"><i class="pi pi-sliders-h text-primary-500"></i> Detalles técnicos</h2>
                        <div class="space-y-6">
                            <div class="flex flex-col gap-2">
                                <label class="font-bold text-gray-700">Superficie (m² útiles)</label>
                                <div class="relative">
                                    <input type="number" [(ngModel)]="datos.m2" pInputText class="w-full p-4 text-lg pr-12" />
                                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">m²</span>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-6">
                                <div class="flex flex-col gap-2">
                                    <label class="font-bold text-gray-700">Habitaciones</label>
                                    <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                        <button (click)="datos.hab = Math.max(1, datos.hab - 1)" class="p-4 hover:bg-gray-50"><i class="pi pi-minus"></i></button>
                                        <span class="flex-1 text-center font-bold text-xl">{{ datos.hab }}</span>
                                        <button (click)="datos.hab = datos.hab + 1" class="p-4 hover:bg-gray-50"><i class="pi pi-plus"></i></button>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-2">
                                    <label class="font-bold text-gray-700">Baños</label>
                                    <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                        <button (click)="datos.banos = Math.max(1, datos.banos - 1)" class="p-4 hover:bg-gray-50"><i class="pi pi-minus"></i></button>
                                        <span class="flex-1 text-center font-bold text-xl">{{ datos.banos }}</span>
                                        <button (click)="datos.banos = datos.banos + 1" class="p-4 hover:bg-gray-50"><i class="pi pi-plus"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-10 flex gap-4">
                            <button pButton pRipple label="Volver" (click)="paso = 1" class="w-1/3 py-4 bg-gray-100 text-gray-600 font-bold rounded-xl"></button>
                            <button pButton pRipple label="Siguiente" (click)="siguiente()" [disabled]="!datos.m2" class="flex-1 py-4 bg-primary-600 text-white font-bold rounded-xl shadow-lg"></button>
                        </div>
                    </div>

                    <!-- Paso 3: Contacto -->
                    <div class="p-10" *ngIf="paso === 3">
                        <h2 class="text-2xl font-bold mb-8 flex items-center gap-3"><i class="pi pi-envelope text-primary-500"></i> ¿A dónde enviamos el informe?</h2>
                        <div class="space-y-6">
                            <p class="text-gray-600">Para garantizar la precisión de nuestros algoritmos, necesitamos un email para enviarte el estudio de mercado completo.</p>
                            <div class="flex flex-col gap-2">
                                <label class="font-bold text-gray-700">Tu nombre</label>
                                <input type="text" [(ngModel)]="datos.nombre" pInputText placeholder="Ej: Carlos García" class="w-full p-4 text-lg" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label class="font-bold text-gray-700">Tu email</label>
                                <input type="email" [(ngModel)]="datos.email" pInputText placeholder="ejemplo@email.com" class="w-full p-4 text-lg" />
                            </div>
                        </div>
                        <div class="mt-10">
                            <button pButton pRipple label="Obtener Valoración Gratis" (click)="siguiente()" [disabled]="!datos.email || !datos.nombre" class="w-full py-4 bg-primary-600 text-white font-bold rounded-xl shadow-xl"></button>
                        </div>
                    </div>

                    <!-- Paso 4: Resultado (Simulado) -->
                    <div class="p-10 text-center" *ngIf="paso === 4">
                        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                            <i class="pi pi-check-circle text-5xl text-green-600"></i>
                        </div>
                        <h2 class="text-4xl font-extrabold mb-4 text-gray-900">¡Valoración Lista!</h2>
                        <p class="text-lg text-gray-600 mb-10">Basado en inmuebles similares en tu zona ({{ datos.cp }}), tu propiedad tiene un valor estimado de:</p>

                        <div class="bg-gray-900 text-white p-10 rounded-3xl shadow-2xl mb-10 relative overflow-hidden">
                            <div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <i class="pi pi-chart-line text-[150px] -rotate-12 translate-x-10 translate-y-10"></i>
                            </div>
                            <p class="text-sm uppercase tracking-widest opacity-70 mb-2">Valor Estimado TuPisoYa</p>
                            <h3 class="text-5xl font-black mb-4">{{ precioEstimado | currency: 'EUR' : 'symbol' : '1.0-0' }}</h3>
                            <div class="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                                <div class="h-full bg-green-400" style="width: 75%"></div>
                            </div>
                            <div class="flex justify-between mt-2 text-xs opacity-60">
                                <span>Mín: {{ precioEstimado * 0.9 | currency: 'EUR' : 'symbol' : '1.0-0' }}</span>
                                <span>Máx: {{ precioEstimado * 1.1 | currency: 'EUR' : 'symbol' : '1.0-0' }}</span>
                            </div>
                        </div>

                        <div class="p-6 bg-lime-100 rounded-2xl border border-lime-200 text-lime-900 mb-8" style="background-color: #D4E157;">
                            <p class="font-bold flex items-center justify-center gap-2"><i class="pi pi-info-circle"></i> Hemos enviado el informe detallado a {{ datos.email }}</p>
                        </div>

                        <div class="flex flex-col gap-4">
                            <button pButton pRipple label="Vender ahora con nosotros" class="w-full py-4 bg-primary-600 text-white font-bold rounded-xl"></button>
                            <button (click)="reiniciar()" class="text-gray-500 font-bold hover:text-gray-700 transition-colors">Nueva valoración</button>
                        </div>
                    </div>
                </div>

                <!-- Footer info -->
                <div class="mt-12 text-center text-gray-500 max-w-md" *ngIf="paso < 4">
                    <p class="text-sm">Utilizamos tecnología de Big Data y algoritmos de Machine Learning propios para calcular el precio más exacto del mercado.</p>
                </div>
            </div>
            </div>
            <footer-widget class="mt-auto" />
        </div>
    `,
    styles: [
        `
            :host ::ng-deep .p-inputtext {
                border-radius: 0.75rem;
            }
            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
        `
    ]
})
export class Valoracion {
    paso = 1;
    Math = Math;

    datos = {
        tipo: '',
        cp: '',
        m2: null,
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
        // Simulación de cálculo basado en m2 y una base fija por zona/tipo
        const base = this.datos.tipo === 'piso' ? 2500 : 3200;
        const factorZona = 1.1; // Simulación
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
