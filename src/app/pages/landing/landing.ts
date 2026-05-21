import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { TopbarWidget } from './components/topbarwidget.component';
import { FooterWidget } from './components/footerwidget';
import { BuquedaAlquiler } from '../pagina/buqueda-alquiler/buqueda-alquiler';
import { BuquedaVenta } from '../pagina/buqueda-venta/buqueda-venta';
import { DetalleInmueble } from '../pagina/detalle-inmueble/detalle-inmueble';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule, TopbarWidget, FooterWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule, InputTextModule, BuquedaVenta, BuquedaAlquiler, DetalleInmueble],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900 min-h-screen flex flex-col">
            <div id="home" class="landing-wrapper overflow-hidden flex flex-col flex-1">
                <topbar-widget class="py-6 px-6 lg:px-20 flex items-center justify-between relative lg:static" />

                <!-- HERO -->
                <div id="hero" class="hero-section flex flex-col items-center justify-center pt-32 pb-40 px-6 lg:px-20 overflow-hidden" *ngIf="!buscando && !verDetalleActivo">
                    <div class="hero-bg-overlay"></div>
                    <div class="hero-glow-1"></div>
                    <div class="hero-glow-2"></div>

                    <h1 class="hero-title text-6xl md:text-8xl font-black text-[#1A262F] mb-6 text-center tracking-tighter relative z-10">Tu hogar, <span class="text-[#D4E157] drop-shadow-[0_4px_12px_rgba(212,225,87,0.3)]">a un clic.</span></h1>
                    <p class="hero-subtitle text-xl md:text-2xl text-[#1A262F]/70 mb-14 text-center max-w-3xl font-bold relative z-10">Encuentra la propiedad perfecta en Zaragoza con la tecnología inteligente de TuPisoYa.</p>

                    <div
                        class="search-container-premium bg-white/60 backdrop-blur-3xl p-5 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(26,38,47,0.2),0_0_0_1px_rgba(212,225,87,0.3)] flex flex-col md:flex-row items-center gap-4 w-full max-w-6xl border border-white/80 relative z-10"
                    >
                        <div class="toggle-group-premium flex items-center bg-gray-900/5 p-1.5 rounded-3xl h-16 w-full md:w-auto">
                            <button class="toggle-btn-premium flex-1 px-10 h-full rounded-[1.25rem] font-black transition-all duration-500" [ngClass]="{ active: operacion === 'comprar' }" (click)="operacion = 'comprar'">Comprar</button>
                            <button class="toggle-btn-premium flex-1 px-10 h-full rounded-[1.25rem] font-black transition-all duration-500" [ngClass]="{ active: operacion === 'alquilar' }" (click)="operacion = 'alquilar'">Alquilar</button>
                        </div>

                        <div class="inputs-row-premium flex-1 flex flex-col md:flex-row gap-4 w-full">
                            <div class="custom-select-wrap flex-1">
                                <select [(ngModel)]="tipoSeleccionado" class="premium-input h-16 w-full font-bold outline-none px-6 rounded-3xl appearance-none cursor-pointer">
                                    <option *ngFor="let tipo of tiposInmueble" [value]="tipo.value">{{ tipo.label }}</option>
                                </select>
                            </div>

                            <div class="search-input-wrap flex-[2] relative h-16 w-full bg-white/40 rounded-3xl flex items-center px-6 border-2 border-transparent focus-within:border-[#1A262F]/10 transition-all">
                                <i class="pi pi-map-marker text-[#1A262F] mr-4 text-xl"></i>
                                <input
                                    type="text"
                                    pInputText
                                    [(ngModel)]="terminoBusqueda"
                                    placeholder="Ciudad, barrio o código postal..."
                                    class="w-full h-full border-none shadow-none bg-transparent font-black p-0 text-[#1A262F]"
                                    (keyup.enter)="ejecutarBusqueda()"
                                />
                            </div>
                        </div>

                        <button pRipple (click)="ejecutarBusqueda()" class="btn-search-premium h-16 px-12 font-black rounded-3xl text-white shadow-2xl flex items-center gap-3">
                            <i class="pi pi-search text-xl"></i>
                            <span>Buscar</span>
                        </button>
                    </div>
                </div>

                <!-- SECCIONES INFORMATIVAS -->
                <div class="px-6 lg:px-20 py-24 space-y-32 bg-white dark:bg-surface-900" *ngIf="!buscando && !verDetalleActivo">
                    <div class="info-section relative flex flex-col md:flex-row items-center gap-12">
                        <div class="image-wrap-premium w-full md:w-3/5 overflow-hidden rounded-[3rem] shadow-2xl">
                            <img src="/demo/images/galleria/landing1.jpg" alt="App TuPisoYa" class="w-full h-[500px] object-cover transition-transform hover:scale-105 duration-1000" />
                        </div>
                        <div class="content-card-premium w-full md:w-2/5 bg-white/80 backdrop-blur-xl p-12 rounded-[2.5rem] shadow-2xl border border-gray-100">
                            <div class="section-tag mb-6">APLICACIÓN MÓVIL</div>
                            <h3 class="text-4xl font-black mb-6 text-gray-900 leading-tight">Lleva TuPisoYa siempre contigo</h3>
                            <p class="text-lg text-gray-500 mb-8 leading-relaxed font-medium">Con nuestra app serás el primero en enterarte de nuevos inmuebles, cambios en tus favoritos y mensajes del chat.</p>
                            <div class="flex items-center gap-6 cursor-pointer group" (click)="openAppModal()">
                                <div class="qr-btn-premium p-4 rounded-2xl bg-gray-900 transition-all group-hover:scale-110"><i class="pi pi-qrcode text-4xl text-[#D4E157]"></i></div>
                                <div class="flex flex-col">
                                    <span class="text-gray-900 font-black text-lg">Descarga Gratuita</span>
                                    <span class="text-gray-400 font-bold underline">Escanea para empezar</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="info-section relative flex flex-col md:flex-row-reverse items-center gap-12">
                        <div class="image-wrap-premium w-full md:w-3/5 overflow-hidden rounded-[3rem] shadow-2xl">
                            <img src="/demo/images/galleria/landing2.png" alt="Valoración" class="w-full h-[500px] object-cover transition-transform hover:scale-105 duration-1000" />
                        </div>
                        <div class="content-card-premium w-full md:w-2/5 bg-white/80 backdrop-blur-xl p-12 rounded-[2.5rem] shadow-2xl border border-gray-100">
                            <div class="section-tag mb-6 color-lime">VALORACIÓN INTELIGENTE</div>
                            <h3 class="text-4xl font-black mb-6 text-gray-900 leading-tight">¿Cuánto vale tu casa realmente?</h3>
                            <p class="text-lg text-gray-500 mb-6 font-medium">Obtén una valoración online precisa en segundos gracias a nuestra IA:</p>
                            <ul class="space-y-4 mb-10">
                                <li class="flex items-center gap-3 font-bold text-gray-700"><i class="pi pi-check-circle text-[#D4E157] text-xl"></i> Rango de precio preciso</li>
                                <li class="flex items-center gap-3 font-bold text-gray-700"><i class="pi pi-check-circle text-[#D4E157] text-xl"></i> Evolución real del mercado</li>
                                <li class="flex items-center gap-3 font-bold text-gray-700"><i class="pi pi-check-circle text-[#D4E157] text-xl"></i> Comparativa avanzada</li>
                            </ul>
                            <a (click)="openValuationModal()" class="btn-action-premium inline-flex items-center gap-3 cursor-pointer">
                                <span>Valorar mi casa gratis</span>
                                <i class="pi pi-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- CONTENEDOR DE VISTAS DINÁMICAS -->
                <div class="flex-1 bg-white dark:bg-surface-900 px-6 lg:px-20 py-12" *ngIf="buscando || verDetalleActivo">
                    <div class="max-w-7xl mx-auto">
                        <div *ngIf="buscando && !verDetalleActivo" class="results-container-header flex justify-between items-end mb-12 pb-8 border-b border-gray-100">
                            <div class="header-titles">
                                <p class="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Búsqueda activa</p>
                                <h2 class="text-5xl font-black text-gray-900 m-0 tracking-tighter">Resultados encontrados</h2>
                            </div>
                            <button pButton icon="pi pi-times" label="Cerrar búsqueda" class="btn-close-premium" (click)="cerrarBusqueda()"></button>
                        </div>
                        <div *ngIf="verDetalleActivo" class="mb-12">
                            <button class="back-btn-premium group" (click)="volver()">
                                <div class="back-icon-wrap"><i class="pi pi-arrow-left"></i></div>
                                <span>Volver a los resultados</span>
                            </button>
                        </div>
                        <app-buqueda-venta *ngIf="buscando && !verDetalleActivo && operacionActiva === 'comprar'" [terminoBusquedaInput]="terminoBusquedaActivo" (onInmuebleSelected)="mostrarDetalle($event)"></app-buqueda-venta>
                        <app-detalle-inmueble *ngIf="verDetalleActivo" [idInput]="detalleId" [tipoInput]="detalleTipo"></app-detalle-inmueble>
                        <app-buqueda-alquiler *ngIf="buscando && !verDetalleActivo && operacionActiva === 'alquilar'" [terminoBusquedaInput]="terminoBusquedaActivo" (onInmuebleSelected)="mostrarDetalle($event)"></app-buqueda-alquiler>
                    </div>
                </div>
                <footer-widget class="mt-auto" />
            </div>

            <!-- ════════════════════════════════════════════ -->
            <!-- MODAL DE VALORACIÓN PREMIUM                 -->
            <!-- ════════════════════════════════════════════ -->
            <div *ngIf="showValuationModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-[#1A262F]/70 backdrop-blur-md" (click)="closeValuationModal()"></div>
                <div class="bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(26,38,47,0.3)] w-full max-w-xl overflow-hidden relative z-10 border border-[#D4E157]/20">
                    <button (click)="closeValuationModal()" class="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all z-20">
                        <i class="pi pi-times text-gray-500"></i>
                    </button>

                    <!-- Progress Bar -->
                    <div class="h-2 bg-gray-100">
                        <div class="h-full bg-gradient-to-r from-[#D4E157] to-[#84B01E] transition-all duration-700 ease-out" [style.width.%]="(valuationStep / 6) * 100"></div>
                    </div>

                    <div class="p-10">
                        <!-- PASO 1: Tipo -->
                        <div *ngIf="valuationStep === 1" class="space-y-8">
                            <div class="text-center">
                                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4E157] to-[#84B01E] flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <i class="pi pi-home text-3xl text-[#1A262F]"></i>
                                </div>
                                <h2 class="text-3xl font-black text-[#1A262F]">¿Qué quieres valorar?</h2>
                                <p class="text-gray-500 mt-2 font-medium">Selecciona el tipo de inmueble</p>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <button (click)="valuationData.tipo = 'piso'; nextValuationStep()" class="p-8 border-2 border-gray-100 rounded-2xl hover:border-[#D4E157] hover:bg-lime-50 transition-all group">
                                    <i class="pi pi-building text-4xl mb-4 text-gray-400 group-hover:text-[#1A262F]"></i>
                                    <span class="block font-black text-xl text-gray-900">Piso</span>
                                </button>
                                <button (click)="valuationData.tipo = 'casa'; nextValuationStep()" class="p-8 border-2 border-gray-100 rounded-2xl hover:border-[#D4E157] hover:bg-lime-50 transition-all group">
                                    <i class="pi pi-home text-4xl mb-4 text-gray-400 group-hover:text-[#1A262F]"></i>
                                    <span class="block font-black text-xl text-gray-900">Casa</span>
                                </button>
                            </div>
                        </div>

                        <!-- PASO 2: CP + m² -->
                        <div *ngIf="valuationStep === 2" class="space-y-8">
                            <div class="text-center">
                                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4E157] to-[#84B01E] flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <i class="pi pi-map-marker text-3xl text-[#1A262F]"></i>
                                </div>
                                <h2 class="text-3xl font-black text-[#1A262F]">Ubicación y superficie</h2>
                                <p class="text-gray-500 mt-2 font-medium">Datos básicos del inmueble</p>
                            </div>
                            <div class="space-y-5">
                                <div>
                                    <label class="block text-sm font-black mb-2 uppercase tracking-wider text-gray-500">Código Postal</label>
                                    <input
                                        type="text"
                                        [(ngModel)]="valuationData.cp"
                                        placeholder="Ej: 50001"
                                        class="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#D4E157] focus:ring-0 outline-none text-xl font-bold text-[#1A262F] transition-all"
                                    />
                                </div>
                                <div>
                                    <label class="block text-sm font-black mb-2 uppercase tracking-wider text-gray-500">Metros Cuadrados</label>
                                    <input
                                        type="number"
                                        [(ngModel)]="valuationData.m2"
                                        placeholder="Ej: 85"
                                        class="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#D4E157] focus:ring-0 outline-none text-xl font-bold text-[#1A262F] transition-all"
                                    />
                                </div>
                                <button
                                    (click)="nextValuationStep()"
                                    [disabled]="!valuationData.cp || !valuationData.m2"
                                    class="w-full py-4 bg-[#1A262F] text-white font-black rounded-xl shadow-lg hover:bg-[#2D3E4B] transition-all disabled:opacity-40"
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>

                        <!-- PASO 2.5: Habitaciones y Baños -->
                        <div *ngIf="valuationStep === 25" class="space-y-8">
                            <div class="text-center">
                                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4E157] to-[#84B01E] flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <i class="pi pi-sliders-h text-3xl text-[#1A262F]"></i>
                                </div>
                                <h2 class="text-3xl font-black text-[#1A262F]">Distribución</h2>
                                <p class="text-gray-500 mt-2 font-medium">¿Cuántas habitaciones y baños tiene?</p>
                            </div>
                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-black mb-3 uppercase tracking-wider text-gray-500 text-center">Habitaciones</label>
                                    <div class="flex items-center bg-gray-50 border-2 border-gray-100 rounded-xl overflow-hidden">
                                        <button (click)="valuationData.hab = Math.max(1, valuationData.hab - 1)" class="p-5 hover:bg-gray-100 transition-all"><i class="pi pi-minus font-bold"></i></button>
                                        <span class="flex-1 text-center font-black text-2xl text-[#1A262F]">{{ valuationData.hab }}</span>
                                        <button (click)="valuationData.hab = valuationData.hab + 1" class="p-5 hover:bg-gray-100 transition-all"><i class="pi pi-plus font-bold"></i></button>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-black mb-3 uppercase tracking-wider text-gray-500 text-center">Baños</label>
                                    <div class="flex items-center bg-gray-50 border-2 border-gray-100 rounded-xl overflow-hidden">
                                        <button (click)="valuationData.banos = Math.max(1, valuationData.banos - 1)" class="p-5 hover:bg-gray-100 transition-all"><i class="pi pi-minus font-bold"></i></button>
                                        <span class="flex-1 text-center font-black text-2xl text-[#1A262F]">{{ valuationData.banos }}</span>
                                        <button (click)="valuationData.banos = valuationData.banos + 1" class="p-5 hover:bg-gray-100 transition-all"><i class="pi pi-plus font-bold"></i></button>
                                    </div>
                                </div>
                            </div>
                            <button (click)="nextValuationStep()" class="w-full py-4 bg-[#1A262F] text-white font-black rounded-xl shadow-lg hover:bg-[#2D3E4B] transition-all">Continuar</button>
                        </div>

                        <!-- PASO 3: Extras -->
                        <div *ngIf="valuationStep === 3" class="space-y-8">
                            <div class="text-center">
                                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4E157] to-[#84B01E] flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <i class="pi pi-star text-3xl text-[#1A262F]"></i>
                                </div>
                                <h2 class="text-3xl font-black text-[#1A262F]">Extras</h2>
                                <p class="text-gray-500 mt-2 font-medium">Selecciona las características adicionales</p>
                            </div>
                            <div class="grid grid-cols-1 gap-3">
                                <button
                                    *ngFor="let extra of extrasList"
                                    (click)="valuationData[extra.key] = !valuationData[extra.key]"
                                    [ngClass]="valuationData[extra.key] ? 'border-[#D4E157] bg-lime-50' : 'border-gray-100'"
                                    class="p-5 border-2 rounded-xl flex items-center gap-4 transition-all hover:border-[#D4E157]"
                                >
                                    <div class="w-7 h-7 rounded-lg flex items-center justify-center transition-all" [ngClass]="valuationData[extra.key] ? 'bg-[#1A262F]' : 'bg-gray-100'">
                                        <i class="pi pi-check text-white text-xs" *ngIf="valuationData[extra.key]"></i>
                                    </div>
                                    <i [class]="extra.icon + ' text-xl text-gray-400'"></i>
                                    <span class="font-bold text-lg text-gray-900">{{ extra.label }}</span>
                                </button>
                                <button (click)="nextValuationStep()" class="w-full py-4 bg-[#1A262F] text-white font-black rounded-xl shadow-lg hover:bg-[#2D3E4B] transition-all mt-2">Continuar</button>
                            </div>
                        </div>

                        <!-- PASO 4: Estado -->
                        <div *ngIf="valuationStep === 4" class="space-y-8">
                            <div class="text-center">
                                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4E157] to-[#84B01E] flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <i class="pi pi-building text-3xl text-[#1A262F]"></i>
                                </div>
                                <h2 class="text-3xl font-black text-[#1A262F]">Estado de conservación</h2>
                                <p class="text-gray-500 mt-2 font-medium">¿En qué estado se encuentra?</p>
                            </div>
                            <div class="space-y-3">
                                <button
                                    *ngFor="let est of estadosList"
                                    (click)="valuationData.estado = est.val; calcularConDeepSeek()"
                                    class="w-full p-6 border-2 border-gray-100 rounded-2xl text-left hover:border-[#D4E157] hover:bg-lime-50 transition-all flex justify-between items-center group"
                                >
                                    <div class="flex items-center gap-4">
                                        <i [class]="est.icon + ' text-2xl text-gray-400 group-hover:text-[#1A262F]'"></i>
                                        <div>
                                            <span class="text-xl font-black text-gray-900 block">{{ est.label }}</span>
                                            <span class="text-sm text-gray-500">{{ est.desc }}</span>
                                        </div>
                                    </div>
                                    <i class="pi pi-chevron-right text-gray-300 group-hover:text-[#1A262F] transition-colors"></i>
                                </button>
                            </div>
                        </div>

                        <!-- ═══ PASO 6: RESULTADO ═══ -->
                        <div *ngIf="valuationStep === 6" class="text-center space-y-6">
                            <!-- LOADING -->
                            @if (aiLoading) {
                                <div class="py-12">
                                    <div class="relative w-24 h-24 mx-auto mb-8">
                                        <div class="absolute inset-0 rounded-full bg-gradient-to-br from-[#D4E157] to-[#84B01E] animate-ping opacity-30"></div>
                                        <div class="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#D4E157] to-[#84B01E] flex items-center justify-center shadow-2xl">
                                            <i class="pi pi-spin pi-spinner text-4xl text-[#1A262F]"></i>
                                        </div>
                                    </div>
                                    <h2 class="text-2xl font-black text-[#1A262F] mb-3">DeepSeek está analizando...</h2>
                                    <p class="text-gray-500 font-medium">Calculando el valor de mercado de tu inmueble</p>
                                    <div class="w-48 h-2 bg-gray-100 rounded-full mt-8 mx-auto overflow-hidden">
                                        <div class="h-full bg-gradient-to-r from-[#D4E157] to-[#84B01E] rounded-full animate-pulse" style="width: 70%"></div>
                                    </div>
                                </div>
                            } @else {
                                <!-- RESULTADO -->
                                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4E157] to-[#84B01E] flex items-center justify-center mx-auto mb-2 shadow-lg">
                                    <i class="pi pi-robot text-2xl text-[#1A262F]"></i>
                                </div>
                                <h2 class="text-3xl font-black text-[#1A262F]">Valoración completada</h2>
                                <p class="text-sm text-gray-500 font-medium -mt-2">Análisis generado por DeepSeek IA</p>

                                <!-- Card Precio -->
                                <div class="p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#1A262F] to-[#2D3E4B]">
                                    <div class="absolute top-0 right-0 w-40 h-40 bg-[#D4E157]/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                    <div class="absolute bottom-0 left-0 w-32 h-32 bg-[#D4E157]/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                                    <div class="relative z-10">
                                        <p class="text-xs uppercase tracking-widest opacity-70 mb-1 font-black">Precio Estimado</p>
                                        <h3 class="text-5xl font-black mb-4 text-white">{{ estimatedPrice | currency: 'EUR' : 'symbol' : '1.0-0' }}</h3>
                                        <div class="flex justify-between items-center bg-white/15 p-4 rounded-xl backdrop-blur-md border border-white/10">
                                            <div class="text-left">
                                                <p class="text-[10px] opacity-70 uppercase font-black tracking-wider">Rango de mercado</p>
                                                <p class="font-bold text-sm text-white">{{ estimatedPrice * 0.92 | currency: 'EUR' : 'symbol' : '1.0-0' }} – {{ estimatedPrice * 1.08 | currency: 'EUR' : 'symbol' : '1.0-0' }}</p>
                                            </div>
                                            <div class="w-10 h-10 rounded-xl bg-[#D4E157]/20 flex items-center justify-center">
                                                <i class="pi pi-chart-line text-[#D4E157]"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Resumen de datos -->
                                <div class="flex justify-center gap-4 text-sm">
                                    <span class="px-4 py-2 bg-gray-50 rounded-xl font-bold text-gray-600 flex items-center gap-2"> <i class="pi pi-home text-[#D4E157]"></i> {{ valuationData.tipo }} </span>
                                    <span class="px-4 py-2 bg-gray-50 rounded-xl font-bold text-gray-600 flex items-center gap-2"> <i class="pi pi-map-marker text-[#D4E157]"></i> {{ valuationData.cp }} </span>
                                    <span class="px-4 py-2 bg-gray-50 rounded-xl font-bold text-gray-600 flex items-center gap-2"> <i class="pi pi-sliders-h text-[#D4E157]"></i> {{ valuationData.m2 }}m² </span>
                                </div>

                                <!-- Reasoning -->
                                <div class="p-5 bg-gray-50 rounded-2xl border border-gray-100 text-left relative">
                                    <div class="absolute -top-3 left-6 px-4 py-1 bg-gradient-to-r from-[#D4E157] to-[#84B01E] text-[#1A262F] rounded-full flex items-center gap-2 shadow-sm text-[10px] font-black tracking-wider">
                                        <i class="pi pi-sparkles text-[10px]"></i> ANÁLISIS DEEPSEEK
                                    </div>
                                    <p class="text-gray-700 text-sm leading-relaxed mt-2">"{{ aiReasoning }}"</p>
                                </div>

                                <!-- Botones -->
                                <div class="flex flex-col gap-3 pt-2">
                                    <button pButton label="Publicar mi anuncio" icon="pi pi-plus-circle" class="btn-publish-premium" (click)="router.navigate(['/publicar-anuncio']); closeValuationModal()"></button>
                                    <div class="flex gap-3">
                                        <button pButton label="Cerrar" class="flex-1 py-4 p-button-secondary p-button-text font-black text-gray-500" (click)="closeValuationModal()"></button>
                                        <button pButton label="Contactar Agente" class="flex-1 py-4 font-black rounded-xl shadow-lg bg-[#1A262F] text-white border-none hover:bg-[#2D3E4B]" (click)="router.navigate(['/contacto'])"></button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal App -->
            <div *ngIf="showAppModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" (click)="closeAppModal()"></div>
                <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 p-8">
                    <button (click)="closeAppModal()" class="absolute top-6 right-6 text-gray-400 hover:text-gray-900"><i class="pi pi-times text-xl"></i></button>
                    <h2 class="text-2xl font-bold mb-6">TuPisoYa en tu móvil</h2>
                    <div class="grid grid-cols-2 gap-8">
                        <div class="text-center p-4 border rounded-2xl bg-gray-50">
                            <h3 class="font-bold mb-4">Android</h3>
                            <img src="/demo/images/galleria/qr_playstore.png" class="w-32 h-32 mx-auto mb-4" />
                            <button class="w-full py-2 bg-gray-900 text-white rounded-lg font-bold">Google Play</button>
                        </div>
                        <div class="text-center p-4 border rounded-2xl bg-gray-50">
                            <h3 class="font-bold mb-4">iOS</h3>
                            <img src="/demo/images/galleria/qr_appstore.png" class="w-32 h-32 mx-auto mb-4" />
                            <button class="w-full py-2 bg-gray-900 text-white rounded-lg font-bold">App Store</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .landing-wrapper {
                scroll-behavior: smooth;
            }

            .hero-section {
                position: relative;
                background: linear-gradient(135deg, #d4e157 0%, #a3c92a 50%, #84b01e 100%);
                border-bottom: 1px solid rgba(212, 225, 87, 0.3);
            }
            .hero-bg-overlay {
                position: absolute;
                top: -20%;
                right: -10%;
                width: 60%;
                height: 100%;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
                filter: blur(100px);
                z-index: 0;
            }
            .hero-glow-1 {
                position: absolute;
                bottom: -30%;
                left: -10%;
                width: 50%;
                height: 80%;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
                filter: blur(80px);
                z-index: 0;
            }
            .hero-glow-2 {
                position: absolute;
                top: 10%;
                left: 30%;
                width: 40%;
                height: 60%;
                background: radial-gradient(circle, rgba(26, 38, 47, 0.05) 0%, transparent 70%);
                filter: blur(60px);
                z-index: 0;
            }
            .hero-title {
                font-family: 'Inter', sans-serif;
                line-height: 0.9;
            }

            .toggle-btn-premium {
                color: #64748b;
                &:hover {
                    color: #1a262f;
                }
                &.active {
                    background: linear-gradient(135deg, #1a262f 0%, #2d3e4b 100%);
                    color: #fff;
                    box-shadow: 0 10px 20px rgba(26, 38, 47, 0.2);
                }
            }
            .premium-input {
                background: rgba(255, 255, 255, 0.4);
                border: 2px solid transparent;
                color: #1a262f;
                transition: all 0.3s ease;
                &:focus {
                    background: #fff;
                    border-color: #d4e157;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                }
            }
            .btn-search-premium {
                background: linear-gradient(135deg, #1a262f 0%, #2d3e4b 100%);
                border: none;
                transition: all 0.3s ease;
                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 20px 40px rgba(26, 38, 47, 0.3);
                }
            }
            .section-tag {
                display: inline-block;
                font-size: 0.75rem;
                font-weight: 900;
                letter-spacing: 0.2em;
                color: #1a262f;
                background: #f1f5f9;
                padding: 0.5rem 1.25rem;
                border-radius: 999px;
                &.color-lime {
                    background: #f1f9b8;
                    color: #828a2c;
                }
            }
            .btn-action-premium {
                background: #1a262f;
                color: #d4e157;
                padding: 1rem 2rem;
                border-radius: 1.25rem;
                font-weight: 900;
                transition: all 0.3s ease;
                &:hover {
                    transform: translateX(5px);
                    box-shadow: 0 15px 30px rgba(26, 38, 47, 0.2);
                }
            }
            .btn-close-premium {
                background: #f1f5f9 !important;
                border: none !important;
                color: #64748b !important;
                font-weight: 800 !important;
                border-radius: 1rem !important;
                padding: 0.75rem 1.5rem !important;
                &:hover {
                    background: #e2e8f0 !important;
                    color: #1a262f !important;
                }
            }
            .back-btn-premium {
                display: flex;
                align-items: center;
                gap: 1rem;
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 0;
                color: #94a3b8;
                font-weight: 800;
                transition: all 0.3s ease;
                .back-icon-wrap {
                    width: 3.5rem;
                    height: 3.5rem;
                    background: #f8fafc;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    i {
                        font-size: 1.25rem;
                    }
                }
                &:hover {
                    color: #1a262f;
                    .back-icon-wrap {
                        background: #1a262f;
                        color: #d4e157;
                        transform: translateX(-5px);
                    }
                }
            }
            .btn-publish-premium {
                background: linear-gradient(135deg, #d4e157 0%, #a3c92a 50%, #84b01e 100%) !important;
                border: none !important;
                color: #1a262f !important;
                font-weight: 900 !important;
                padding: 1rem 2rem !important;
                border-radius: 1.25rem !important;
                box-shadow: 0 10px 30px rgba(212, 225, 87, 0.3) !important;
                transition: all 0.3s ease !important;
                width: 100%;
                &:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 20px 40px rgba(212, 225, 87, 0.4) !important;
                }
            }
        `
    ]
})
export class Landing implements OnInit {
    operacion: string = 'comprar';
    tipoSeleccionado: string = 'piso';
    terminoBusqueda: string = '';
    tiposInmueble = [
        { label: 'Piso', value: 'piso' },
        { label: 'Casa', value: 'casa' },
        { label: 'Local', value: 'local' },
        { label: 'Oficina', value: 'oficina' }
    ];

    router = inject(Router);
    private route = inject(ActivatedRoute);
    private http = inject(HttpClient);
    private cdr = inject(ChangeDetectorRef);

    buscando: boolean = false;
    operacionActiva: string = '';
    terminoBusquedaActivo: string = '';

    verDetalleActivo: boolean = false;
    detalleId: number | null = null;
    detalleTipo: 'venta' | 'alquiler' | null = null;

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            if (params['detalle'] && params['tipo']) {
                this.detalleId = +params['detalle'];
                this.detalleTipo = params['tipo'] as any;
                this.verDetalleActivo = true;
                this.buscando = true;
            } else if (params['q'] && params['op']) {
                this.terminoBusquedaActivo = params['q'];
                this.operacionActiva = params['op'];
                this.buscando = true;
                this.verDetalleActivo = false;
            } else {
                this.buscando = false;
                this.verDetalleActivo = false;
            }
        });
    }

    ejecutarBusqueda() {
        if (this.terminoBusqueda.trim()) {
            this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { q: this.terminoBusqueda, op: this.operacion, detalle: null, tipo: null },
                queryParamsHandling: 'merge'
            });
        }
    }

    cerrarBusqueda() {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { q: null, op: null, detalle: null, tipo: null },
            queryParamsHandling: 'merge'
        });
    }

    mostrarDetalle(event: { id: number; tipo: 'venta' | 'alquiler' }) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { detalle: event.id, tipo: event.tipo },
            queryParamsHandling: 'merge'
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    volver() {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { detalle: null, tipo: null },
            queryParamsHandling: 'merge'
        });
    }

    showAppModal: boolean = false;
    showValuationModal: boolean = false;
    valuationStep: number = 1;
    valuationData: any = { tipo: '', cp: '', m2: null, hab: 3, banos: 2, ascensor: false, garaje: false, terraza: false, estado: '' };
    estimatedPrice: number = 0;
    aiReasoning: string = '';
    deepseekApiKey: string = 'sk-8dfe865adeba40c3bcdc1fb3136a63b3';
    aiLoading: boolean = false;
    usandoIA: boolean = false;
    Math = Math;

    extrasList = [
        { key: 'ascensor', label: 'Ascensor', icon: 'pi pi-arrow-up' },
        { key: 'garaje', label: 'Garaje', icon: 'pi pi-car' },
        { key: 'terraza', label: 'Terraza', icon: 'pi pi-sun' }
    ];

    estadosList = [
        { val: 'Reformado', label: 'Reformado', desc: 'Totalmente renovado, listo para entrar', icon: 'pi pi-check-circle' },
        { val: 'Buen estado', label: 'Buen estado', desc: 'Habitable, necesita pequeñas mejoras', icon: 'pi pi-thumbs-up' },
        { val: 'A reformar', label: 'A reformar', desc: 'Necesita reforma completa', icon: 'pi pi-exclamation-triangle' }
    ];

    openValuationModal() {
        this.showValuationModal = true;
        this.valuationStep = 1;
    }
    closeValuationModal() {
        this.showValuationModal = false;
    }
    openAppModal() {
        this.showAppModal = true;
    }
    closeAppModal() {
        this.showAppModal = false;
    }

    nextValuationStep() {
        if (this.valuationStep === 2)
            this.valuationStep = 25; // Ir a hab/baños
        else if (this.valuationStep === 25)
            this.valuationStep = 3; // Ir a extras
        else if (this.valuationStep < 4) this.valuationStep++;
        else this.calcularConDeepSeek();
    }

    calcularConDeepSeek() {
        this.usandoIA = true;
        this.aiLoading = true;
        this.valuationStep = 6;

        const d = this.valuationData;
        const extrasStr = [d.ascensor && 'ascensor', d.garaje && 'garaje', d.terraza && 'terraza'].filter(Boolean).join(', ');

        // Llamamos a NUESTRO backend (asegúrate de que la URL coincida)
        this.http
            .post('http://localhost:8080/api/tasacion/calcular', {
                tipo: d.tipo,
                cp: d.cp,
                m2: d.m2,
                hab: d.hab,
                banos: d.banos,
                estado: d.estado,
                extras: extrasStr || 'ninguno'
            })
            .subscribe({
                next: (res: any) => {
                    try {
                        console.log('Respuesta completa del backend:', res);

                        // Intentamos extraer el contenido de la IA desde diferentes formatos posibles
                        let contentString: string | null = null;

                        // Formato 1: OpenAI/DeepSeek API (choices[0].message.content)
                        if (res.choices?.[0]?.message?.content) {
                            contentString = res.choices[0].message.content;
                        }
                        // Formato 2: Respuesta directa del backend con campo 'content'
                        else if (res.content) {
                            contentString = res.content;
                        }
                        // Formato 3: Respuesta directa con 'respuesta' o 'mensaje'
                        else if (res.respuesta) {
                            contentString = res.respuesta;
                        }
                        // Formato 4: El JSON ya viene directamente en el body
                        else if (res.precio) {
                            this.estimatedPrice = res.precio;
                            this.aiReasoning = res.razonamiento || '';
                            this.aiLoading = false;
                            this.cdr.detectChanges();
                            return;
                        }

                        if (contentString) {
                            console.log('Contenido recibido de la IA:', contentString);
                            // Convertimos ese texto en un objeto JS
                            const data = JSON.parse(contentString);
                            this.estimatedPrice = data.precio;
                            this.aiReasoning = data.razonamiento;
                        } else {
                            console.error('No se pudo extraer contenido de la respuesta:', res);
                            this.calcularFallback();
                        }
                    } catch (e) {
                        console.error('Fallo al procesar el JSON interno:', e);
                        this.calcularFallback();
                    }
                    // IMPORTANTE: Apagamos el cargando
                    this.aiLoading = false;
                    // Forzamos la detección de cambios para que Angular actualice la UI
                    this.cdr.detectChanges();
                },
                error: (err: any) => {
                    console.error('Error en la petición HTTP:', err);
                    this.calcularFallback();
                    this.aiLoading = false;
                    this.cdr.detectChanges();
                }
            });
    }
    private calcularFallback() {
        const prefijo = this.valuationData.cp.substring(0, 2);
        const mult = prefijo === '28' || prefijo === '08' ? 1.45 : 1.0;
        let price = (this.valuationData.m2 || 80) * (this.valuationData.tipo === 'piso' ? 2400 : 3100) * mult;
        if (this.valuationData.ascensor) price += 25000;
        if (this.valuationData.garaje) price += 15000;
        if (this.valuationData.terraza) price += 12000;
        if (this.valuationData.estado === 'Reformado') price *= 1.15;
        if (this.valuationData.estado === 'A reformar') price *= 0.85;
        this.estimatedPrice = price;
        this.aiReasoning = 'Cálculo de respaldo: valor estimado según parámetros estándar del mercado.';
    }
}
