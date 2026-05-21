import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterWidget } from '../topbar/footerwidget';
import { TopbarWidget } from '../topbar/topbarwidget.component';

@Component({
    selector: 'app-contacto',
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
                        <i class="pi pi-info-circle text-xs"></i>
                        <span>Contáctanos</span>
                    </div>
                    <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight" style="text-align: center; width: 100%;">
                        Estamos aquí para
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">ayudarte</span>
                    </h1>
                    <p class="text-lg text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed" style="text-align: center; width: 100%;">
                        ¿Tienes alguna pregunta o necesitas asistencia? Nuestro equipo está listo para resolver todas tus dudas sobre compra, alquiler o venta de propiedades.
                    </p>
                </div>
            </section>

            <!-- Contact Grid -->
            <section class="py-20 bg-gray-50 dark:bg-gray-900/50">
                <div class="max-w-[120rem] mx-auto px-8 lg:px-32">
                    <div class="flex flex-col lg:flex-row gap-12">
                        <!-- Contact Info -->
                        <div class="w-full lg:w-1/3 space-y-8">
                            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-8">Datos de Contacto</h3>
                                <div class="space-y-6">
                                    <div class="flex items-center gap-4">
                                        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                                            <i class="pi pi-phone text-lg text-white"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Llámanos</p>
                                            <p class="text-lg font-bold text-gray-900 dark:text-white">+34 900 123 456</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-4">
                                        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                                            <i class="pi pi-envelope text-lg text-white"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</p>
                                            <p class="text-lg font-bold text-gray-900 dark:text-white">info@tupisoya.com</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-4">
                                        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                                            <i class="pi pi-map-marker text-lg text-white"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ubicación</p>
                                            <p class="text-lg font-bold text-gray-900 dark:text-white">Calle Principal 123, Madrid</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- CTA Propietario -->
                            <div class="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-8 text-center relative overflow-hidden">
                                <div class="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                <div class="relative z-10">
                                    <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-5 border-2 border-white/30">
                                        <i class="pi pi-home text-2xl text-white"></i>
                                    </div>
                                    <h4 class="text-xl font-bold text-white mb-3">¿Eres propietario?</h4>
                                    <p class="text-emerald-50/80 mb-8 font-medium">Publica tu inmueble gratis y empieza a recibir ofertas hoy mismo.</p>
                                    <button class="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-bold rounded-full hover:bg-emerald-50 transition-all shadow-lg">
                                        <i class="pi pi-plus-circle"></i>
                                        Publicar Anuncio
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Contact Form -->
                        <div class="w-full lg:w-2/3">
                            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-8">Envíanos un mensaje</h3>
                                <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="flex flex-col gap-1.5">
                                        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre Completo</label>
                                        <input type="text" placeholder="Ej. Juan Pérez"
                                            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400" />
                                    </div>
                                    <div class="flex flex-col gap-1.5">
                                        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Correo Electrónico</label>
                                        <input type="email" placeholder="juan@ejemplo.com"
                                            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400" />
                                    </div>
                                    <div class="flex flex-col gap-1.5 md:col-span-2">
                                        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Asunto</label>
                                        <input type="text" placeholder="¿En qué podemos ayudarte?"
                                            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400" />
                                    </div>
                                    <div class="flex flex-col gap-1.5 md:col-span-2">
                                        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mensaje</label>
                                        <textarea rows="5" placeholder="Cuéntanos más detalles..."
                                            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400 resize-none"></textarea>
                                    </div>
                                    <div class="md:col-span-2">
                                        <button type="submit"
                                            class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2">
                                            <i class="pi pi-send"></i>
                                            Enviar Mensaje
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer-widget />
        </div>
    `
})
export class Contacto {}
