import { Component, inject, NgZone, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TopbarWidget } from '../topbar/topbarwidget.component';
import { FooterWidget } from '../topbar/footerwidget';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { Auth } from '../../service/auth.service';
import { InmuebleService } from '../../service/inmueble.service';

interface FotoPreview {
    id: number;
    url: string;
    file: File;
    compressedBase64: string;
}

interface ExtraItem {
    key: string;
    label: string;
    icon: string;
    color: string;
    iconColor: string;
    ventaField?: string;
    alquilerField?: string;
}

@Component({
    selector: 'app-publicar-anuncio',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, TopbarWidget, FooterWidget, RippleModule, ButtonModule, InputTextModule, ToastModule, ProgressSpinnerModule],
    providers: [MessageService],
    template: `
        <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950">
            <p-toast position="top-right" />
            <topbar-widget class="py-6 px-6 lg:px-20 flex items-center justify-between relative lg:static" />
            <div class="flex-1">
                <!-- Hero -->
                <section class="relative pt-32 pb-28 overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"></div>
                    <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2"></div>
                    <div class="absolute bottom-0 left-0 w-80 h-80 bg-teal-200/20 dark:bg-teal-500/5 rounded-full blur-3xl translate-y-1/2"></div>
                    <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
                        <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">Publica tu <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">inmueble</span></h1>
                        <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Completa los datos y llega a miles de interesados en minutos.</p>
                    </div>
                </section>

                <!-- Progress Bar -->
                <div class="max-w-4xl mx-auto px-6 -mt-14 relative z-20">
                    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-emerald-500/5 border border-gray-100 dark:border-gray-700">
                        <div class="flex justify-between mb-4 relative">
                            @for (step of steps; track step.num; let i = $index) {
                                <div class="flex flex-col items-center gap-2 z-10" [class.opacity-40]="step.num > pasoActual">
                                    <div class="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300"
                                        [class]="step.num <= pasoActual ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'">
                                        @if (step.num < pasoActual) {
                                            <i class="pi pi-check text-sm"></i>
                                        } @else {
                                            <span>{{ step.num }}</span>
                                        }
                                    </div>
                                    <span class="text-[10px] font-bold uppercase tracking-wider text-center"
                                        [class]="step.num <= pasoActual ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'">
                                        {{ step.label }}
                                    </span>
                                </div>
                            }
                        </div>
                        <div class="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" [style.width.%]="(pasoActual / steps.length) * 100"></div>
                        </div>
                    </div>
                </div>

                <!-- Formulario -->
                <section class="py-12 bg-gray-50 dark:bg-gray-900/50">
                    <div class="max-w-4xl mx-auto px-6">
                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-10 shadow-xl shadow-emerald-500/5 border border-gray-100 dark:border-gray-700">
                            @if (loading) {
                                <div class="flex flex-col items-center justify-center py-20">
                                    <i class="pi pi-spin pi-spinner text-5xl text-emerald-400 mb-6"></i>
                                    <p class="text-lg font-bold text-gray-900 dark:text-white">Publicando anuncio...</p>
                                    <p class="text-sm text-gray-500">Esto puede tomar unos segundos</p>
                                </div>
                            } @else {
                                <!-- PASO 1 -->
                                @if (pasoActual === 1) {
                                    <div>
                                        <div class="text-center pb-6 border-b border-gray-100 dark:border-gray-700">
                                            <h2 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">¿Qué tipo de operación?</h2>
                                            <p class="text-gray-500 dark:text-gray-400 font-medium">Selecciona si quieres vender o alquilar tu inmueble.</p>
                                        </div>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                            <button class="relative p-8 bg-gray-50 dark:bg-gray-700/30 border-2 rounded-2xl text-center cursor-pointer transition-all hover:shadow-lg group"
                                                [class]="formData.type === 'venta' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5 shadow-lg shadow-emerald-500/10' : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300'"
                                                (click)="formData.type = 'venta'">
                                                <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                                                    <i class="pi pi-tag text-3xl text-white"></i>
                                                </div>
                                                <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2">Venta</h3>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">Vende tu propiedad al mejor precio del mercado.</p>
                                                <div class="absolute top-4 right-4">
                                                    @if (formData.type === 'venta') {
                                                        <i class="pi pi-check-circle text-2xl text-emerald-500"></i>
                                                    } @else {
                                                        <i class="pi pi-circle text-2xl text-gray-300 dark:text-gray-600"></i>
                                                    }
                                                </div>
                                            </button>
                                            <button class="relative p-8 bg-gray-50 dark:bg-gray-700/30 border-2 rounded-2xl text-center cursor-pointer transition-all hover:shadow-lg group"
                                                [class]="formData.type === 'alquiler' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5 shadow-lg shadow-emerald-500/10' : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300'"
                                                (click)="formData.type = 'alquiler'">
                                                <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                                                    <i class="pi pi-key text-3xl text-white"></i>
                                                </div>
                                                <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2">Alquiler</h3>
                                                <p class="text-sm text-gray-500 dark:text-gray-400">Alquila tu propiedad y genera ingresos mensuales.</p>
                                                <div class="absolute top-4 right-4">
                                                    @if (formData.type === 'alquiler') {
                                                        <i class="pi pi-check-circle text-2xl text-emerald-500"></i>
                                                    } @else {
                                                        <i class="pi pi-circle text-2xl text-gray-300 dark:text-gray-600"></i>
                                                    }
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                }

                                <!-- PASO 2 -->
                                @if (pasoActual === 2) {
                                    <div>
                                        <div class="text-center pb-6 border-b border-gray-100 dark:border-gray-700">
                                            <h2 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">Dirección y datos generales</h2>
                                            <p class="text-gray-500 dark:text-gray-400 font-medium">Información básica de tu inmueble.</p>
                                        </div>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo de vía *</label>
                                                <select [(ngModel)]="formData.tipo_via_prop" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 appearance-none">
                                                    <option value="">Seleccionar...</option>
                                                    <option value="Calle">Calle</option>
                                                    <option value="Avenida">Avenida</option>
                                                    <option value="Plaza">Plaza</option>
                                                    <option value="Paseo">Paseo</option>
                                                    <option value="Ronda">Ronda</option>
                                                    <option value="Camino">Camino</option>
                                                    <option value="Carretera">Carretera</option>
                                                </select>
                                            </div>
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dirección *</label>
                                                <input type="text" [(ngModel)]="formData.direccion_prop" placeholder="Ej: Mayor, del Sol..." class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
                                            </div>
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Número *</label>
                                                <input type="number" [(ngModel)]="formData.numero_prop" placeholder="Ej: 5" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
                                            </div>
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Planta</label>
                                                <input type="number" [(ngModel)]="formData.planta_prop" placeholder="Ej: 3" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
                                            </div>
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Puerta</label>
                                                <input type="text" [(ngModel)]="formData.puerta_prop" placeholder="Ej: Derecha, A..." class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
                                            </div>
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Código Postal *</label>
                                                <input type="text" [(ngModel)]="formData.cp_prop" placeholder="Ej: 46002" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
                                            </div>
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provincia *</label>
                                                <input type="text" [(ngModel)]="formData.provincia_prop" placeholder="Ej: Valencia" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
                                            </div>
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nº Catastral *</label>
                                                <input type="text" [(ngModel)]="formData.nro_catastral_prop" placeholder="Ej: VENTA99998888" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
                                            </div>
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Metros cuadrados *</label>
                                                <input type="number" step="0.1" [(ngModel)]="formData.metros_prop" placeholder="Ej: 110" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
                                            </div>
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Año construcción *</label>
                                                <input type="number" [(ngModel)]="formData.anyo_construccion_prop" (input)="onAnyoChange()" placeholder="Ej: 1980" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
                                            </div>
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Antigüedad</label>
                                                <input type="text" [(ngModel)]="formData.antiguedad_prop" placeholder="Se calcula automáticamente" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400 opacity-60 cursor-not-allowed" readonly />
                                            </div>
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nº Habitaciones *</label>
                                                <input type="number" [(ngModel)]="formData.nro_habitaciones" placeholder="Ej: 3" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
                                            </div>
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nº Baños *</label>
                                                <input type="number" [(ngModel)]="formData.nro_banos" placeholder="Ej: 2" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                }

                                <!-- PASO 3 -->
                                @if (pasoActual === 3) {
                                    <div>
                                        <div class="text-center pb-6 border-b border-gray-100 dark:border-gray-700">
                                            <h2 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">Características</h2>
                                            <p class="text-gray-500 dark:text-gray-400 font-medium">Selecciona los extras y servicios de tu inmueble.</p>
                                        </div>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
                                            @for (extra of extrasList; track extra.key) {
                                                <label class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/30 border-2 rounded-xl cursor-pointer transition-all hover:shadow-sm"
                                                    [class]="extrasValues[extra.key] ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5' : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300'">
                                                    <div class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0"
                                                        [class]="extrasValues[extra.key] ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-gray-500'">
                                                        @if (extrasValues[extra.key]) {
                                                            <i class="pi pi-check text-white text-[10px]"></i>
                                                        }
                                                    </div>
                                                    <input type="checkbox" [checked]="extrasValues[extra.key]" (change)="toggleExtra(extra.key)" class="hidden" />
                                                    <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" [style.background]="extra.color">
                                                        <i [class]="extra.icon" [style.color]="extra.iconColor" class="text-sm"></i>
                                                    </div>
                                                    <span class="font-bold text-sm text-gray-900 dark:text-white">{{ extra.label }}</span>
                                                </label>
                                            }
                                        </div>

                                        @if (formData.type === 'venta') {
                                            <div class="mt-8 p-6 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600">
                                                <h4 class="font-black text-lg text-gray-900 dark:text-white mb-4">Detalles de venta</h4>
                                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div class="flex flex-col gap-1.5">
                                                        <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Clase energética *</label>
                                                        <select [(ngModel)]="formData.clase_energetica_venta" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 appearance-none">
                                                            <option value="">Seleccionar...</option>
                                                            <option value="A">A - Máxima eficiencia</option>
                                                            <option value="B">B</option>
                                                            <option value="C">C</option>
                                                            <option value="D">D</option>
                                                            <option value="E">E</option>
                                                            <option value="F">F</option>
                                                        </select>
                                                    </div>
                                                    <div class="flex flex-col gap-1.5">
                                                        <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Precio de venta (€) *</label>
                                                        <input type="number" step="0.01" [(ngModel)]="formData.precio_venta" placeholder="Ej: 185000" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        @if (formData.type === 'alquiler') {
                                            <div class="mt-8 p-6 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600">
                                                <h4 class="font-black text-lg text-gray-900 dark:text-white mb-4">Detalles de alquiler</h4>
                                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div class="flex flex-col gap-1.5">
                                                        <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Precio mensual (€) *</label>
                                                        <input type="number" step="0.01" [(ngModel)]="formData.precio_alquiler" placeholder="Ej: 850" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
                                                    </div>
                                                    <div class="flex flex-col gap-1.5">
                                                        <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fianza (€)</label>
                                                        <input type="number" step="0.01" [(ngModel)]="formData.fianza_alquiler" placeholder="Ej: 1700" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
                                                    </div>
                                                    <div class="flex flex-col gap-1.5">
                                                        <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nº máximo personas</label>
                                                        <input type="number" [(ngModel)]="formData.nro_personas_alquiler" placeholder="Ej: 4" class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }

                                <!-- PASO 4: Fotos -->
                                @if (pasoActual === 4) {
                                    <div>
                                        <div class="text-center pb-6 border-b border-gray-100 dark:border-gray-700">
                                            <h2 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">Fotos del inmueble</h2>
                                            <p class="text-gray-500 dark:text-gray-400 font-medium">Añade fotos de tu propiedad. <strong class="text-emerald-600 dark:text-emerald-400">La primera foto será la principal</strong>. Máximo 10 fotos.</p>
                                        </div>
                                        <div class="mt-8">
                                            @if (fotosPreview.length < 10) {
                                                <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-10 text-center cursor-pointer transition-all hover:border-emerald-400 hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5" (dragover)="$event.preventDefault()" (drop)="onDrop($event)" (click)="fileInput.click()">
                                                    <input #fileInput type="file" multiple accept="image/*" (change)="onFilesSelected($event)" class="hidden" />
                                                    <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-4">
                                                        <i class="pi pi-cloud-upload text-3xl text-white"></i>
                                                    </div>
                                                    <p class="text-gray-700 dark:text-gray-300 font-bold mb-1">Arrastra tus fotos aquí o <span class="text-emerald-500">haz clic para seleccionar</span></p>
                                                    <p class="text-xs text-gray-400 font-medium">Formatos: JPG, PNG, WEBP • Máx 10MB cada una • Máx 10 fotos</p>
                                                </div>
                                            }

                                            @if (fotosPreview.length > 0) {
                                                <div class="mt-8">
                                                    <div class="flex items-center justify-between mb-4">
                                                        <h4 class="font-black text-lg text-gray-900 dark:text-white">Fotos ({{ fotosPreview.length }}/10)</h4>
                                                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg">La primera es la principal</span>
                                                    </div>
                                                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                        @for (foto of fotosPreview; track foto.id; let i = $index) {
                                                            <div class="relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all"
                                                                [class]="i === 0 ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-transparent'">
                                                                @if (i === 0) {
                                                                    <div class="absolute top-2 left-2 z-10 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider">PRINCIPAL</div>
                                                                }
                                                                <img [src]="foto.url" [alt]="'Foto ' + (i + 1)" class="w-full h-full object-cover" />
                                                                <button class="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/90 text-white flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-all z-10 text-xs" (click)="eliminarFoto(i)">
                                                                    <i class="pi pi-times"></i>
                                                                </button>
                                                                @if (i > 0) {
                                                                    <button class="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-gray-900/80 text-emerald-400 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-all z-10 text-xs" (click)="moverArriba(i)" title="Mover como principal">
                                                                        <i class="pi pi-arrow-up"></i>
                                                                    </button>
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                }

                                <!-- PASO 5 -->
                                @if (pasoActual === 5) {
                                    <div>
                                        <div class="text-center pb-6 border-b border-gray-100 dark:border-gray-700">
                                            <h2 class="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">Descripción y confirmar</h2>
                                            <p class="text-gray-500 dark:text-gray-400 font-medium">Cuéntale a los interesados por qué tu propiedad es especial.</p>
                                        </div>
                                        <div class="mt-8 space-y-6">
                                            <div class="flex flex-col gap-1.5">
                                                <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descripción *</label>
                                                <textarea [(ngModel)]="formData.descripcion" rows="6" placeholder="Describe tu inmueble: distribución, orientación, zonas cercanas, transporte, colegios..." class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400 resize-y min-h-[140px]"></textarea>
                                                <p class="text-xs text-gray-400 font-medium mt-1">{{ (formData.descripcion || '').length }} / 3000 caracteres</p>
                                            </div>

                                            <div class="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-200 dark:border-gray-600">
                                                <h4 class="font-black text-lg text-gray-900 dark:text-white mb-4">Resumen del anuncio</h4>
                                                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    <div class="flex flex-col gap-0.5">
                                                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Operación</span>
                                                        <span class="text-base font-black text-gray-900 dark:text-white">{{ formData.type === 'venta' ? 'Venta' : 'Alquiler' }}</span>
                                                    </div>
                                                    <div class="flex flex-col gap-0.5">
                                                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dirección</span>
                                                        <span class="text-base font-black text-gray-900 dark:text-white">{{ formData.direccion_prop }}, {{ formData.numero_prop }}</span>
                                                    </div>
                                                    <div class="flex flex-col gap-0.5">
                                                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Provincia</span>
                                                        <span class="text-base font-black text-gray-900 dark:text-white">{{ formData.provincia_prop }}</span>
                                                    </div>
                                                    <div class="flex flex-col gap-0.5">
                                                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Metros</span>
                                                        <span class="text-base font-black text-gray-900 dark:text-white">{{ formData.metros_prop }} m²</span>
                                                    </div>
                                                    <div class="flex flex-col gap-0.5">
                                                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Habitaciones</span>
                                                        <span class="text-base font-black text-gray-900 dark:text-white">{{ formData.nro_habitaciones }} hab.</span>
                                                    </div>
                                                    <div class="flex flex-col gap-0.5">
                                                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Baños</span>
                                                        <span class="text-base font-black text-gray-900 dark:text-white">{{ formData.nro_banos }} baños</span>
                                                    </div>
                                                    <div class="flex flex-col gap-0.5">
                                                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fotos</span>
                                                        <span class="text-base font-black text-gray-900 dark:text-white">{{ fotosPreview.length }} fotos</span>
                                                    </div>
                                                    @if (formData.type === 'venta') {
                                                        <div class="flex flex-col gap-0.5">
                                                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Precio venta</span>
                                                            <span class="text-base font-black text-emerald-600 dark:text-emerald-400">{{ formData.precio_venta | currency:'EUR':'symbol':'1.0-0' }}</span>
                                                        </div>
                                                    }
                                                    @if (formData.type === 'alquiler') {
                                                        <div class="flex flex-col gap-0.5">
                                                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Precio alquiler</span>
                                                            <span class="text-base font-black text-emerald-600 dark:text-emerald-400">{{ formData.precio_alquiler | currency:'EUR':'symbol':'1.0-0' }}/mes</span>
                                                        </div>
                                                    }
                                                </div>
                                            </div>

                                            <!-- Navigation Buttons -->
                                            <div class="flex items-center justify-between pt-4">
                                                <button type="button" (click)="pasoAnterior()"
                                                    class="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                                                    <i class="pi pi-arrow-left text-sm"></i>
                                                    Anterior
                                                </button>
                                                <button type="button" (click)="publicar()"
                                                    class="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25">
                                                    <i class="pi pi-send text-sm"></i>
                                                    Publicar anuncio
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                }

                                <!-- Navigation Buttons (for steps 1-4) -->
                                @if (pasoActual < 5) {
                                    <div class="flex items-center justify-between pt-8 mt-8 border-t border-gray-100 dark:border-gray-700">
                                        @if (pasoActual > 1) {
                                            <button type="button" (click)="pasoAnterior()"
                                                class="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                                                <i class="pi pi-arrow-left text-sm"></i>
                                                Anterior
                                            </button>
                                        } @else {
                                            <div></div>
                                        }
                                        <button type="button" (click)="pasoSiguiente()"
                                            class="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25">
                                            Continuar
                                            <i class="pi pi-arrow-right text-sm"></i>
                                        </button>
                                    </div>
                                }
                            }
                        </div>
                    </div>
                </section>
            </div>
            <footer-widget />
        </div>
    `,
    styles: [`
        :host ::ng-deep .p-inputnumber-input {
            width: 100% !important;
            padding: 0.75rem 1rem !important;
            background: #f8fafc !important;
            border: 2px solid #e2e8f0 !important;
            border-radius: 0.75rem !important;
            font-size: 0.875rem !important;
            font-weight: 500 !important;
            color: #1e293b !important;
            outline: none !important;
            transition: all 0.2s ease !important;
        }
        :host ::ng-deep .p-inputnumber-input:focus {
            border-color: #10b981 !important;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15) !important;
            background: #fff !important;
        }
        :host-context(.dark) :host ::ng-deep .p-inputnumber-input {
            background: rgba(51, 65, 85, 0.5) !important;
            border-color: #475569 !important;
            color: #f1f5f9 !important;
        }
        :host-context(.dark) :host ::ng-deep .p-inputnumber-input:focus {
            border-color: #10b981 !important;
            background: rgba(51, 65, 85, 0.8) !important;
        }
    `]
})
export class PublicarAnuncio implements OnInit {
    private router = inject(Router);
    private ngZone = inject(NgZone);
    private auth = inject(Auth);
    private inmuebleService = inject(InmuebleService);
    private messageService = inject(MessageService);

    loading = false;
    pasoActual = 1;

    steps = [
        { num: 1, label: 'Operación' },
        { num: 2, label: 'Dirección' },
        { num: 3, label: 'Características' },
        { num: 4, label: 'Fotos' },
        { num: 5, label: 'Confirmar' }
    ];

    formData: any = {
        type: null,
        tipo_via_prop: '',
        direccion_prop: '',
        numero_prop: null,
        planta_prop: null,
        puerta_prop: '',
        cp_prop: '',
        provincia_prop: '',
        nro_catastral_prop: '',
        metros_prop: null,
        anyo_construccion_prop: null,
        antiguedad_prop: '',
        nro_habitaciones: null,
        nro_banos: null,
        descripcion: '',
        // Venta
        precio_venta: null,
        clase_energetica_venta: '',
        // Alquiler
        precio_alquiler: null,
        fianza_alquiler: null,
        nro_personas_alquiler: null,
        // Extras booleanos para venta
        balcon_venta: false,
        amueblada_venta: false,
        garage_venta: false,
        aire_acondicionado_venta: false,
        libre_cargas_venta: false,
        negociable_venta: false,
        reforma_venta: false
    };

    extrasValues: { [key: string]: boolean } = {};
    fotosPreview: FotoPreview[] = [];
    private fotoIdCounter = 0;

    extrasList: ExtraItem[] = [
        { key: 'ascensor', label: 'Ascensor', icon: 'pi pi-arrow-up', color: '#e0f2fe', iconColor: '#0284c7' },
        { key: 'calefaccion', label: 'Calefacción', icon: 'pi pi-fire', color: '#fef3c7', iconColor: '#d97706' },
        { key: 'aire_acondicionado', label: 'Aire Acondicionado', icon: 'pi pi-snowflake', color: '#e0f2fe', iconColor: '#0284c7' },
        { key: 'terraza', label: 'Terraza', icon: 'pi pi-sun', color: '#fef9c3', iconColor: '#ca8a04' },
        { key: 'garaje', label: 'Garaje', icon: 'pi pi-car', color: '#f3e8ff', iconColor: '#7c3aed' },
        { key: 'trastero', label: 'Trastero', icon: 'pi pi-box', color: '#fce7f3', iconColor: '#db2777' },
        { key: 'amueblado', label: 'Amueblado', icon: 'pi pi-home', color: '#d1fae5', iconColor: '#059669' },
        { key: 'piscina', label: 'Piscina', icon: 'pi pi-water', color: '#e0f2fe', iconColor: '#0369a1' },
        { key: 'jardin', label: 'Jardín', icon: 'pi pi-leaf', color: '#dcfce7', iconColor: '#16a34a' },
        { key: 'portero', label: 'Portero Automático', icon: 'pi pi-video', color: '#f3e8ff', iconColor: '#7c3aed' },
        { key: 'mascotas', label: 'Se admiten mascotas', icon: 'pi pi-heart', color: '#fce7f3', iconColor: '#e11d48' },
        { key: 'eficiencia', label: 'Alta eficiencia energética', icon: 'pi pi-bolt', color: '#d1fae5', iconColor: '#059669' }
    ];

    ngOnInit() {
        if (!this.auth.isLoggedIn()) {
            this.router.navigate(['/log-in']);
        }
    }

    toggleExtra(key: string) {
        this.extrasValues[key] = !this.extrasValues[key];
    }

    onAnyoChange() {
        const year = this.formData.anyo_construccion_prop;
        if (year) {
            const currentYear = new Date().getFullYear();
            const antiguedad = currentYear - year;
            this.formData.antiguedad_prop = antiguedad > 0 ? `${antiguedad} años` : 'Nueva construcción';
        } else {
            this.formData.antiguedad_prop = '';
        }
    }

    onFilesSelected(event: any) {
        const files: FileList = event.target.files;
        this.processFiles(files);
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        const files = event.dataTransfer?.files;
        if (files) this.processFiles(files);
    }

    processFiles(files: FileList) {
        const remaining = 10 - this.fotosPreview.length;
        const toProcess = Math.min(files.length, remaining);
        for (let i = 0; i < toProcess; i++) {
            const file = files[i];
            if (file.size > 10 * 1024 * 1024) continue;
            const reader = new FileReader();
            reader.onload = (e) => {
                this.fotoIdCounter++;
                this.fotosPreview.push({
                    id: this.fotoIdCounter,
                    url: e.target?.result as string,
                    file: file,
                    compressedBase64: ''
                });
            };
            reader.readAsDataURL(file);
        }
    }

    eliminarFoto(index: number) {
        this.fotosPreview.splice(index, 1);
    }

    moverArriba(index: number) {
        if (index > 0) {
            const temp = this.fotosPreview[index];
            this.fotosPreview[index] = this.fotosPreview[0];
            this.fotosPreview[0] = temp;
        }
    }

    pasoSiguiente() {
        if (this.pasoActual === 1 && !this.formData.type) {
            this.messageService.add({ severity: 'warn', summary: 'Selecciona una opción', detail: 'Debes elegir entre venta o alquiler.' });
            return;
        }
        if (this.pasoActual === 2) {
            if (!this.formData.tipo_via_prop || !this.formData.direccion_prop || !this.formData.numero_prop || !this.formData.cp_prop || !this.formData.provincia_prop || !this.formData.nro_catastral_prop || !this.formData.metros_prop || !this.formData.anyo_construccion_prop || !this.formData.nro_habitaciones || !this.formData.nro_banos) {
                this.messageService.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Completa todos los campos obligatorios.' });
                return;
            }
        }
        if (this.pasoActual === 3) {
            if (this.formData.type === 'venta' && (!this.formData.clase_energetica_venta || !this.formData.precio_venta)) {
                this.messageService.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Completa los detalles de venta.' });
                return;
            }
            if (this.formData.type === 'alquiler' && !this.formData.precio_alquiler) {
                this.messageService.add({ severity: 'warn', summary: 'Campos incompletos', detail: 'Indica el precio de alquiler.' });
                return;
            }
        }
        if (this.pasoActual < 5) this.pasoActual++;
    }

    pasoAnterior() {
        if (this.pasoActual > 1) this.pasoActual--;
    }

    publicar() {
        if (!this.formData.descripcion) {
            this.messageService.add({ severity: 'warn', summary: 'Descripción requerida', detail: 'Añade una descripción de tu inmueble.' });
            return;
        }
        this.loading = true;

        // Obtener el usuario logueado para asociar la propiedad
        const user = this.auth.getUser();
        const nroDoc = user?.nro_doc_dto || '';

        // Fecha actual en formato yyyy-MM-dd
        const hoy = new Date().toISOString().split('T')[0];

        // Construir payload en snake_case español como espera el backend
        const payload: any = {
            // type requerido por Jackson @JsonTypeInfo para deserializar la subclase correcta
            type: this.formData.type,
            // Datos generales de la propiedad
            nro_doc_dueno: nroDoc,
            tipo_via_prop: this.formData.tipo_via_prop,
            direccion_prop: this.formData.direccion_prop,
            numero_prop: this.formData.numero_prop,
            planta_prop: this.formData.planta_prop,
            puerta_prop: this.formData.puerta_prop,
            cp_prop: this.formData.cp_prop,
            provincia_prop: this.formData.provincia_prop,
            nro_catastral_prop: this.formData.nro_catastral_prop,
            metros_prop: this.formData.metros_prop,
            anyo_construccion_prop: this.formData.anyo_construccion_prop,
            antiguedad_prop: this.formData.antiguedad_prop,
            fecha_publicacion_prop: hoy,
            ascensor_prop: this.extrasValues['ascensor'] || false,
            calefaccion_prop: this.extrasValues['calefaccion'] || false,
            terraza_prop: this.extrasValues['terraza'] || false,
            trastero_prop: this.extrasValues['trastero'] || false,
            piscina_prop: this.extrasValues['piscina'] || false,
            jardin_prop: this.extrasValues['jardin'] || false,
            portero_automatico_prop: this.extrasValues['portero'] || false,
            permite_mascotas_prop: this.extrasValues['mascotas'] || false,
            alta_eficiencia_energetica_prop: this.extrasValues['eficiencia'] || false,
            fotos_urls: null
        };

        if (this.formData.type === 'venta') {
            // Campos específicos de venta (snake_case español)
            payload.nro_habitaciones_venta = this.formData.nro_habitaciones;
            payload.nro_banos_venta = this.formData.nro_banos;
            payload.descripcion_venta = this.formData.descripcion;
            payload.precio_venta = this.formData.precio_venta;
            payload.clase_energetica_venta = this.formData.clase_energetica_venta;
            payload.balcon_venta = this.extrasValues['terraza'] || false;
            payload.amueblada_venta = this.extrasValues['amueblado'] || false;
            payload.garage_venta = this.extrasValues['garaje'] || false;
            payload.aire_acondicionado_venta = this.extrasValues['aire_acondicionado'] || false;
            payload.libre_cargas_venta = false;
            payload.negociable_venta = false;
            payload.reforma_venta = false;
        } else {
            // Campos específicos de alquiler (snake_case español)
            payload.nro_habitaciones_alquiler = this.formData.nro_habitaciones;
            payload.nro_banos_alquiler = this.formData.nro_banos;
            payload.descripcion_alquiler = this.formData.descripcion;
            payload.precio_alquiler = this.formData.precio_alquiler;
            payload.fianza_alquiler = this.formData.fianza_alquiler;
            payload.nro_personas_alquiler = this.formData.nro_personas_alquiler;
            payload.exterior_alquiler = false;
            payload.permite_mascotas_alquiler = this.extrasValues['mascotas'] || false;
            payload.permite_parejas_alquiler = false;
            payload.wifi_alquiler = false;
            payload.permitevisitas_alquiler = false;
        }

        console.log('📤 Enviando payload a Spring Boot (snake_case español):', JSON.stringify(payload, null, 2));

        if (this.formData.type === 'venta') {
            this.inmuebleService.crearVenta(payload).subscribe({
                next: (response: any) => {
                    console.log('✅ Respuesta crearVenta:', response);
                    const id = response.id_prop || response.id;
                    if (id && this.fotosPreview.length > 0) {
                        this.uploadPhotos(id);
                    } else {
                        this.loading = false;
                        this.messageService.add({ severity: 'success', summary: '¡Anuncio publicado!', detail: 'Tu inmueble ya está visible.' });
                        setTimeout(() => this.router.navigate(['/']), 1500);
                    }
                },
                error: (err) => {
                    this.loading = false;
                    console.error('❌ Error al publicar venta:', err);
                    console.error('   Status:', err.status, '- Mensaje:', err.message);
                    console.error('   URL:', err.url);
                    this.messageService.add({ severity: 'error', summary: 'Error ' + err.status, detail: 'El servidor rechazó la petición. Revisa la consola (F12).' });
                }
            });
        } else {
            this.inmuebleService.crearAlquiler(payload).subscribe({
                next: (response: any) => {
                    console.log('✅ Respuesta crearAlquiler:', response);
                    const id = response.id_prop || response.id;
                    if (id && this.fotosPreview.length > 0) {
                        this.uploadPhotos(id);
                    } else {
                        this.loading = false;
                        this.messageService.add({ severity: 'success', summary: '¡Anuncio publicado!', detail: 'Tu inmueble ya está visible.' });
                        setTimeout(() => this.router.navigate(['/']), 1500);
                    }
                },
                error: (err) => {
                    this.loading = false;
                    console.error('❌ Error al publicar alquiler:', err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'No se pudo publicar el anuncio. Revisa la consola.' });
                }
            });
        }
    }

    private uploadPhotos(propiedadId: number) {
        const formData = new FormData();
        this.fotosPreview.forEach((foto) => {
            formData.append('fotos', foto.file);
        });
        // Enviar FormData directamente como multipart/form-data
        this.inmuebleService.subirFotos(propiedadId, this.formData.type, formData).subscribe({
            next: () => this.onUploadComplete(),
            error: (err) => {
                console.error('❌ Error al subir fotos:', err);
                this.onUploadComplete();
            }
        });
    }

    private onUploadComplete() {
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: '¡Anuncio publicado!', detail: 'Tu inmueble ya está visible.' });
        setTimeout(() => this.router.navigate(['/']), 1500);
    }
}
