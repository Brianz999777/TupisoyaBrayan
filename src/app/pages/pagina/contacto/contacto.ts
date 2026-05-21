import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterWidget } from '../topbar/footerwidget';
import { TopbarWidget } from '../topbar/topbarwidget.component';

@Component({
    selector: 'app-contacto',
    standalone: true,
    imports: [CommonModule, TopbarWidget, FooterWidget],
    template: `
        <div class="min-h-screen flex flex-col bg-surface-0 dark:bg-surface-900">
            <topbar-widget class="py-6 px-6 lg:px-20 flex items-center justify-between relative lg:static" />
            <div class="flex-1">
                <!-- Hero Contact -->
                <section class="contacto-hero">
                    <div class="hero-glow"></div>
                    <div class="px-6 lg:px-20 text-center relative z-10">
                        <h1 class="hero-title">Estamos aquí para ayudarte</h1>
                        <p class="hero-subtitle">Resuelve tus dudas en minutos con nuestro equipo de expertos.</p>
                    </div>
                </section>

                <!-- Contact Grid -->
                <section class="py-20 bg-[#f8fafc] dark:bg-surface-900">
                    <div class="px-6 lg:px-20">
                        <div class="flex flex-col lg:flex-row gap-12">
                            <!-- Contact Info -->
                            <div class="w-full lg:w-1/3 space-y-8">
                                <div class="contact-info-card">
                                    <h3 class="text-2xl font-black text-[#1A262F] dark:text-white mb-8">Datos de Contacto</h3>
                                    <div class="space-y-6">
                                        <div class="contact-item">
                                            <div class="contact-icon" style="background: linear-gradient(135deg, #D4E157, #A3C92A);">
                                                <i class="pi pi-phone text-xl text-[#1A262F]"></i>
                                            </div>
                                            <div>
                                                <p class="text-sm text-gray-500 font-bold uppercase tracking-wider">Llámanos</p>
                                                <p class="text-xl font-black text-[#1A262F] dark:text-white">+34 900 123 456</p>
                                            </div>
                                        </div>
                                        <div class="contact-item">
                                            <div class="contact-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                                                <i class="pi pi-envelope text-xl text-white"></i>
                                            </div>
                                            <div>
                                                <p class="text-sm text-gray-500 font-bold uppercase tracking-wider">Email</p>
                                                <p class="text-xl font-black text-[#1A262F] dark:text-white">info@tupisoya.com</p>
                                            </div>
                                        </div>
                                        <div class="contact-item">
                                            <div class="contact-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                                                <i class="pi pi-map-marker text-xl text-white"></i>
                                            </div>
                                            <div>
                                                <p class="text-sm text-gray-500 font-bold uppercase tracking-wider">Ubicación</p>
                                                <p class="text-xl font-black text-[#1A262F] dark:text-white">Calle Principal 123, Madrid</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- CTA Propietario -->
                                <div class="cta-card">
                                    <div class="cta-glow"></div>
                                    <div class="relative z-10">
                                        <div class="cta-icon-circle">
                                            <i class="pi pi-home"></i>
                                        </div>
                                        <h4 class="text-2xl font-black text-[#1A262F] mb-3">¿Eres propietario?</h4>
                                        <p class="text-[#1A262F]/80 mb-8 font-medium">Publica tu inmueble gratis y empieza a recibir ofertas hoy mismo.</p>
                                        <button class="cta-btn">
                                            <i class="pi pi-plus-circle"></i>
                                            Publicar Anuncio
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Contact Form -->
                            <div class="w-full lg:w-2/3">
                                <div class="form-card">
                                    <h3 class="text-2xl font-black text-[#1A262F] dark:text-white mb-8">Envíanos un mensaje</h3>
                                    <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="form-group">
                                            <label class="form-label">Nombre Completo</label>
                                            <input type="text" placeholder="Ej. Juan Pérez" class="form-input" />
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">Correo Electrónico</label>
                                            <input type="email" placeholder="juan@ejemplo.com" class="form-input" />
                                        </div>
                                        <div class="form-group md:col-span-2">
                                            <label class="form-label">Asunto</label>
                                            <input type="text" placeholder="¿En qué podemos ayudarte?" class="form-input" />
                                        </div>
                                        <div class="form-group md:col-span-2">
                                            <label class="form-label">Mensaje</label>
                                            <textarea rows="5" placeholder="Cuéntanos más detalles..." class="form-input form-textarea"></textarea>
                                        </div>
                                        <div class="md:col-span-2">
                                            <button type="submit" class="submit-btn">
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
            </div>
            <footer-widget class="mt-auto" />
        </div>
    `,
    styles: [
        `
            .contacto-hero {
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
                    margin-bottom: 1rem;
                    line-height: 1.1;
                }

                .hero-subtitle {
                    font-size: 1.25rem;
                    color: rgba(26, 38, 47, 0.75);
                    max-width: 36rem;
                    margin: 0 auto;
                    font-weight: 500;
                }
            }

            .contact-info-card {
                background: #fff;
                border-radius: 20px;
                padding: 2rem;
                box-shadow:
                    0 1px 3px rgba(0, 0, 0, 0.04),
                    0 4px 16px rgba(0, 0, 0, 0.04);
                border: 1px solid rgba(0, 0, 0, 0.04);
            }

            .contact-item {
                display: flex;
                align-items: center;
                gap: 1rem;

                .contact-icon {
                    width: 52px;
                    height: 52px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
            }

            .cta-card {
                position: relative;
                background: linear-gradient(135deg, #d4e157 0%, #a3c92a 50%, #84b01e 100%);
                border-radius: 20px;
                padding: 2.5rem 2rem;
                text-align: center;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(163, 201, 42, 0.2);

                .cta-glow {
                    position: absolute;
                    top: -50%;
                    right: -30%;
                    width: 80%;
                    height: 100%;
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                }

                .cta-icon-circle {
                    width: 72px;
                    height: 72px;
                    background: rgba(255, 255, 255, 0.3);
                    backdrop-filter: blur(10px);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.25rem;
                    border: 2px solid rgba(255, 255, 255, 0.4);

                    i {
                        font-size: 2rem;
                        color: #1a262f;
                    }
                }

                .cta-btn {
                    background: #1a262f;
                    color: #d4e157;
                    border: none;
                    padding: 0.85rem 2.5rem;
                    font-size: 1rem;
                    font-weight: 800;
                    border-radius: 999px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    box-shadow: 0 4px 16px rgba(26, 38, 47, 0.2);
                    transition: all 0.3s ease;

                    &:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 24px rgba(26, 38, 47, 0.3);
                    }
                }
            }

            .form-card {
                background: #fff;
                border-radius: 20px;
                padding: 2.5rem;
                box-shadow:
                    0 1px 3px rgba(0, 0, 0, 0.04),
                    0 4px 16px rgba(0, 0, 0, 0.04);
                border: 1px solid rgba(0, 0, 0, 0.04);
            }

            .form-group {
                display: flex;
                flex-direction: column;
                gap: 0.4rem;

                .form-label {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #1e293b;
                }

                .form-input {
                    padding: 0.9rem 1.25rem;
                    background: #f8fafc;
                    border: 2px solid transparent;
                    border-radius: 12px;
                    outline: none;
                    font-size: 0.95rem;
                    color: #1e293b;
                    transition: all 0.3s ease;

                    &:focus {
                        border-color: #d4e157;
                        background: #fff;
                        box-shadow: 0 0 0 4px rgba(212, 225, 87, 0.1);
                    }

                    &::placeholder {
                        color: #94a3b8;
                    }
                }

                .form-textarea {
                    resize: none;
                    min-height: 140px;
                }
            }

            .submit-btn {
                width: 100%;
                padding: 1rem;
                background: linear-gradient(135deg, #1a262f, #2d3e4b);
                color: #d4e157;
                font-weight: 800;
                font-size: 1.05rem;
                border: none;
                border-radius: 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                box-shadow: 0 4px 16px rgba(26, 38, 47, 0.15);

                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(26, 38, 47, 0.25);
                }

                &:active {
                    transform: translateY(0);
                }
            }

            @media (max-width: 768px) {
                .contacto-hero .hero-title {
                    font-size: 2.2rem;
                }
                .form-card {
                    padding: 1.5rem;
                }
            }

            :host-context(.dark) {
                .contact-info-card {
                    background: #1e293b;
                    border-color: rgba(255, 255, 255, 0.05);
                }
                .form-card {
                    background: #1e293b;
                    border-color: rgba(255, 255, 255, 0.05);
                }
                .form-group .form-input {
                    background: #0f172a;
                    color: #e2e8f0;
                    &:focus {
                        background: #1e293b;
                    }
                }
            }
        `
    ]
})
export class Contacto {}
