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
        <div class="min-h-screen flex flex-col bg-surface-0 dark:bg-surface-900">
            <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
            <div class="flex-1">
                <!-- Hero -->
                <section class="publicar-hero">
                    <div class="hero-glow"></div>
                    <div class="container mx-auto px-6 text-center relative z-10">
                        <h1 class="hero-title">Publica tu <span class="text-[#1A262F]">inmueble</span></h1>
                        <p class="hero-subtitle">Completa los datos y llega a miles de interesados en minutos.</p>
                    </div>
                </section>

                <!-- Progress Bar -->
                <div class="max-w-4xl mx-auto px-6 -mt-6 relative z-20">
                    <div class="progress-bar-container">
                        <div class="progress-steps">
                            @for (step of steps; track step.num; let i = $index) {
                                <div class="progress-step" [class.active]="step.num <= pasoActual" [class.current]="step.num === pasoActual">
                                    <div class="step-circle">
                                        @if (step.num < pasoActual) {
                                            <i class="pi pi-check"></i>
                                        } @else {
                                            <span>{{ step.num }}</span>
                                        }
                                    </div>
                                    <span class="step-label">{{ step.label }}</span>
                                </div>
                            }
                        </div>
                        <div class="progress-track">
                            <div class="progress-fill" [style.width.%]="(pasoActual / steps.length) * 100"></div>
                        </div>
                    </div>
                </div>

                <!-- Formulario -->
                <section class="py-12 bg-[#f8fafc] dark:bg-surface-900">
                    <div class="max-w-4xl mx-auto px-6">
                        <div class="form-card">
                            @if (loading) {
                                <div class="flex flex-col items-center justify-center py-20">
                                    <p-progressSpinner styleClass="w-16 h-16" strokeWidth="4" fill="var(--surface-ground)" animationDuration=".8s"></p-progressSpinner>
                                    <p class="mt-6 text-lg font-bold text-[#1A262F] dark:text-white">Publicando anuncio...</p>
                                    <p class="text-sm text-gray-500">Esto puede tomar unos segundos</p>
                                </div>
                            } @else {
                                <!-- PASO 1 -->
                                @if (pasoActual === 1) {
                                    <div class="step-content">
                                        <div class="step-header">
                                            <h2 class="step-title">¿Qué tipo de operación?</h2>
                                            <p class="step-desc">Selecciona si quieres vender o alquilar tu inmueble.</p>
                                        </div>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                            <button class="tipo-card" [class.selected]="formData.type === 'venta'" (click)="formData.type = 'venta'">
                                                <div class="tipo-icon" style="background: linear-gradient(135deg, #D4E157, #A3C92A);">
                                                    <i class="pi pi-tag text-3xl text-[#1A262F]"></i>
                                                </div>
                                                <h3 class="tipo-title">Venta</h3>
                                                <p class="tipo-desc">Vende tu propiedad al mejor precio del mercado.</p>
                                                <div class="tipo-check">
                                                    @if (formData.type === 'venta') {
                                                        <i class="pi pi-check-circle text-2xl text-[#A3C92A]"></i>
                                                    } @else {
                                                        <i class="pi pi-circle text-2xl text-gray-300"></i>
                                                    }
                                                </div>
                                            </button>
                                            <button class="tipo-card" [class.selected]="formData.type === 'alquiler'" (click)="formData.type = 'alquiler'">
                                                <div class="tipo-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                                                    <i class="pi pi-key text-3xl text-white"></i>
                                                </div>
                                                <h3 class="tipo-title">Alquiler</h3>
                                                <p class="tipo-desc">Alquila tu propiedad y genera ingresos mensuales.</p>
                                                <div class="tipo-check">
                                                    @if (formData.type === 'alquiler') {
                                                        <i class="pi pi-check-circle text-2xl text-[#f59e0b]"></i>
                                                    } @else {
                                                        <i class="pi pi-circle text-2xl text-gray-300"></i>
                                                    }
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                }

                                <!-- PASO 2 -->
                                @if (pasoActual === 2) {
                                    <div class="step-content">
                                        <div class="step-header">
                                            <h2 class="step-title">Dirección y datos generales</h2>
                                            <p class="step-desc">Información básica de tu inmueble.</p>
                                        </div>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                            <div class="form-group">
                                                <label class="form-label">Tipo de vía *</label>
                                                <select [(ngModel)]="formData.tipo_via_prop" class="form-input">
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
                                            <div class="form-group">
                                                <label class="form-label">Dirección *</label>
                                                <input type="text" [(ngModel)]="formData.direccion_prop" placeholder="Ej: Mayor, del Sol..." class="form-input" />
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Número *</label>
                                                <input type="number" [(ngModel)]="formData.numero_prop" placeholder="Ej: 5" class="form-input" />
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Planta</label>
                                                <input type="number" [(ngModel)]="formData.planta_prop" placeholder="Ej: 3" class="form-input" />
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Puerta</label>
                                                <input type="text" [(ngModel)]="formData.puerta_prop" placeholder="Ej: Derecha, A..." class="form-input" />
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Código Postal *</label>
                                                <input type="text" [(ngModel)]="formData.cp_prop" placeholder="Ej: 46002" class="form-input" />
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Provincia *</label>
                                                <input type="text" [(ngModel)]="formData.provincia_prop" placeholder="Ej: Valencia" class="form-input" />
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Nº Catastral *</label>
                                                <input type="text" [(ngModel)]="formData.nro_catastral_prop" placeholder="Ej: VENTA99998888" class="form-input" />
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Metros cuadrados *</label>
                                                <input type="number" step="0.1" [(ngModel)]="formData.metros_prop" placeholder="Ej: 110" class="form-input" />
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Año construcción *</label>
                                                <input type="number" [(ngModel)]="formData.anyo_construccion_prop" (input)="onAnyoChange()" placeholder="Ej: 1980" class="form-input" />
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Antigüedad</label>
                                                <input type="text" [(ngModel)]="formData.antiguedad_prop" placeholder="Se calcula automáticamente" class="form-input" readonly />
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Nº Habitaciones *</label>
                                                <input type="number" [(ngModel)]="formData.nro_habitaciones" placeholder="Ej: 3" class="form-input" />
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Nº Baños *</label>
                                                <input type="number" [(ngModel)]="formData.nro_banos" placeholder="Ej: 2" class="form-input" />
                                            </div>
                                        </div>
                                    </div>
                                }

                                <!-- PASO 3 -->
                                @if (pasoActual === 3) {
                                    <div class="step-content">
                                        <div class="step-header">
                                            <h2 class="step-title">Características</h2>
                                            <p class="step-desc">Selecciona los extras y servicios de tu inmueble.</p>
                                        </div>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                            @for (extra of extrasList; track extra.key) {
                                                <label class="extra-item" [class.selected]="extrasValues[extra.key]">
                                                    <div class="extra-check">
                                                        <input type="checkbox" [checked]="extrasValues[extra.key]" (change)="toggleExtra(extra.key)" class="hidden" />
                                                        <div class="custom-checkbox" [class.checked]="extrasValues[extra.key]">
                                                            @if (extrasValues[extra.key]) {
                                                                <i class="pi pi-check text-white text-xs"></i>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div class="extra-icon" [style.background]="extra.color">
                                                        <i [class]="extra.icon" [style.color]="extra.iconColor"></i>
                                                    </div>
                                                    <span class="extra-label">{{ extra.label }}</span>
                                                </label>
                                            }
                                        </div>

                                        @if (formData.type === 'venta') {
                                            <div class="mt-8 p-6 bg-gray-50 dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-surface-700">
                                                <h4 class="font-black text-lg text-[#1A262F] dark:text-white mb-4">Detalles de venta</h4>
                                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div class="form-group">
                                                        <label class="form-label">Clase energética *</label>
                                                        <select [(ngModel)]="formData.clase_energetica_venta" class="form-input">
                                                            <option value="">Seleccionar...</option>
                                                            <option value="A">A - Máxima eficiencia</option>
                                                            <option value="B">B</option>
                                                            <option value="C">C</option>
                                                            <option value="D">D</option>
                                                            <option value="E">E</option>
                                                            <option value="F">F</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="form-label">Precio de venta (€) *</label>
                                                        <input type="number" step="0.01" [(ngModel)]="formData.precio_venta" placeholder="Ej: 185000" class="form-input" />
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        @if (formData.type === 'alquiler') {
                                            <div class="mt-8 p-6 bg-gray-50 dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-surface-700">
                                                <h4 class="font-black text-lg text-[#1A262F] dark:text-white mb-4">Detalles de alquiler</h4>
                                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div class="form-group">
                                                        <label class="form-label">Precio mensual (€) *</label>
                                                        <input type="number" step="0.01" [(ngModel)]="formData.precio_alquiler" placeholder="Ej: 850" class="form-input" />
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="form-label">Fianza (€)</label>
                                                        <input type="number" step="0.01" [(ngModel)]="formData.fianza_alquiler" placeholder="Ej: 1700" class="form-input" />
                                                    </div>
                                                    <div class="form-group">
                                                        <label class="form-label">Nº máximo personas</label>
                                                        <input type="number" [(ngModel)]="formData.nro_personas_alquiler" placeholder="Ej: 4" class="form-input" />
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }

                                <!-- PASO 4: Fotos -->
                                @if (pasoActual === 4) {
                                    <div class="step-content">
                                        <div class="step-header">
                                            <h2 class="step-title">Fotos del inmueble</h2>
                                            <p class="step-desc">Añade fotos de tu propiedad. <strong>La primera foto será la principal</strong>. Máximo 10 fotos.</p>
                                        </div>
                                        <div class="mt-8">
                                            @if (fotosPreview.length < 10) {
                                                <div class="dropzone" (dragover)="$event.preventDefault()" (drop)="onDrop($event)" (click)="fileInput.click()">
                                                    <input #fileInput type="file" multiple accept="image/*" (change)="onFilesSelected($event)" class="hidden" />
                                                    <div class="dropzone-icon">
                                                        <i class="pi pi-cloud-upload text-5xl text-[#D4E157]"></i>
                                                    </div>
                                                    <p class="dropzone-text">Arrastra tus fotos aquí o <span class="text-[#A3C92A] font-bold">haz clic para seleccionar</span></p>
                                                    <p class="dropzone-hint">Formatos: JPG, PNG, WEBP • Máx 10MB cada una • Máx 10 fotos</p>
                                                </div>
                                            }

                                            @if (fotosPreview.length > 0) {
                                                <div class="mt-8">
                                                    <div class="flex items-center justify-between mb-4">
                                                        <h4 class="font-black text-lg text-[#1A262F] dark:text-white">Fotos ({{ fotosPreview.length }}/10)</h4>
                                                        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-surface-700 px-3 py-1.5 rounded-lg">La primera es la principal</span>
                                                    </div>
                                                    <div class="fotos-grid">
                                                        @for (foto of fotosPreview; track foto.id; let i = $index) {
                                                            <div class="foto-item" [class.principal]="i === 0">
                                                                @if (i === 0) {
                                                                    <div class="foto-badge">PRINCIPAL</div>
                                                                }
                                                                <img [src]="foto.url" [alt]="'Foto ' + (i + 1)" class="foto-img" />
                                                                <button class="foto-delete" (click)="eliminarFoto(i)">
                                                                    <i class="pi pi-times"></i>
                                                                </button>
                                                                @if (i > 0) {
                                                                    <button class="foto-move-up" (click)="moverArriba(i)" title="Mover como principal">
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
                                    <div class="step-content">
                                        <div class="step-header">
                                            <h2 class="step-title">Descripción y confirmar</h2>
                                            <p class="step-desc">Cuéntale a los interesados por qué tu propiedad es especial.</p>
                                        </div>
                                        <div class="mt-8 space-y-6">
                                            <div class="form-group">
                                                <label class="form-label">Descripción *</label>
                                                <textarea [(ngModel)]="formData.descripcion" rows="6" placeholder="Describe tu inmueble: distribución, orientación, zonas cercanas, transporte, colegios..." class="form-input form-textarea"></textarea>
                                                <p class="text-xs text-gray-400 mt-1 font-medium">{{ (formData.descripcion || '').length }} / 3000 caracteres</p>
                                            </div>

                                            <div class="resumen-card">
                                                <h4 class="font-black text-lg text-[#1A262F] dark:text-white mb-4">Resumen del anuncio</h4>
                                                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    <div class="resumen-item">
                                                        <span class="resumen-label">Operación</span>
                                                        <span class="resumen-value">{{ formData.type === 'venta' ? 'Venta' : 'Alquiler' }}</span>
                                                    </div>
                                                    <div class="resumen-item">
                                                        <span class="resumen-label">Dirección</span>
                                                        <span class="resumen-value">{{ formData.tipo_via_prop }} {{ formData.direccion_prop }}, {{ formData.numero_prop }}</span>
                                                    </div>
                                                    <div class="resumen-item">
                                                        <span class="resumen-label">Precio</span>
                                                        <span class="resumen-value">{{ (formData.type === 'venta' ? formData.precio_venta : formData.precio_alquiler) | number: '1.0-0' }} €</span>
                                                    </div>
                                                    <div class="resumen-item">
                                                        <span class="resumen-label">Habitaciones</span>
                                                        <span class="resumen-value">{{ formData.nro_habitaciones }}</span>
                                                    </div>
                                                    <div class="resumen-item">
                                                        <span class="resumen-label">Baños</span>
                                                        <span class="resumen-value">{{ formData.nro_banos }}</span>
                                                    </div>
                                                    <div class="resumen-item">
                                                        <span class="resumen-label">Metros</span>
                                                        <span class="resumen-value">{{ formData.metros_prop }} m²</span>
                                                    </div>
                                                    <div class="resumen-item">
                                                        <span class="resumen-label">Fotos</span>
                                                        <span class="resumen-value">{{ fotosPreview.length }}</span>
                                                    </div>
                                                    <div class="resumen-item">
                                                        <span class="resumen-label">Provincia</span>
                                                        <span class="resumen-value">{{ formData.provincia_prop }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                <!-- Navegación -->
                                <div class="nav-buttons">
                                    @if (pasoActual > 1) {
                                        <button class="btn-secondary" (click)="pasoAnterior()">
                                            <i class="pi pi-arrow-left"></i>
                                            Anterior
                                        </button>
                                    } @else {
                                        <div></div>
                                    }

                                    @if (pasoActual < steps.length) {
                                        <button class="btn-primary" (click)="pasoSiguiente()" [disabled]="!pasoValido()">
                                            Siguiente
                                            <i class="pi pi-arrow-right"></i>
                                        </button>
                                    } @else {
                                        <button class="btn-primary btn-submit" (click)="publicar()">
                                            <i class="pi pi-check-circle"></i>
                                            Publicar anuncio
                                        </button>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </section>
            </div>
            <footer-widget class="mt-auto" />
        </div>
        <p-toast position="top-center"></p-toast>
    `,
    styles: [
        `
            .publicar-hero {
                position: relative;
                background: linear-gradient(135deg, #d4e157 0%, #a3c92a 50%, #84b01e 100%);
                padding: 5rem 0 7rem;
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

            .progress-bar-container {
                background: #fff;
                border-radius: 20px;
                padding: 2rem 2.5rem;
                box-shadow:
                    0 1px 3px rgba(0, 0, 0, 0.04),
                    0 4px 16px rgba(0, 0, 0, 0.04);
                border: 1px solid rgba(0, 0, 0, 0.04);
            }

            .progress-steps {
                display: flex;
                justify-content: space-between;
                margin-bottom: 1rem;
                position: relative;
            }

            .progress-step {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                z-index: 2;
                .step-circle {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #e2e8f0;
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                }
                .step-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    transition: all 0.3s ease;
                    text-align: center;
                }
                &.active {
                    .step-circle {
                        background: linear-gradient(135deg, #d4e157, #a3c92a);
                        color: #1a262f;
                        box-shadow: 0 4px 12px rgba(163, 201, 42, 0.3);
                    }
                    .step-label {
                        color: #1a262f;
                    }
                }
                &.current {
                    .step-circle {
                        transform: scale(1.1);
                        box-shadow: 0 4px 16px rgba(163, 201, 42, 0.4);
                    }
                }
            }

            .progress-track {
                height: 4px;
                background: #e2e8f0;
                border-radius: 2px;
                overflow: hidden;
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(135deg, #d4e157, #a3c92a);
                    border-radius: 2px;
                    transition: width 0.5s ease;
                }
            }

            .form-card {
                background: #fff;
                border-radius: 24px;
                padding: 2.5rem;
                box-shadow:
                    0 1px 3px rgba(0, 0, 0, 0.04),
                    0 4px 16px rgba(0, 0, 0, 0.04);
                border: 1px solid rgba(0, 0, 0, 0.04);
            }

            .step-header {
                text-align: center;
                padding-bottom: 1.5rem;
                border-bottom: 2px solid #f1f5f9;
                .step-title {
                    font-size: 2rem;
                    font-weight: 900;
                    color: #1a262f;
                    margin-bottom: 0.5rem;
                }
                .step-desc {
                    color: #64748b;
                    font-weight: 500;
                }
            }

            .tipo-card {
                background: #f8fafc;
                border: 2px solid transparent;
                border-radius: 20px;
                padding: 2rem;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                &:hover {
                    border-color: #d4e157;
                    background: #fff;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
                }
                &.selected {
                    border-color: #d4e157;
                    background: #fff;
                    box-shadow: 0 4px 20px rgba(212, 225, 87, 0.15);
                }
                .tipo-icon {
                    width: 72px;
                    height: 72px;
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                }
                .tipo-title {
                    font-size: 1.3rem;
                    font-weight: 800;
                    color: #1a262f;
                    margin-bottom: 0.5rem;
                }
                .tipo-desc {
                    color: #64748b;
                    font-size: 0.9rem;
                    line-height: 1.5;
                }
                .tipo-check {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                }
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
                    padding: 0.85rem 1.25rem;
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
                    &[readonly] {
                        opacity: 0.6;
                        cursor: not-allowed;
                    }
                }
                .form-textarea {
                    resize: vertical;
                    min-height: 140px;
                }
                select.form-input {
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 1rem center;
                    padding-right: 2.5rem;
                }
            }

            .extra-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem 1.25rem;
                background: #f8fafc;
                border: 2px solid transparent;
                border-radius: 14px;
                cursor: pointer;
                transition: all 0.3s ease;
                &:hover {
                    border-color: #e2e8f0;
                    background: #fff;
                }
                &.selected {
                    border-color: #d4e157;
                    background: #fafce8;
                }
                .extra-check {
                    .custom-checkbox {
                        width: 22px;
                        height: 22px;
                        border: 2px solid #cbd5e1;
                        border-radius: 6px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.2s ease;
                        &.checked {
                            background: #a3c92a;
                            border-color: #a3c92a;
                        }
                    }
                }
                .extra-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    i {
                        font-size: 1.1rem;
                    }
                }
                .extra-label {
                    font-weight: 700;
                    color: #1e293b;
                    font-size: 0.95rem;
                }
            }

            .uploading-overlay {
                text-align: center;
                padding: 3rem 2rem;
                background: #f8fafc;
                border-radius: 20px;
                border: 2px dashed #d4e157;
                .uploading-text {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1a262f;
                    margin-top: 1rem;
                    margin-bottom: 1.5rem;
                }
                .uploading-bar-track {
                    width: 100%;
                    max-width: 300px;
                    height: 6px;
                    background: #e2e8f0;
                    border-radius: 3px;
                    margin: 0 auto 0.75rem;
                    overflow: hidden;
                }
                .uploading-bar-fill {
                    height: 100%;
                    background: linear-gradient(135deg, #d4e157, #a3c92a);
                    border-radius: 3px;
                    transition: width 0.3s ease;
                }
                .uploading-count {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #64748b;
                }
            }

            .dropzone {
                border: 2px dashed #cbd5e1;
                border-radius: 20px;
                padding: 3rem 2rem;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: #f8fafc;
                &:hover {
                    border-color: #d4e157;
                    background: #fafce8;
                }
                .dropzone-icon {
                    margin-bottom: 1rem;
                }
                .dropzone-text {
                    font-size: 1.1rem;
                    color: #475569;
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                }
                .dropzone-hint {
                    font-size: 0.85rem;
                    color: #94a3b8;
                }
            }

            .fotos-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                gap: 1rem;
            }

            .foto-item {
                position: relative;
                border-radius: 14px;
                overflow: hidden;
                aspect-ratio: 4/3;
                border: 2px solid transparent;
                transition: all 0.3s ease;
                &.principal {
                    border-color: #d4e157;
                    box-shadow: 0 0 0 3px rgba(212, 225, 87, 0.3);
                }
                .foto-badge {
                    position: absolute;
                    top: 0.5rem;
                    left: 0.5rem;
                    background: linear-gradient(135deg, #d4e157, #a3c92a);
                    color: #1a262f;
                    font-size: 0.65rem;
                    font-weight: 800;
                    padding: 0.25rem 0.6rem;
                    border-radius: 6px;
                    z-index: 2;
                    letter-spacing: 0.05em;
                }
                .foto-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .foto-delete {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    width: 28px;
                    height: 28px;
                    background: rgba(239, 68, 68, 0.9);
                    color: #fff;
                    border: none;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    opacity: 0;
                    transition: all 0.2s ease;
                    z-index: 2;
                    font-size: 0.75rem;
                }
                .foto-move-up {
                    position: absolute;
                    bottom: 0.5rem;
                    right: 0.5rem;
                    width: 28px;
                    height: 28px;
                    background: rgba(26, 38, 47, 0.8);
                    color: #d4e157;
                    border: none;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    opacity: 0;
                    transition: all 0.2s ease;
                    z-index: 2;
                    font-size: 0.75rem;
                }
                &:hover {
                    .foto-delete,
                    .foto-move-up {
                        opacity: 1;
                    }
                }
            }

            .resumen-card {
                background: #f8fafc;
                border-radius: 16px;
                padding: 1.5rem;
                border: 1px solid #e2e8f0;
            }

            .resumen-item {
                display: flex;
                flex-direction: column;
                gap: 0.15rem;
                .resumen-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .resumen-value {
                    font-size: 1rem;
                    font-weight: 800;
                    color: #1a262f;
                }
            }

            .nav-buttons {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 2.5rem;
                padding-top: 2rem;
                border-top: 2px solid #f1f5f9;
            }

            .btn-primary {
                padding: 1rem 2.5rem;
                background: linear-gradient(135deg, #1a262f, #2d3e4b);
                color: #d4e157;
                font-weight: 800;
                font-size: 1rem;
                border: none;
                border-radius: 14px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                box-shadow: 0 4px 16px rgba(26, 38, 47, 0.15);
                &:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(26, 38, 47, 0.25);
                }
                &:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }
                &.btn-submit {
                    background: linear-gradient(135deg, #d4e157, #a3c92a);
                    color: #1a262f;
                    box-shadow: 0 4px 16px rgba(163, 201, 42, 0.3);
                    &:hover {
                        box-shadow: 0 8px 24px rgba(163, 201, 42, 0.4);
                    }
                }
            }

            .btn-secondary {
                padding: 1rem 2.5rem;
                background: #f1f5f9;
                color: #475569;
                font-weight: 800;
                font-size: 1rem;
                border: none;
                border-radius: 14px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                &:hover {
                    background: #e2e8f0;
                    color: #1a262f;
                }
            }

            @media (max-width: 768px) {
                .publicar-hero .hero-title {
                    font-size: 2.2rem;
                }
                .form-card {
                    padding: 1.5rem;
                }
                .progress-bar-container {
                    padding: 1.25rem;
                }
                .progress-step .step-label {
                    font-size: 0.6rem;
                }
            }

            :host-context(.dark) {
                .form-card {
                    background: #1e293b;
                    border-color: rgba(255, 255, 255, 0.05);
                }
                .progress-bar-container {
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
                .tipo-card {
                    background: #1e293b;
                    &.selected {
                        background: #0f172a;
                    }
                    .tipo-title {
                        color: #f1f5f9;
                    }
                }
                .extra-item {
                    background: #1e293b;
                    &.selected {
                        background: #1a2e1a;
                    }
                    .extra-label {
                        color: #e2e8f0;
                    }
                }
                .resumen-card {
                    background: #1e293b;
                    border-color: rgba(255, 255, 255, 0.05);
                    .resumen-value {
                        color: #f1f5f9;
                    }
                }
                .dropzone {
                    background: #1e293b;
                    &:hover {
                        background: #0f172a;
                    }
                }
                .btn-secondary {
                    background: #334155;
                    color: #94a3b8;
                    &:hover {
                        background: #475569;
                        color: #f1f5f9;
                    }
                }
            }
        `
    ]
})
export class PublicarAnuncio implements OnInit {
    private router = inject(Router);
    private messageService = inject(MessageService);
    private authService = inject(Auth);
    private inmuebleService = inject(InmuebleService);
    private ngZone = inject(NgZone);

    pasoActual = 1;
    loading = false;

    steps = [
        { num: 1, label: 'Operación' },
        { num: 2, label: 'Datos' },
        { num: 3, label: 'Características' },
        { num: 4, label: 'Fotos' },
        { num: 5, label: 'Confirmar' }
    ];

    formData: any = {
        type: '',
        nro_doc_dueno: '',
        tipo_via_prop: '',
        direccion_prop: '',
        numero_prop: null,
        planta_prop: null,
        puerta_prop: '',
        cp_prop: '',
        provincia_prop: '',
        nro_catastral_prop: '',
        nro_banos: null,
        ascensor_prop: false,
        metros_prop: null,
        anyo_construccion_prop: null,
        antiguedad_prop: '',
        fecha_publicacion_prop: '',
        precio_venta: null,
        nro_habitaciones: null,
        balcon_venta: false,
        clase_energetica_venta: '',
        amueblada_venta: false,
        garage_venta: false,
        aire_acondicionado_venta: false,
        libre_cargas_venta: false,
        negociable_venta: false,
        reforma_venta: false,
        descripcion_venta: '',
        precio_alquiler: null,
        fianza_alquiler: null,
        nro_personas_alquiler: null,
        exterior_alquiler: false,
        permite_mascotas_alquiler: false,
        permite_parejas_alquiler: false,
        wifi_alquiler: false,
        permitevisitas_alquiler: false,
        descripcion_alquiler: '',
        fotos_urls: [] as string[]
    };

    extrasList: ExtraItem[] = [
        { key: 'ascensor', label: 'Ascensor', icon: 'pi pi-arrow-up', color: 'linear-gradient(135deg, #D4E157, #A3C92A)', iconColor: '#1A262F', ventaField: 'ascensor_prop', alquilerField: 'ascensor_prop' },
        { key: 'garaje', label: 'Garaje', icon: 'pi pi-car', color: 'linear-gradient(135deg, #f59e0b, #d97706)', iconColor: '#fff', ventaField: 'garage_venta' },
        { key: 'terraza', label: 'Terraza', icon: 'pi pi-sun', color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', iconColor: '#fff' },
        { key: 'piscina', label: 'Piscina', icon: 'pi pi-water', color: 'linear-gradient(135deg, #06b6d4, #0891b2)', iconColor: '#fff' },
        { key: 'jardin', label: 'Jardín', icon: 'pi pi-leaf', color: 'linear-gradient(135deg, #10b981, #059669)', iconColor: '#fff' },
        { key: 'amueblado', label: 'Amueblado', icon: 'pi pi-couch', color: 'linear-gradient(135deg, #ec4899, #db2777)', iconColor: '#fff', ventaField: 'amueblada_venta' },
        { key: 'calefaccion', label: 'Calefacción', icon: 'pi pi-fire', color: 'linear-gradient(135deg, #f97316, #ea580c)', iconColor: '#fff' },
        { key: 'aireAcondicionado', label: 'Aire Acondicionado', icon: 'pi pi-snowflake', color: 'linear-gradient(135deg, #0ea5e9, #0284c7)', iconColor: '#fff', ventaField: 'aire_acondicionado_venta' },
        { key: 'balcon', label: 'Balcón', icon: 'pi pi-window-maximize', color: 'linear-gradient(135deg, #a855f7, #9333ea)', iconColor: '#fff', ventaField: 'balcon_venta' },
        { key: 'mascotas', label: 'Mascotas', icon: 'pi pi-heart', color: 'linear-gradient(135deg, #ef4444, #dc2626)', iconColor: '#fff', alquilerField: 'permite_mascotas_alquiler' },
        { key: 'exterior', label: 'Exterior', icon: 'pi pi-sun', color: 'linear-gradient(135deg, #f59e0b, #d97706)', iconColor: '#fff', alquilerField: 'exterior_alquiler' },
        { key: 'wifi', label: 'WiFi', icon: 'pi pi-wifi', color: 'linear-gradient(135deg, #0ea5e9, #0284c7)', iconColor: '#fff', alquilerField: 'wifi_alquiler' },
        { key: 'parejas', label: 'Parejas', icon: 'pi pi-users', color: 'linear-gradient(135deg, #ec4899, #db2777)', iconColor: '#fff', alquilerField: 'permite_parejas_alquiler' },
        { key: 'visitas', label: 'Visitas', icon: 'pi pi-calendar', color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', iconColor: '#fff', alquilerField: 'permitevisitas_alquiler' },
        { key: 'libreCargas', label: 'Libre de cargas', icon: 'pi pi-check-square', color: 'linear-gradient(135deg, #10b981, #059669)', iconColor: '#fff', ventaField: 'libre_cargas_venta' },
        { key: 'negociable', label: 'Negociable', icon: 'pi pi-dollar', color: 'linear-gradient(135deg, #f97316, #ea580c)', iconColor: '#fff', ventaField: 'negociable_venta' },
        { key: 'reforma', label: 'Reformado', icon: 'pi pi-paint-roller', color: 'linear-gradient(135deg, #a855f7, #9333ea)', iconColor: '#fff', ventaField: 'reforma_venta' }
    ];

    extrasValues: { [key: string]: boolean } = {};
    fotosPreview: FotoPreview[] = [];
    private fotoIdCounter = 0;
    subiendoFotos = false;
    fotosProcesadas = 0;
    fotosTotal = 0;

    ngOnInit() {
        const user = this.authService.getUser();
        if (user?.nro_doc_dto) {
            this.formData.nro_doc_dueno = user.nro_doc_dto;
        }
        this.formData.antiguedad_prop = this.calcularAntiguedad();
    }

    private calcularAntiguedad(): string {
        const year = this.formData.anyo_construccion_prop;
        if (!year) return '';
        return new Date().getFullYear() - year + ' años';
    }

    onAnyoChange() {
        this.formData.antiguedad_prop = this.calcularAntiguedad();
    }

    toggleExtra(key: string) {
        this.extrasValues[key] = !this.extrasValues[key];
    }

    pasoValido(): boolean {
        switch (this.pasoActual) {
            case 1:
                return !!this.formData.type;
            case 2:
                return (
                    !!this.formData.tipo_via_prop &&
                    !!this.formData.direccion_prop &&
                    !!this.formData.numero_prop &&
                    !!this.formData.cp_prop &&
                    !!this.formData.provincia_prop &&
                    !!this.formData.nro_catastral_prop &&
                    !!this.formData.metros_prop &&
                    !!this.formData.anyo_construccion_prop &&
                    !!this.formData.nro_habitaciones &&
                    !!this.formData.nro_banos
                );
            case 3:
                return this.formData.type === 'venta' ? !!this.formData.precio_venta && !!this.formData.clase_energetica_venta : !!this.formData.precio_alquiler;
            case 4:
                return this.fotosPreview.length > 0;
            case 5: {
                const desc = this.formData.descripcion || '';
                if (desc.length > 3000) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Descripción muy larga',
                        detail: `La descripción tiene ${desc.length} caracteres. El máximo es 3000.`,
                        life: 5000
                    });
                    return false;
                }
                return true;
            }

            default:
                return false;
        }
    }

    pasoSiguiente() {
        if (this.pasoValido() && this.pasoActual < this.steps.length) {
            this.pasoActual++;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    pasoAnterior() {
        if (this.pasoActual > 1) {
            this.pasoActual--;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    onFilesSelected(event: any) {
        const files: FileList = event.target.files;
        this.procesarArchivos(files);
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        const files = event.dataTransfer?.files;
        if (files) this.procesarArchivos(files);
    }

    private procesarArchivos(files: FileList) {
        const disponibles = 10 - this.fotosPreview.length;
        const archivosValidos: File[] = [];
        for (let i = 0; i < files.length && archivosValidos.length < disponibles; i++) {
            const file = files[i];
            if (file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024) {
                archivosValidos.push(file);
            }
        }

        if (archivosValidos.length === 0) return;

        // Mostrar toast de carga
        this.messageService.add({
            severity: 'info',
            summary: 'Cargando imágenes...',
            detail: `Procesando ${archivosValidos.length} foto(s) con canvas`,
            life: 5000
        });

        archivosValidos.forEach((file) => {
            const previewUrl = URL.createObjectURL(file);

            // Usar canvas para comprimir la imagen
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 1200;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx!.drawImage(img, 0, 0, width, height);

                const compressedBase64 = canvas.toDataURL('image/webp', 0.8);

                this.ngZone.run(() => {
                    this.fotosPreview.push({
                        id: this.fotoIdCounter++,
                        url: previewUrl,
                        file,
                        compressedBase64
                    });
                });
            };
            img.onerror = () => {
                // Si falla el canvas, usar FileReader como fallback
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.ngZone.run(() => {
                        this.fotosPreview.push({
                            id: this.fotoIdCounter++,
                            url: previewUrl,
                            file,
                            compressedBase64: e.target.result
                        });
                    });
                };
                reader.readAsDataURL(file);
            };
            img.src = previewUrl;
        });
    }

    eliminarFoto(index: number) {
        this.fotosPreview.splice(index, 1);
    }

    moverArriba(index: number) {
        if (index > 0) {
            const temp = this.fotosPreview[index];
            this.fotosPreview[index] = this.fotosPreview[index - 1];
            this.fotosPreview[index - 1] = temp;
        }
    }

    private buildJsonVenta(): any {
        return {
            type: 'venta',
            nro_doc_dueno: this.formData.nro_doc_dueno,
            tipo_via_prop: this.formData.tipo_via_prop,
            direccion_prop: this.formData.direccion_prop,
            numero_prop: this.formData.numero_prop,
            planta_prop: this.formData.planta_prop || 0,
            puerta_prop: this.formData.puerta_prop || '',
            cp_prop: this.formData.cp_prop,
            provincia_prop: this.formData.provincia_prop,
            nro_catastral_prop: this.formData.nro_catastral_prop,
            nro_banos_venta: this.formData.nro_banos,
            ascensor_prop: this.extrasValues['ascensor'] || false,
            metros_prop: this.formData.metros_prop,
            anyo_construccion_prop: this.formData.anyo_construccion_prop,
            antiguedad_prop: this.formData.antiguedad_prop,
            fecha_publicacion_prop: new Date().toISOString().split('T')[0],
            precio_venta: this.formData.precio_venta,
            nro_habitaciones_venta: this.formData.nro_habitaciones,
            balcon_venta: this.extrasValues['balcon'] || false,
            clase_energetica_venta: this.formData.clase_energetica_venta,
            amueblada_venta: this.extrasValues['amueblado'] || false,
            garage_venta: this.extrasValues['garaje'] || false,
            aire_acondicionado_venta: this.extrasValues['aireAcondicionado'] || false,
            libre_cargas_venta: this.extrasValues['libreCargas'] || false,
            negociable_venta: this.extrasValues['negociable'] || false,
            reforma_venta: this.extrasValues['reforma'] || false,
            descripcion_venta: this.formData.descripcion || '',
            fotos_urls: this.fotosPreview.map((f) => f.compressedBase64)
        };
    }

    private buildJsonAlquiler(): any {
        return {
            type: 'alquiler',
            nro_doc_dueno: this.formData.nro_doc_dueno,
            tipo_via_prop: this.formData.tipo_via_prop,
            direccion_prop: this.formData.direccion_prop,
            numero_prop: this.formData.numero_prop,
            planta_prop: this.formData.planta_prop || 0,
            puerta_prop: this.formData.puerta_prop || '',
            cp_prop: this.formData.cp_prop,
            provincia_prop: this.formData.provincia_prop,
            nro_catastral_prop: this.formData.nro_catastral_prop,
            nro_banos_venta: this.formData.nro_banos,
            ascensor_prop: this.extrasValues['ascensor'] || false,
            metros_prop: this.formData.metros_prop,
            anyo_construccion_prop: this.formData.anyo_construccion_prop,
            antiguedad_prop: this.formData.antiguedad_prop,
            fecha_publicacion_prop: new Date().toISOString().split('T')[0],
            precio_alquiler: this.formData.precio_alquiler,
            fianza_alquiler: this.formData.fianza_alquiler || 0,
            nro_personas_alquiler: this.formData.nro_personas_alquiler || 1,
            exterior_alquiler: this.extrasValues['exterior'] || false,
            permite_mascotas_alquiler: this.extrasValues['mascotas'] || false,
            permite_parejas_alquiler: this.extrasValues['parejas'] || false,
            wifi_alquiler: this.extrasValues['wifi'] || false,
            permitevisitas_alquiler: this.extrasValues['visitas'] || false,
            descripcion_alquiler: this.formData.descripcion || '',
            fotos_urls: this.fotosPreview.map((f) => f.compressedBase64)
        };
    }

    publicar() {
        if (!this.pasoValido()) return;

        // Mostrar spinner primero, diferir el trabajo pesado para que Angular renderice el spinner
        this.loading = true;

        // Usamos setTimeout para permitir que Angular detecte el cambio y renderice el spinner
        // antes de ejecutar el código síncrono pesado (buildJson con base64)
        setTimeout(() => {
            const jsonFinal = this.formData.type === 'venta' ? this.buildJsonVenta() : this.buildJsonAlquiler();

            console.log('JSON a enviar:', JSON.stringify({ ...jsonFinal, fotos_urls: `[${jsonFinal.fotos_urls.length} fotos en base64]` }));

            const request$ = this.formData.type === 'venta' ? this.inmuebleService.crearVenta(jsonFinal) : this.inmuebleService.crearAlquiler(jsonFinal);

            request$.subscribe({
                next: (response) => {
                    console.log('Respuesta del servidor:', response);
                    this.loading = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: '¡Anuncio publicado!',
                        detail: 'Tu inmueble se ha publicado correctamente.',
                        life: 4000
                    });
                    setTimeout(() => this.router.navigate(['/perfil']), 2000);
                },
                error: (err) => {
                    console.error('Error al publicar:', err);
                    this.loading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error al publicar',
                        detail: err.error?.message || 'No se pudo publicar el anuncio. Inténtalo de nuevo.',
                        life: 5000
                    });
                }
            });
        }, 50); // Pequeño delay para asegurar que Angular renderice el spinner
    }
}
