import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterWidget } from '../topbar/footerwidget';
import { TopbarWidget } from '../topbar/topbarwidget.component';


@Component({
    selector: 'app-nosotros',
    standalone: true,
    imports: [CommonModule, TopbarWidget, FooterWidget],
    template: `
        <div class="min-h-screen flex flex-col bg-surface-0 dark:bg-surface-900">
            <topbar-widget class="py-6 px-6 lg:px-20 flex items-center justify-between relative lg:static" />
            <div class="flex-1">
                <!-- Hero Section -->
                <section class="nosotros-hero">
                    <div class="hero-glow"></div>
                    <div class="px-6 lg:px-20 text-center relative z-10">
                        <h1 class="hero-title">Transformamos la forma de <span class="text-[#1A262F]">encontrar hogar</span></h1>
                        <p class="hero-subtitle">En TuPisoYa, no solo listamos propiedades; construimos puentes hacia tus sueños. Somos la plataforma líder que combina tecnología avanzada con un trato humano excepcional.</p>
                    </div>
                </section>

                <!-- Stats / Why Us -->
                <section class="py-20 bg-[#f8fafc] dark:bg-surface-900">
                    <div class="px-6 lg:px-20">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div class="stat-card">
                                <div class="stat-icon" style="background: linear-gradient(135deg, #D4E157, #A3C92A);">
                                    <i class="pi pi-users text-3xl text-[#1A262F]"></i>
                                </div>
                                <h3 class="stat-title">Comunidad</h3>
                                <p class="stat-desc">Más de 50,000 usuarios confían mensualmente en nosotros para encontrar su próximo destino.</p>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                                    <i class="pi pi-shield text-3xl text-white"></i>
                                </div>
                                <h3 class="stat-title">Seguridad</h3>
                                <p class="stat-desc">Verificamos cada anuncio para garantizar que tu experiencia sea 100% segura y libre de fraudes.</p>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                                    <i class="pi pi-bolt text-3xl text-white"></i>
                                </div>
                                <h3 class="stat-title">Rapidez</h3>
                                <p class="stat-desc">Nuestro buscador inteligente te ahorra horas de navegación, mostrándote solo lo que te importa.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Mission/Vision -->
                <section class="py-20 bg-white dark:bg-surface-800">
                    <div class="px-6 lg:px-20">
                        <div class="flex flex-col md:flex-row items-center gap-16">
                            <div class="w-full md:w-1/2">
                                <div class="image-ring">
                                    <img src="/demo/images/galleria/galleria10.jpg" alt="Equipo" class="rounded-3xl shadow-2xl w-full" />
                                </div>
                            </div>
                            <div class="w-full md:w-1/2 space-y-10">
                                <div class="mission-card">
                                    <div class="mission-dot" style="background: linear-gradient(135deg, #D4E157, #A3C92A);"></div>
                                    <div>
                                        <h2 class="text-3xl font-black text-[#1A262F] dark:text-white mb-4">Nuestra Misión</h2>
                                        <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                            Democratizar el acceso al mercado inmobiliario, eliminando las barreras burocráticas y haciendo que el proceso de alquiler o compra sea tan sencillo como pedir un café.
                                        </p>
                                    </div>
                                </div>
                                <div class="mission-card">
                                    <div class="mission-dot" style="background: linear-gradient(135deg, #f59e0b, #d97706);"></div>
                                    <div>
                                        <h2 class="text-3xl font-black text-[#1A262F] dark:text-white mb-4">Nuestra Visión</h2>
                                        <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                            Ser el estándar global de transparencia en el sector inmobiliario, donde cada clic signifique una nueva oportunidad para empezar una vida mejor.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <footer-widget class="mt-auto" />
        </div>
    `,
    styles: [
        `
            .nosotros-hero {
                position: relative;
                background: linear-gradient(135deg, #d4e157 0%, #a3c92a 50%, #84b01e 100%);
                padding: 5rem 0;
                overflow: hidden;

                .hero-glow {
                    position: absolute;
                    top: -30%;
                    right: -10%;
                    width: 60%;
                    height: 100%;
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
                    filter: blur(100px);
                    pointer-events: none;
                }

                .hero-title {
                    font-size: 3.5rem;
                    font-weight: 900;
                    color: #1a262f;
                    margin-bottom: 1.5rem;
                    line-height: 1.1;
                }

                .hero-subtitle {
                    font-size: 1.25rem;
                    color: rgba(26, 38, 47, 0.75);
                    max-width: 48rem;
                    margin: 0 auto;
                    line-height: 1.7;
                    font-weight: 500;
                }
            }

            .stat-card {
                background: #fff;
                border-radius: 20px;
                padding: 2.5rem 2rem;
                text-align: center;
                box-shadow:
                    0 1px 3px rgba(0, 0, 0, 0.04),
                    0 4px 16px rgba(0, 0, 0, 0.04);
                border: 1px solid rgba(0, 0, 0, 0.04);
                transition: all 0.3s ease;

                &:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
                }

                .stat-icon {
                    width: 64px;
                    height: 64px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                }

                .stat-title {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #1a262f;
                    margin-bottom: 0.75rem;
                }

                .stat-desc {
                    color: #64748b;
                    line-height: 1.6;
                    font-size: 0.95rem;
                }
            }

            .image-ring {
                border-radius: 24px;
                padding: 6px;
                background: linear-gradient(135deg, #d4e157, #a3c92a);
                box-shadow: 0 8px 32px rgba(163, 201, 42, 0.2);

                img {
                    border-radius: 20px;
                }
            }

            .mission-card {
                display: flex;
                gap: 1.25rem;
                padding: 1.5rem;
                background: #f8fafc;
                border-radius: 16px;
                border: 1px solid rgba(0, 0, 0, 0.04);
                transition: all 0.3s ease;

                &:hover {
                    background: #fff;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
                }

                .mission-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    flex-shrink: 0;
                    margin-top: 0.5rem;
                }
            }

            @media (max-width: 768px) {
                .nosotros-hero .hero-title {
                    font-size: 2.2rem;
                }
            }

            :host-context(.dark) {
                .stat-card {
                    background: #1e293b;
                    border-color: rgba(255, 255, 255, 0.05);
                    .stat-title {
                        color: #f1f5f9;
                    }
                }
                .mission-card {
                    background: #1e293b;
                    border-color: rgba(255, 255, 255, 0.05);
                    &:hover {
                        background: #334155;
                    }
                }
            }
        `
    ]
})
export class Nosotros {}
