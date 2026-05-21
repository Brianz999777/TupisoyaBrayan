import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterWidget } from '../topbar/footerwidget';
import { TopbarWidget } from '../topbar/topbarwidget.component';

@Component({
    selector: 'app-servicios',
    standalone: true,
    imports: [CommonModule, TopbarWidget, FooterWidget],
    template: `
        <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950">
            <topbar-widget />

            <!-- Hero -->
            <section class="relative pt-32 pb-20 overflow-hidden flex flex-col items-center justify-center">
                <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"></div>
                <div class="absolute top-1/3 -left-32 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-500/5 rounded-full blur-3xl"></div>
                <div class="relative z-10 max-w-[120rem] mx-auto px-8 lg:px-32 flex flex-col items-center justify-center w-full">
                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-full text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6">
                        <i class="pi pi-sparkles text-xs"></i>
                        <span>Nuestros Servicios</span>
                    </div>
                    <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight" style="text-align: center; width: 100%;">
                        Todo lo que necesitas en un
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">solo lugar</span>
                    </h1>
                    <p class="text-lg text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed" style="text-align: center; width: 100%;">
                        Desde la búsqueda hasta el cierre, te ofrecemos soluciones completas para que comprar, vender o alquilar sea una experiencia sin preocupaciones.
                    </p>
                </div>
            </section>

            <!-- Services Grid -->
            <section class="py-20 bg-gray-50 dark:bg-gray-900/50">
                <div class="max-w-[120rem] mx-auto px-8 lg:px-32">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-emerald-100 dark:hover:border-emerald-500/20 transition-all group">
                            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <i class="pi pi-shopping-cart text-2xl text-white"></i>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Compra Directa</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">Te acompañamos en todo el proceso de búsqueda, negociación y cierre para que consigas el mejor precio por tu nuevo hogar.</p>
                            <button class="inline-flex items-center gap-2 text-sm font-semibold text-emerald-500 hover:text-emerald-600 transition-colors">
                                Saber más <i class="pi pi-arrow-right text-xs"></i>
                            </button>
                        </div>

                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-emerald-100 dark:hover:border-emerald-500/20 transition-all group">
                            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <i class="pi pi-tag text-2xl text-white"></i>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Venta Premium</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">Utilizamos inteligencia artificial y marketing digital de vanguardia para vender tu propiedad en tiempo récord.</p>
                            <button class="inline-flex items-center gap-2 text-sm font-semibold text-emerald-500 hover:text-emerald-600 transition-colors">
                                Saber más <i class="pi pi-arrow-right text-xs"></i>
                            </button>
                        </div>

                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-emerald-100 dark:hover:border-emerald-500/20 transition-all group">
                            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <i class="pi pi-key text-2xl text-white"></i>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Gestión de Alquiler</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">Filtramos a los inquilinos y gestionamos los contratos para que tú solo te preocupes de recibir tu renta cada mes.</p>
                            <button class="inline-flex items-center gap-2 text-sm font-semibold text-emerald-500 hover:text-emerald-600 transition-colors">
                                Saber más <i class="pi pi-arrow-right text-xs"></i>
                            </button>
                        </div>

                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-emerald-100 dark:hover:border-emerald-500/20 transition-all group">
                            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <i class="pi pi-chart-line text-2xl text-white"></i>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Tasación Gratuita</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">Obtén un informe detallado del valor de mercado de tu propiedad basado en datos reales y actualizados.</p>
                            <button class="inline-flex items-center gap-2 text-sm font-semibold text-emerald-500 hover:text-emerald-600 transition-colors">
                                Saber más <i class="pi pi-arrow-right text-xs"></i>
                            </button>
                        </div>

                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-emerald-100 dark:hover:border-emerald-500/20 transition-all group">
                            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <i class="pi pi-briefcase text-2xl text-white"></i>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Asesoría Legal</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">Expertos en derecho inmobiliario para resolver cualquier duda sobre contratos, herencias o trámites hipotecarios.</p>
                            <button class="inline-flex items-center gap-2 text-sm font-semibold text-emerald-500 hover:text-emerald-600 transition-colors">
                                Saber más <i class="pi pi-arrow-right text-xs"></i>
                            </button>
                        </div>

                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-emerald-100 dark:hover:border-emerald-500/20 transition-all group">
                            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <i class="pi pi-money-bill text-2xl text-white"></i>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Oportunidades de Inversión</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">Accede a propiedades exclusivas con alta rentabilidad antes de que salgan al mercado público.</p>
                            <button class="inline-flex items-center gap-2 text-sm font-semibold text-emerald-500 hover:text-emerald-600 transition-colors">
                                Saber más <i class="pi pi-arrow-right text-xs"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <footer-widget />
        </div>
    `
})
export class Servicios {}
