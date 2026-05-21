import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopbarWidget } from '../topbar/topbarwidget.component';
import { FooterWidget } from '../topbar/footerwidget';

@Component({
    selector: 'app-buqueda',
    standalone: true,
    imports: [CommonModule, RouterModule, TopbarWidget, FooterWidget],
    template: `
        <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950">
            <topbar-widget class="py-6 px-6 lg:px-20 flex items-center justify-between relative lg:static" />
            <div class="flex-1">
                <section class="relative pt-32 pb-28 overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"></div>
                    <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2"></div>
                    <div class="absolute bottom-0 left-0 w-80 h-80 bg-teal-200/20 dark:bg-teal-500/5 rounded-full blur-3xl translate-y-1/2"></div>
                    <div class="relative z-10 max-w-[90rem] mx-auto px-8 lg:px-24 text-center">
                        <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">Búsqueda <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">inteligente</span></h1>
                        <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Encuentra el inmueble perfecto con nuestros filtros avanzados.</p>
                    </div>
                </section>
                <section class="py-12 bg-gray-50 dark:bg-gray-900/50">
                    <div class="max-w-4xl mx-auto px-6">
                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-10 shadow-xl shadow-emerald-500/5 border border-gray-100 dark:border-gray-700 text-center">
                            <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6">
                                <i class="pi pi-search text-4xl text-white"></i>
                            </div>
                            <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-3">Búsqueda en desarrollo</h2>
                            <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">Estamos mejorando nuestro sistema de búsqueda para ofrecerte los mejores resultados. Mientras tanto, explora nuestras categorías.</p>
                            <div class="flex flex-wrap justify-center gap-4">
                                <a routerLink="/venta" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25">
                                    <i class="pi pi-tag text-sm"></i>
                                    Ver ventas
                                </a>
                                <a routerLink="/alquiler" class="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold rounded-xl hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all border border-amber-200 dark:border-amber-500/20">
                                    <i class="pi pi-key text-sm"></i>
                                    Ver alquileres
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <app-footer-widget class="mt-auto" />
        </div>
    `
})
export class Buqueda {}
