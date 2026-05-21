import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterWidget } from '../topbar/footerwidget';
import { TopbarWidget } from '../topbar/topbarwidget.component';


@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, TopbarWidget, FooterWidget],
  template: `
    <div class="min-h-screen flex flex-col bg-surface-0 dark:bg-surface-900">
        <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
        <div class="flex-1">
            <!-- Hero Services -->
            <section class="servicios-hero">
                <div class="hero-glow"></div>
                <div class="container mx-auto px-6 text-center relative z-10">
                    <h1 class="hero-title">
                        Soluciones Inmobiliarias <span class="text-[#1A262F]">Integrales</span>
                    </h1>
                    <p class="hero-subtitle">Todo lo que necesitas para tu propiedad, en un solo lugar.</p>
                </div>
            </section>

            <!-- Services Grid -->
            <section class="py-20 bg-[#f8fafc] dark:bg-surface-900">
                <div class="container mx-auto px-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <!-- Compra -->
                        <div class="service-card">
                            <div class="service-icon" style="background: linear-gradient(135deg, #D4E157, #A3C92A);">
                                <i class="pi pi-shopping-cart text-3xl text-[#1A262F]"></i>
                            </div>
                            <h3 class="service-title">Compra Directa</h3>
                            <p class="service-desc">
                                Te acompañamos en todo el proceso de búsqueda, negociación y cierre para que consigas el mejor precio por tu nuevo hogar.
                            </p>
                            <button class="service-btn">Saber más <i class="pi pi-arrow-right"></i></button>
                        </div>

                        <!-- Venta -->
                        <div class="service-card">
                            <div class="service-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                                <i class="pi pi-tag text-3xl text-white"></i>
                            </div>
                            <h3 class="service-title">Venta Premium</h3>
                            <p class="service-desc">
                                Utilizamos inteligencia artificial y marketing digital de vanguardia para vender tu propiedad en tiempo récord.
                            </p>
                            <button class="service-btn">Saber más <i class="pi pi-arrow-right"></i></button>
                        </div>

                        <!-- Alquiler -->
                        <div class="service-card">
                            <div class="service-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                                <i class="pi pi-key text-3xl text-white"></i>
                            </div>
                            <h3 class="service-title">Gestión de Alquiler</h3>
                            <p class="service-desc">
                                Filtramos a los inquilinos y gestionamos los contratos para que tú solo te preocupes de recibir tu renta cada mes.
                            </p>
                            <button class="service-btn">Saber más <i class="pi pi-arrow-right"></i></button>
                        </div>

                        <!-- Valoración -->
                        <div class="service-card">
                            <div class="service-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                                <i class="pi pi-chart-line text-3xl text-white"></i>
                            </div>
                            <h3 class="service-title">Tasación Gratuita</h3>
                            <p class="service-desc">
                                Obtén un informe detallado del valor de mercado de tu propiedad basado en datos reales y actualizados.
                            </p>
                            <button class="service-btn">Saber más <i class="pi pi-arrow-right"></i></button>
                        </div>

                        <!-- Asesoría Legal -->
                        <div class="service-card">
                            <div class="service-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                                <i class="pi pi-briefcase text-3xl text-white"></i>
                            </div>
                            <h3 class="service-title">Asesoría Legal</h3>
                            <p class="service-desc">
                                Expertos en derecho inmobiliario para resolver cualquier duda sobre contratos, herencias o trámites hipotecarios.
                            </p>
                            <button class="service-btn">Saber más <i class="pi pi-arrow-right"></i></button>
                        </div>

                        <!-- Inversión -->
                        <div class="service-card">
                            <div class="service-icon" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">
                                <i class="pi pi-money-bill text-3xl text-white"></i>
                            </div>
                            <h3 class="service-title">Oportunidades de Inversión</h3>
                            <p class="service-desc">
                                Accede a propiedades exclusivas con alta rentabilidad antes de que salgan al mercado público.
                            </p>
                            <button class="service-btn">Saber más <i class="pi pi-arrow-right"></i></button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <footer-widget class="mt-auto" />
    </div>
  `,
  styles: [`
    .servicios-hero {
        position: relative;
        background: linear-gradient(135deg, #D4E157 0%, #A3C92A 50%, #84B01E 100%);
        padding: 5rem 0;
        overflow: hidden;

        .hero-glow {
            position: absolute;
            top: -30%;
            right: -10%;
            width: 60%;
            height: 100%;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            filter: blur(100px);
            pointer-events: none;
        }

        .hero-title {
            font-size: 3.5rem;
            font-weight: 900;
            color: #1A262F;
            margin-bottom: 1rem;
            line-height: 1.1;
        }

        .hero-subtitle {
            font-size: 1.25rem;
            color: rgba(26,38,47,0.75);
            max-width: 36rem;
            margin: 0 auto;
            font-weight: 500;
        }
    }

    .service-card {
        background: #fff;
        border-radius: 20px;
        padding: 2.5rem 2rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
        border: 1px solid rgba(0,0,0,0.04);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;

        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.08);
        }

        .service-icon {
            width: 64px;
            height: 64px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
            transition: transform 0.3s ease;
        }

        &:hover .service-icon {
            transform: rotate(-8deg) scale(1.05);
        }

        .service-title {
            font-size: 1.4rem;
            font-weight: 800;
            color: #1A262F;
            margin-bottom: 0.75rem;
        }

        .service-desc {
            color: #64748b;
            line-height: 1.7;
            font-size: 0.95rem;
            flex: 1;
            margin-bottom: 1.5rem;
        }

        .service-btn {
            background: transparent;
            border: none;
            color: #1A262F;
            font-weight: 700;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0;
            cursor: pointer;
            transition: all 0.3s ease;

            i {
                transition: transform 0.3s ease;
            }

            &:hover {
                color: #A3C92A;
                gap: 0.75rem;
                i { transform: translateX(3px); }
            }
        }
    }

    @media (max-width: 768px) {
        .servicios-hero .hero-title {
            font-size: 2.2rem;
        }
    }

    :host-context(.dark) {
        .service-card {
            background: #1e293b;
            border-color: rgba(255,255,255,0.05);
            .service-title { color: #f1f5f9; }
        }
    }
  `]
})
export class Servicios {}
