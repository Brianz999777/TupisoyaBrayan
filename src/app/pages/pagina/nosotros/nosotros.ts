import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterWidget } from '../topbar/footerwidget';
import { TopbarWidget } from '../topbar/topbarwidget.component';

@Component({
    selector: 'app-nosotros',
    standalone: true,
    imports: [CommonModule, TopbarWidget, FooterWidget],
    template: `
        <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950">
            <topbar-widget />

            <!-- Hero -->
            <section class="relative pt-32 pb-20 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"></div>
                <div class="absolute top-1/3 -left-32 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-500/5 rounded-full blur-3xl"></div>
                <div class="relative z-10 max-w-[120rem] mx-auto px-8 lg:px-32 text-center">
                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-full text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6">
                        <i class="pi pi-info-circle text-xs"></i>
                        <span>Conócenos</span>
                    </div>
                    <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                        Transformamos la forma de
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">encontrar hogar</span>
                    </h1>
                    <p class="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        En TuPisoYa, no solo listamos propiedades; construimos puentes hacia tus sueños. Somos la plataforma líder que combina tecnología avanzada con un trato humano excepcional.
                    </p>
                </div>
            </section>

            <!-- Stats -->
            <section class="py-20 bg-gray-50 dark:bg-gray-900/50">
                <div class="max-w-[120rem] mx-auto px-8 lg:px-32">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all">
                            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-5">
                                <i class="pi pi-users text-2xl text-white"></i>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Comunidad</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Más de 50,000 usuarios confían mensualmente en nosotros para encontrar su próximo destino.</p>
                        </div>
                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all">
                            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-5">
                                <i class="pi pi-shield text-2xl text-white"></i>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Seguridad</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Verificamos cada anuncio para garantizar que tu experiencia sea 100% segura y libre de fraudes.</p>
                        </div>
                        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all">
                            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center mx-auto mb-5">
                                <i class="pi pi-bolt text-2xl text-white"></i>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Rapidez</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Nuestro buscador inteligente te ahorra horas de navegación, mostrándote solo lo que te importa.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Mission / Vision -->
            <section class="py-20">
                    <div class="max-w-[120rem] mx-auto px-8 lg:px-32">
                    <div class="flex flex-col md:flex-row items-center gap-16">
                        <div class="w-full md:w-1/2">
                            <div class="relative">
                                <div class="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl opacity-20 blur-xl"></div>
                                <img src="/demo/images/galleria/nuestravision.jpg" alt="Equipo" class="relative rounded-2xl shadow-xl w-full" />
                            </div>
                        </div>
                        <div class="w-full md:w-1/2 space-y-8">
                            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                                <div class="flex items-start gap-4">
                                    <div class="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 mt-2 flex-shrink-0"></div>
                                    <div>
                                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Nuestra Misión</h2>
                                        <p class="text-gray-500 dark:text-gray-400 leading-relaxed">Democratizar el acceso al mercado inmobiliario, eliminando las barreras burocráticas y haciendo que el proceso de alquiler o compra sea tan sencillo como pedir un café.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                                <div class="flex items-start gap-4">
                                    <div class="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mt-2 flex-shrink-0"></div>
                                    <div>
                                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Nuestra Visión</h2>
                                        <p class="text-gray-500 dark:text-gray-400 leading-relaxed">Ser el estándar global de transparencia en el sector inmobiliario, donde cada clic signifique una nueva oportunidad para empezar una vida mejor.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <app-footer-widget />
        </div>
    `
})
export class Nosotros {}
