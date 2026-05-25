import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TopbarWidget } from './components/topbarwidget.component';
import { FooterWidget } from './components/footerwidget';
import { BuquedaAlquiler } from '../pagina/buqueda-alquiler/buqueda-alquiler';
import { BuquedaVenta } from '../pagina/buqueda-venta/buqueda-venta';
import { DetalleInmueble } from '../pagina/detalle-inmueble/detalle-inmueble';
import { MapaBusqueda } from '../pagina/mapa-busqueda/mapa-busqueda';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule, TopbarWidget, FooterWidget, RippleModule, StyleClassModule, ButtonModule, InputTextModule, BuquedaVenta, BuquedaAlquiler, DetalleInmueble, MapaBusqueda],
    template: `
        <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950">
            <topbar-widget [isHero]="!buscando && !verDetalleActivo" />

            @if (!buscando && !verDetalleActivo) {
                <!-- ═══ HERO ═══ -->
                <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
                    <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('/demo/images/galleria/portada.jpg');"></div>
                    <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

                    <div class="relative z-10 max-w-[120rem] mx-auto px-8 lg:px-32 text-center">
                        <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm font-medium mb-8 border border-white/20">
                            <i class="pi pi-sparkles text-xs"></i>
                            <span>Plataforma inteligente de inmuebles</span>
                        </div>

                        <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.05] tracking-tight">
                            Encuentra tu
                            <span class="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">hogar ideal</span>
                        </h1>
                        <p class="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-12 leading-relaxed">Descubre la propiedad perfecta en Zaragoza con nuestra tecnología inteligente. Compra, alquila o vende de forma fácil y segura.</p>

                        <!-- Search Bar -->
                        <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-3 shadow-xl shadow-emerald-500/5 border border-gray-100 dark:border-gray-700">
                            <div class="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                                <div class="flex bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1">
                                    <button
                                        (click)="operacion = 'comprar'"
                                        class="px-6 py-3 rounded-lg text-sm font-semibold transition-all"
                                        [ngClass]="operacion === 'comprar' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'"
                                    >
                                        Comprar
                                    </button>
                                    <button
                                        (click)="operacion = 'alquilar'"
                                        class="px-6 py-3 rounded-lg text-sm font-semibold transition-all"
                                        [ngClass]="operacion === 'alquilar' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'"
                                    >
                                        Alquilar
                                    </button>
                                </div>

                                <div class="flex-1 relative">
                                    <i class="pi pi-building absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                    <select
                                        [(ngModel)]="tipoSeleccionado"
                                        class="w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-emerald-500/20"
                                    >
                                        <option *ngFor="let tipo of tiposInmueble" [value]="tipo.value">{{ tipo.label }}</option>
                                    </select>
                                </div>

                                <div class="flex-[2] relative">
                                    <i class="pi pi-map-marker absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                    <input
                                        type="text"
                                        [(ngModel)]="terminoBusqueda"
                                        placeholder="Ciudad, barrio o código postal..."
                                        class="w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        (keyup.enter)="ejecutarBusqueda()"
                                    />
                                </div>

                                <div class="flex gap-2">
                                    <button
                                        (click)="ejecutarBusqueda()"
                                        class="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <i class="pi pi-search"></i>
                                        <span>Buscar</span>
                                    </button>
                                    <button
                                        (click)="scrollToMapa()"
                                        class="px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <i class="pi pi-map"></i>
                                        <span>Mapa</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Stats -->
                        <div class="flex items-center justify-center gap-8 md:gap-16 mt-16">
                            <div class="text-center">
                                <div class="text-3xl font-bold text-white">+50K</div>
                                <div class="text-sm text-gray-300 mt-1">Usuarios activos</div>
                            </div>
                            <div class="w-px h-12 bg-white/20"></div>
                            <div class="text-center">
                                <div class="text-3xl font-bold text-white">+10K</div>
                                <div class="text-sm text-gray-300 mt-1">Propiedades</div>
                            </div>
                            <div class="w-px h-12 bg-white/20"></div>
                            <div class="text-center">
                                <div class="text-3xl font-bold text-white">98%</div>
                                <div class="text-sm text-gray-300 mt-1">Satisfacción</div>
                            </div>
                        </div>

                        <!-- Tasador CTA -->
                        <div class="mt-10">
                            <button
                                (click)="openValuationModal()"
                                class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold rounded-2xl transition-all shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/40 text-lg animate-pulse hover:animate-none"
                            >
                                <i class="pi pi-chart-line text-xl"></i>
                                <span>¿Cuánto vale tu casa? Tásala gratis</span>
                                <i class="pi pi-arrow-right text-sm"></i>
                            </button>
                        </div>
                    </div>
                </section>

                <!-- ═══ FEATURES ═══ -->
                <section class="py-24 bg-gray-50 dark:bg-gray-900/50">
                    <div class="max-w-[120rem] mx-auto px-8 lg:px-32">
                        <div class="text-center mb-16">
                            <span class="text-sm font-semibold text-emerald-500 uppercase tracking-wider">¿Por qué elegirnos?</span>
                            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-3 text-center">Todo lo que necesitas en un solo lugar</h2>
                            <p class="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto text-center">Simplificamos cada paso del proceso inmobiliario con tecnología avanzada y atención personalizada.</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-emerald-100 dark:hover:border-emerald-500/20 transition-all group">
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <i class="pi pi-search text-white"></i>
                                </div>
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Búsqueda Inteligente</h3>
                                <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Encuentra propiedades que se ajusten exactamente a lo que buscas con nuestros filtros avanzados y recomendaciones personalizadas.</p>
                            </div>

                            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-emerald-100 dark:hover:border-emerald-500/20 transition-all group">
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <i class="pi pi-robot text-white"></i>
                                </div>
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tasación con IA</h3>
                                <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Obtén una valoración precisa de tu propiedad en segundos gracias a nuestra inteligencia artificial entrenada con datos del mercado.</p>
                            </div>

                            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-emerald-100 dark:hover:border-emerald-500/20 transition-all group">
                                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                    <i class="pi pi-shield text-white"></i>
                                </div>
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Transacciones Seguras</h3>
                                <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Cada anuncio es verificado. Te acompañamos en todo el proceso para garantizar una experiencia 100% segura y sin sorpresas.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ═══ MAPA BÚSQUEDA POR ZONA ═══ -->
                <section class="py-24">
                    <div class="max-w-[120rem] mx-auto px-8 lg:px-32">
                        <div class="text-center mb-12">
                            <span class="text-sm font-semibold text-emerald-500 uppercase tracking-wider">Búsqueda geográfica</span>
                            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-3">Encuentra inmuebles dibujando en el mapa</h2>
                            <p class="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
                                Selecciona una zona en el mapa dibujando un polígono y descubre todas las propiedades disponibles en esa área.
                                Como en Idealista, pero más inteligente.
                            </p>
                        </div>
                        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <app-mapa-busqueda />
                        </div>
                    </div>
                </section>

                <!-- ═══ APP ═══ -->
                <section class="py-24">
                    <div class="max-w-[120rem] mx-auto px-8 lg:px-32">
                        <div class="flex flex-col lg:flex-row items-center gap-16">
                            <div class="flex-1">
                                <span class="text-sm font-semibold text-emerald-500 uppercase tracking-wider">App Móvil</span>
                                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-6">Lleva TuPisoYa siempre contigo</h2>
                                <p class="text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-lg">Sé el primero en enterarte de nuevos inmuebles, recibe notificaciones de cambios en tus favoritos y gestiona todo desde tu móvil.</p>
                                <div class="flex flex-wrap gap-4">
                                    <button class="inline-flex items-center gap-3 px-6 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
                                        <i class="pi pi-android text-xl"></i>
                                        <div class="text-left">
                                            <div class="text-xs opacity-70">Descargar en</div>
                                            <div class="text-sm font-bold">Google Play</div>
                                        </div>
                                    </button>
                                    <button class="inline-flex items-center gap-3 px-6 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
                                        <i class="pi pi-apple text-xl"></i>
                                        <div class="text-left">
                                            <div class="text-xs opacity-70">Descargar en</div>
                                            <div class="text-sm font-bold">App Store</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                            <div class="flex-1 flex justify-center">
                                <div class="relative">
                                    <div class="w-72 h-[500px] bg-gradient-to-b from-emerald-400 to-teal-500 rounded-[3rem] shadow-2xl p-4">
                                        <div class="w-full h-full bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden flex flex-col">
                                            <div class="bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
                                                <div class="flex items-center gap-2">
                                                    <div class="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                                                        <i class="pi pi-home text-white text-xs"></i>
                                                    </div>
                                                    <span class="text-white font-bold text-sm">TuPisoYa</span>
                                                </div>
                                            </div>
                                            <div class="flex-1 p-4 space-y-3">
                                                <div class="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4"></div>
                                                <div class="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
                                                <div class="h-32 bg-gray-100 dark:bg-gray-700 rounded-xl mt-4"></div>
                                                <div class="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full"></div>
                                                <div class="h-4 bg-gray-100 dark:bg-gray-700 rounded w-5/6"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-100 dark:bg-emerald-500/10 rounded-full blur-2xl"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ═══ VALUATION CTA ═══ -->
                <section class="py-24 bg-gray-50 dark:bg-gray-900/50">
                    <div class="max-w-[120rem] mx-auto px-8 lg:px-32">
                        <div class="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-12 md:p-16 relative overflow-hidden flex flex-col items-center justify-center">
                            <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                            <div class="relative z-10 flex flex-col items-center justify-center w-full">
                                <h2 class="text-3xl md:text-4xl font-bold text-white mb-4" style="text-align: center; width: 100%;">¿Cuánto vale tu propiedad?</h2>
                                <p class="text-emerald-50/80 max-w-2xl mb-8 leading-relaxed" style="text-align: center; width: 100%;">Obtén una valoración online gratuita en segundos. Nuestra IA analiza el mercado y te da un precio preciso.</p>
                                <button (click)="openValuationModal()" class="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-all shadow-lg">
                                    <i class="pi pi-chart-line"></i>
                                    <span>Valorar mi casa gratis</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            }

            <!-- ═══ SEARCH / DETAIL ═══ -->
            @if (buscando || verDetalleActivo) {
                <div class="flex-1 bg-gray-50 dark:bg-gray-900/50 px-8 lg:px-32 py-8">
                    <div class="max-w-[120rem] mx-auto">
                        @if (buscando && !verDetalleActivo) {
                            <div class="flex items-center justify-between mb-8 pb-6 mt-20 border-b border-gray-200 dark:border-gray-700">
                                <div>
                                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Resultados de búsqueda</p>
                                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Propiedades encontradas</h2>
                                </div>
                                <button
                                    (click)="cerrarBusqueda()"
                                    class="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 transition-all"
                                >
                                    <i class="pi pi-times mr-1"></i> Cerrar
                                </button>
                            </div>
                        }
                        @if (verDetalleActivo) {
                            <button (click)="volver()" class="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors">
                                <i class="pi pi-arrow-left"></i>
                                <span>Volver a resultados</span>
                            </button>
                        }
                        <app-buqueda-venta *ngIf="buscando && !verDetalleActivo && operacionActiva === 'comprar'" [terminoBusquedaInput]="terminoBusquedaActivo" (onInmuebleSelected)="mostrarDetalle($event)"></app-buqueda-venta>
                        <app-detalle-inmueble *ngIf="verDetalleActivo" [idInput]="detalleId" [tipoInput]="detalleTipo"></app-detalle-inmueble>
                        <app-buqueda-alquiler *ngIf="buscando && !verDetalleActivo && operacionActiva === 'alquilar'" [terminoBusquedaInput]="terminoBusquedaActivo" (onInmuebleSelected)="mostrarDetalle($event)"></app-buqueda-alquiler>
                    </div>
                </div>
            }

            <footer-widget />

            <!-- ═══ VALUATION MODAL ═══ -->
            @if (showValuationModal) {
                <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" (click)="closeValuationModal()"></div>
                    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10">
                        <button (click)="closeValuationModal()" class="absolute top-4 right-4 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-all z-20">
                            <i class="pi pi-times text-sm text-gray-500"></i>
                        </button>

                        <div class="h-1.5 bg-gray-100 dark:bg-gray-700">
                            <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" [style.width.%]="(valuationStep / 6) * 100"></div>
                        </div>

                        <div class="p-8">
                            @if (valuationStep === 1) {
                                <div class="text-center space-y-6">
                                    <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto shadow-lg">
                                        <i class="pi pi-home text-2xl text-white"></i>
                                    </div>
                                    <div>
                                        <h3 class="text-xl font-bold text-gray-900 dark:text-white">¿Qué quieres valorar?</h3>
                                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Selecciona el tipo de inmueble</p>
                                    </div>
                                    <div class="grid grid-cols-2 gap-3">
                                        <button
                                            (click)="valuationData.tipo = 'piso'; nextValuationStep()"
                                            class="p-6 border-2 border-gray-100 dark:border-gray-600 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all group"
                                        >
                                            <i class="pi pi-building text-3xl mb-3 text-gray-400 group-hover:text-emerald-500"></i>
                                            <span class="block font-semibold text-gray-900 dark:text-white">Piso</span>
                                        </button>
                                        <button
                                            (click)="valuationData.tipo = 'casa'; nextValuationStep()"
                                            class="p-6 border-2 border-gray-100 dark:border-gray-600 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all group"
                                        >
                                            <i class="pi pi-home text-3xl mb-3 text-gray-400 group-hover:text-emerald-500"></i>
                                            <span class="block font-semibold text-gray-900 dark:text-white">Casa</span>
                                        </button>
                                    </div>
                                </div>
                            }

                            @if (valuationStep === 2) {
                                <div class="space-y-6">
                                    <div class="text-center">
                                        <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto shadow-lg">
                                            <i class="pi pi-map-marker text-2xl text-white"></i>
                                        </div>
                                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mt-4">Ubicación y superficie</h3>
                                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Datos básicos del inmueble</p>
                                    </div>
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Código Postal</label>
                                            <input
                                                type="text"
                                                [(ngModel)]="valuationData.cp"
                                                placeholder="Ej: 50001"
                                                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Metros Cuadrados</label>
                                            <input
                                                type="number"
                                                [(ngModel)]="valuationData.m2"
                                                placeholder="Ej: 85"
                                                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            />
                                        </div>
                                        <button
                                            (click)="nextValuationStep()"
                                            [disabled]="!valuationData.cp || !valuationData.m2"
                                            class="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-40 shadow-lg shadow-emerald-500/25"
                                        >
                                            Continuar
                                        </button>
                                    </div>
                                </div>
                            }

                            @if (valuationStep === 25) {
                                <div class="space-y-6">
                                    <div class="text-center">
                                        <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto shadow-lg">
                                            <i class="pi pi-sliders-h text-2xl text-white"></i>
                                        </div>
                                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mt-4">Distribución</h3>
                                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">¿Cuántas habitaciones y baños tiene?</p>
                                    </div>
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 text-center uppercase tracking-wider">Habitaciones</label>
                                            <div class="flex items-center bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                                                <button (click)="valuationData.hab = Math.max(1, valuationData.hab - 1)" class="p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"><i class="pi pi-minus text-sm font-bold"></i></button>
                                                <span class="flex-1 text-center font-bold text-xl text-gray-900 dark:text-white">{{ valuationData.hab }}</span>
                                                <button (click)="valuationData.hab = valuationData.hab + 1" class="p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"><i class="pi pi-plus text-sm font-bold"></i></button>
                                            </div>
                                        </div>
                                        <div>
                                            <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 text-center uppercase tracking-wider">Baños</label>
                                            <div class="flex items-center bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                                                <button (click)="valuationData.banos = Math.max(1, valuationData.banos - 1)" class="p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"><i class="pi pi-minus text-sm font-bold"></i></button>
                                                <span class="flex-1 text-center font-bold text-xl text-gray-900 dark:text-white">{{ valuationData.banos }}</span>
                                                <button (click)="valuationData.banos = valuationData.banos + 1" class="p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"><i class="pi pi-plus text-sm font-bold"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        (click)="nextValuationStep()"
                                        class="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25"
                                    >
                                        Continuar
                                    </button>
                                </div>
                            }

                            @if (valuationStep === 3) {
                                <div class="space-y-6">
                                    <div class="text-center">
                                        <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto shadow-lg">
                                            <i class="pi pi-star text-2xl text-white"></i>
                                        </div>
                                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mt-4">Extras</h3>
                                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Selecciona las características adicionales</p>
                                    </div>
                                    <div class="space-y-2">
                                        @for (extra of extrasList; track extra.key) {
                                            <button
                                                (click)="valuationData[extra.key] = !valuationData[extra.key]"
                                                class="w-full p-4 border-2 rounded-xl flex items-center gap-3 transition-all"
                                                [ngClass]="valuationData[extra.key] ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-gray-100 dark:border-gray-600 hover:border-emerald-500'"
                                            >
                                                <div class="w-6 h-6 rounded-lg flex items-center justify-center transition-all" [ngClass]="valuationData[extra.key] ? 'bg-emerald-500' : 'bg-gray-100 dark:bg-gray-600'">
                                                    @if (valuationData[extra.key]) {
                                                        <i class="pi pi-check text-white text-xs"></i>
                                                    }
                                                </div>
                                                <i [class]="extra.icon + ' text-lg text-gray-400'"></i>
                                                <span class="font-medium text-sm text-gray-900 dark:text-white">{{ extra.label }}</span>
                                            </button>
                                        }
                                        <button
                                            (click)="nextValuationStep()"
                                            class="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 mt-2"
                                        >
                                            Continuar
                                        </button>
                                    </div>
                                </div>
                            }

                            @if (valuationStep === 4) {
                                <div class="space-y-6">
                                    <div class="text-center">
                                        <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto shadow-lg">
                                            <i class="pi pi-building text-2xl text-white"></i>
                                        </div>
                                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mt-4">Estado de conservación</h3>
                                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">¿En qué estado se encuentra?</p>
                                    </div>
                                    <div class="space-y-2">
                                        @for (est of estadosList; track est.val) {
                                            <button
                                                (click)="valuationData.estado = est.val; calcularConDeepSeek()"
                                                class="w-full p-5 border-2 border-gray-100 dark:border-gray-600 rounded-xl text-left hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all group"
                                            >
                                                <div class="flex items-center justify-between">
                                                    <div class="flex items-center gap-3">
                                                        <i [class]="est.icon + ' text-xl text-gray-400 group-hover:text-emerald-500'"></i>
                                                        <div>
                                                            <span class="font-semibold text-gray-900 dark:text-white block">{{ est.label }}</span>
                                                            <span class="text-xs text-gray-500">{{ est.desc }}</span>
                                                        </div>
                                                    </div>
                                                    <i class="pi pi-chevron-right text-gray-300 group-hover:text-emerald-500 transition-colors"></i>
                                                </div>
                                            </button>
                                        }
                                    </div>
                                </div>
                            }

                            @if (valuationStep === 6) {
                                <div class="text-center space-y-6">
                                    @if (aiLoading) {
                                        <div class="py-8">
                                            <div class="relative w-20 h-20 mx-auto mb-6">
                                                <div class="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 animate-ping opacity-30"></div>
                                                <div class="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl">
                                                    <i class="pi pi-spin pi-spinner text-3xl text-white"></i>
                                                </div>
                                            </div>
                                            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">DeepSeek está analizando...</h3>
                                            <p class="text-sm text-gray-500 dark:text-gray-400">Calculando el valor de mercado de tu inmueble</p>
                                            <div class="w-40 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-6 mx-auto overflow-hidden">
                                                <div class="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse" style="width: 70%"></div>
                                            </div>
                                        </div>
                                    } @else {
                                        <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto shadow-lg">
                                            <i class="pi pi-robot text-2xl text-white"></i>
                                        </div>
                                        <div>
                                            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Valoración completada</h3>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">Análisis generado por DeepSeek IA</p>
                                        </div>
                                        <div class="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-2xl p-8 border border-emerald-100 dark:border-emerald-500/20">
                                            <div class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 mb-2">{{ valuationResult }}</div>
                                            <p class="text-sm text-gray-500 dark:text-gray-400">Valor estimado de mercado</p>
                                            <div class="mt-4 pt-4 border-t border-emerald-100 dark:border-emerald-500/20 text-left space-y-2">
                                                <div class="flex justify-between text-sm">
                                                    <span class="text-gray-500">Tipo</span><span class="font-semibold text-gray-900 dark:text-white capitalize">{{ valuationData.tipo }}</span>
                                                </div>
                                                <div class="flex justify-between text-sm">
                                                    <span class="text-gray-500">Superficie</span><span class="font-semibold text-gray-900 dark:text-white">{{ valuationData.m2 }} m²</span>
                                                </div>
                                                <div class="flex justify-between text-sm">
                                                    <span class="text-gray-500">Habitaciones</span><span class="font-semibold text-gray-900 dark:text-white">{{ valuationData.hab }}</span>
                                                </div>
                                                <div class="flex justify-between text-sm">
                                                    <span class="text-gray-500">Baños</span><span class="font-semibold text-gray-900 dark:text-white">{{ valuationData.banos }}</span>
                                                </div>
                                                <div class="flex justify-between text-sm">
                                                    <span class="text-gray-500">Estado</span><span class="font-semibold text-gray-900 dark:text-white capitalize">{{ valuationData.estado }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            (click)="closeValuationModal()"
                                            class="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25"
                                        >
                                            Solicitar visita
                                        </button>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    `,
    styles: [
        `
            :host ::ng-deep .p-inputtext {
                border: none !important;
            }
            :host ::ng-deep .p-button {
                border: none !important;
            }
        `
    ]
})
export class Landing implements OnInit {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private http = inject(HttpClient);
    private cdr = inject(ChangeDetectorRef);

    operacion: 'comprar' | 'alquilar' = 'comprar';
    tipoSeleccionado = 'todos';
    terminoBusqueda = '';
    buscando = false;
    verDetalleActivo = false;
    operacionActiva: 'comprar' | 'alquilar' = 'comprar';
    terminoBusquedaActivo = '';
    detalleId: number | null = null;
    detalleTipo: 'venta' | 'alquiler' = 'venta';

    tiposInmueble = [
        { label: 'Todos los tipos', value: 'todos' },
        { label: 'Pisos', value: 'piso' },
        { label: 'Casas', value: 'casa' },
        { label: 'Locales', value: 'local' },
        { label: 'Oficinas', value: 'oficina' },
        { label: 'Garajes', value: 'garaje' },
        { label: 'Terrenos', value: 'terreno' }
    ];

    // Valuation Modal
    showValuationModal = false;
    valuationStep = 1;
    aiLoading = false;
    valuationResult = '';
    Math = Math;

    valuationData: any = {
        tipo: '',
        cp: '',
        m2: 0,
        hab: 3,
        banos: 2,
        ascensor: false,
        garaje: false,
        aire: false,
        terraza: false,
        reformado: false,
        estado: ''
    };

    extrasList = [
        { key: 'ascensor', label: 'Ascensor', icon: 'pi pi-arrow-up' },
        { key: 'garaje', label: 'Garaje', icon: 'pi pi-car' },
        { key: 'aire', label: 'Aire acondicionado', icon: 'pi pi-sun' },
        { key: 'terraza', label: 'Terraza', icon: 'pi pi-sun' },
        { key: 'reformado', label: 'Reformado', icon: 'pi pi-wrench' }
    ];

    estadosList = [
        { val: 'nuevo', label: 'Nuevo', desc: 'Recién construido o estrenar', icon: 'pi pi-star' },
        { val: 'bueno', label: 'Buen estado', desc: 'Bien conservado, sin reformas necesarias', icon: 'pi pi-thumbs-up' },
        { val: 'regular', label: 'Regular', desc: 'Necesita algunas reformas', icon: 'pi pi-exclamation-triangle' },
        { val: 'reformar', label: 'A reformar', desc: 'Requiere reforma integral', icon: 'pi pi-wrench' }
    ];

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            const detalle = params['detalle'];
            const tipo = params['tipo'];
            if (detalle && tipo) {
                this.verDetalleActivo = true;
                this.detalleId = +detalle;
                this.detalleTipo = tipo;
            } else {
                this.verDetalleActivo = false;
                this.buscando = false;
            }
        });
    }

    ejecutarBusqueda() {
        this.operacionActiva = this.operacion;
        this.terminoBusquedaActivo = this.terminoBusqueda;
        this.buscando = true;
        this.verDetalleActivo = false;
    }

    cerrarBusqueda() {
        this.buscando = false;
        this.verDetalleActivo = false;
    }

    mostrarDetalle(event: { id: number; tipo: 'venta' | 'alquiler' }) {
        this.detalleId = event.id;
        this.detalleTipo = event.tipo;
        this.verDetalleActivo = true;
    }

    volver() {
        this.verDetalleActivo = false;
    }

    scrollToMapa() {
        // Buscar la sección del mapa y hacer scroll suave
        const secciones = document.querySelectorAll('section');
        // La sección del mapa es la 3ª (Hero=0, Features=1, Mapa=2)
        for (const section of secciones) {
            const heading = section.querySelector('h2');
            if (heading && heading.textContent?.includes('dibujando en el mapa')) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                break;
            }
        }
    }

    openValuationModal() {
        this.showValuationModal = true;
        this.valuationStep = 1;
        this.valuationData = { tipo: '', cp: '', m2: 0, hab: 3, banos: 2, ascensor: false, garaje: false, aire: false, terraza: false, reformado: false, estado: '' };
        this.valuationResult = '';
        this.aiLoading = false;
    }

    closeValuationModal() {
        this.showValuationModal = false;
    }

    nextValuationStep() {
        if (this.valuationStep === 2) {
            this.valuationStep = 25;
        } else if (this.valuationStep === 25) {
            this.valuationStep = 3;
        } else {
            this.valuationStep++;
        }
    }

    calcularConDeepSeek() {
        this.valuationStep = 6;
        this.aiLoading = true;

        // Simulate AI calculation
        setTimeout(() => {
            const basePrice = this.valuationData.tipo === 'piso' ? 150000 : 250000;
            const m2Factor = this.valuationData.m2 * 1200;
            const habBonus = this.valuationData.hab * 15000;
            const banosBonus = this.valuationData.banos * 10000;
            const extrasBonus = (this.valuationData.ascensor ? 8000 : 0) + (this.valuationData.garaje ? 12000 : 0) + (this.valuationData.aire ? 5000 : 0) + (this.valuationData.terraza ? 10000 : 0) + (this.valuationData.reformado ? 15000 : 0);
            const estadoFactor = this.valuationData.estado === 'nuevo' ? 1.3 : this.valuationData.estado === 'bueno' ? 1.1 : this.valuationData.estado === 'regular' ? 0.9 : 0.7;

            const total = Math.round((basePrice + m2Factor + habBonus + banosBonus + extrasBonus) * estadoFactor);
            this.valuationResult = total.toLocaleString('es-ES') + ' €';
            this.aiLoading = false;
            this.cdr.detectChanges();
        }, 2500);
    }
}
