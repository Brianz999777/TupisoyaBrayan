import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TopbarWidget } from '../topbar/topbarwidget.component';
import { FooterWidget } from '../topbar/footerwidget';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Auth } from '../../service/auth.service';
import { InmuebleService } from '../../service/inmueble.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
    selector: 'app-publicaciones',
    standalone: true,
    imports: [CommonModule, RouterModule, TopbarWidget, FooterWidget, ButtonModule, ToastModule, ConfirmDialogModule, DialogModule, InputTextModule, InputNumberModule, SelectModule, CheckboxModule, FormsModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <div class="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-surface-900">
            <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
            <div class="flex-1">
                <!-- Hero -->
                <section class="publicaciones-hero">
                    <div class="hero-glow"></div>
                    <div class="container mx-auto px-6 text-center relative z-10">
                        <h1 class="hero-title">Mis <span class="text-[#1A262F]">publicaciones</span></h1>
                        <p class="hero-subtitle">Gestiona todos tus anuncios de venta y alquiler desde un solo lugar.</p>
                    </div>
                </section>

                <section class="py-12">
                    <div class="max-w-6xl mx-auto px-6">
                        @if (loading) {
                            <div class="flex flex-col items-center justify-center py-20">
                                <i class="pi pi-spin pi-spinner text-5xl text-[#D4E157]"></i>
                                <p class="mt-6 text-lg font-bold text-[#1A262F] dark:text-white">Cargando publicaciones...</p>
                            </div>
                        } @else if (errorCarga) {
                            <div class="flex flex-col items-center justify-center py-20">
                                <div class="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                    <i class="pi pi-exclamation-triangle text-4xl text-red-500"></i>
                                </div>
                                <p class="text-lg font-bold text-red-600 mb-2">Error al cargar publicaciones</p>
                                <p class="text-sm text-gray-500 mb-6">El servidor no respondió a tiempo. Intenta de nuevo.</p>
                                <button class="btn-publicar" (click)="reintentar()">
                                    <i class="pi pi-refresh"></i>
                                    Reintentar
                                </button>
                            </div>
                        } @else if (ventas.length === 0 && alquileres.length === 0) {
                            <!-- Empty State -->
                            <div class="empty-state">
                                <div class="empty-icon">
                                    <i class="pi pi-home text-6xl"></i>
                                </div>
                                <h2 class="empty-title">Aún no tienes publicaciones</h2>
                                <p class="empty-desc">¡Publica tu primer anuncio y llega a miles de interesados!</p>
                                <button class="btn-publicar" routerLink="/publicar-anuncio">
                                    <i class="pi pi-plus-circle"></i>
                                    Publicar mi primer anuncio
                                </button>
                            </div>
                        } @else {
                            <!-- Stats -->
                            <div class="stats-row">
                                <div class="stat-card">
                                    <span class="stat-number">{{ ventas.length + alquileres.length }}</span>
                                    <span class="stat-label">Total</span>
                                </div>
                                <div class="stat-card">
                                    <span class="stat-number">{{ ventas.length }}</span>
                                    <span class="stat-label">En venta</span>
                                </div>
                                <div class="stat-card">
                                    <span class="stat-number">{{ alquileres.length }}</span>
                                    <span class="stat-label">En alquiler</span>
                                </div>
                            </div>

                            <!-- SECCIÓN VENTAS -->
                            @if (ventas.length > 0) {
                                <div class="seccion">
                                    <div class="seccion-header">
                                        <div class="seccion-icon venta-icon">
                                            <i class="pi pi-tag"></i>
                                        </div>
                                        <h2 class="seccion-title">Ventas</h2>
                                        <span class="seccion-count">{{ ventas.length }}</span>
                                    </div>
                                    <div class="cards-grid">
                                        @for (pub of ventas; track pub.id_prop) {
                                            <div class="pub-card">
                                                <div class="pub-img-area">
                                                    <img [src]="getFotoPrincipal(pub)" alt="" class="pub-img" (error)="onImgError($event)" />
                                                    <div class="pub-badges">
                                                        <span class="badge-tipo venta">Venta</span>
                                                        @if (pub.fotos?.length > 0) {
                                                            <span class="badge-fotos"><i class="pi pi-camera"></i> {{ pub.fotos.length }}</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div class="pub-body">
                                                    <h3 class="pub-address">{{ getDireccion(pub) }}</h3>
                                                    <p class="pub-price">{{ pub.precio_venta | number: '1.0-0' }} €</p>
                                                    <div class="pub-features">
                                                        <span><i class="pi pi-home"></i> {{ pub.nro_habitaciones_venta || '?' }} hab.</span>
                                                        <span><i class="pi pi-box"></i> {{ pub.nro_banos_prop || '?' }} baños</span>
                                                        <span><i class="pi pi-expand"></i> {{ pub.metros_prop }} m²</span>
                                                    </div>
                                                </div>
                                                <div class="pub-actions">
                                                    <button class="action-btn view" (click)="verAnuncio(pub, 'venta')"><i class="pi pi-eye"></i> Ver anuncio</button>
                                                    <button class="action-btn edit" (click)="abrirModalEditar(pub, 'venta')"><i class="pi pi-pencil"></i> Editar</button>
                                                    <button class="action-btn delete" (click)="confirmarEliminar(pub, 'venta')"><i class="pi pi-trash"></i> Eliminar</button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }

                            <!-- SECCIÓN ALQUILERES -->
                            @if (alquileres.length > 0) {
                                <div class="seccion">
                                    <div class="seccion-header">
                                        <div class="seccion-icon alquiler-icon">
                                            <i class="pi pi-key"></i>
                                        </div>
                                        <h2 class="seccion-title">Alquileres</h2>
                                        <span class="seccion-count">{{ alquileres.length }}</span>
                                    </div>
                                    <div class="cards-grid">
                                        @for (pub of alquileres; track pub.id_prop) {
                                            <div class="pub-card">
                                                <div class="pub-img-area">
                                                    <img [src]="getFotoPrincipal(pub)" alt="" class="pub-img" (error)="onImgError($event)" />
                                                    <div class="pub-badges">
                                                        <span class="badge-tipo alquiler">Alquiler</span>
                                                        @if (pub.fotos?.length > 0) {
                                                            <span class="badge-fotos"><i class="pi pi-camera"></i> {{ pub.fotos.length }}</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div class="pub-body">
                                                    <h3 class="pub-address">{{ getDireccion(pub) }}</h3>
                                                    <p class="pub-price">{{ pub.precio_alquiler | number: '1.0-0' }} € <span class="text-sm font-medium text-gray-400">/mes</span></p>
                                                    <div class="pub-features">
                                                        <span><i class="pi pi-home"></i> {{ pub.nro_habitaciones || '?' }} hab.</span>
                                                        <span><i class="pi pi-box"></i> {{ pub.nro_banos_prop || '?' }} baños</span>
                                                        <span><i class="pi pi-expand"></i> {{ pub.metros_prop }} m²</span>
                                                    </div>
                                                </div>
                                                <div class="pub-actions">
                                                    <button class="action-btn view" (click)="verAnuncio(pub, 'alquiler')"><i class="pi pi-eye"></i> Ver anuncio</button>
                                                    <button class="action-btn edit" (click)="abrirModalEditar(pub, 'alquiler')"><i class="pi pi-pencil"></i> Editar</button>
                                                    <button class="action-btn delete" (click)="confirmarEliminar(pub, 'alquiler')"><i class="pi pi-trash"></i> Eliminar</button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }
                        }
                    </div>
                </section>
            </div>
            <footer-widget class="mt-auto" />
        </div>

        <!-- MODAL EDITAR VENTA -->
        <p-dialog [(visible)]="modalVentaVisible" [modal]="true" [style]="{ width: '600px' }" [draggable]="false" [resizable]="false" header="Editar publicación de venta" class="edit-modal">
            <div class="flex flex-col gap-4 p-4">
                <div class="field">
                    <label class="font-semibold text-sm text-[#1A262F]">Dirección</label>
                    <input pInputText type="text" [(ngModel)]="editForm.direccion_prop" class="w-full" placeholder="Dirección" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="field">
                        <label class="font-semibold text-sm text-[#1A262F]">Nº</label>
                        <input pInputText type="text" [(ngModel)]="editForm.numero_prop" class="w-full" placeholder="Número" />
                    </div>
                    <div class="field">
                        <label class="font-semibold text-sm text-[#1A262F]">Provincia</label>
                        <input pInputText type="text" [(ngModel)]="editForm.provincia_prop" class="w-full" placeholder="Provincia" />
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-4">
                    <div class="field">
                        <label class="font-semibold text-sm text-[#1A262F]">Precio (€)</label>
                        <p-inputNumber [(ngModel)]="editForm.precio_venta" [min]="0" [max]="999999999" class="w-full" />
                    </div>
                    <div class="field">
                        <label class="font-semibold text-sm text-[#1A262F]">Habitaciones</label>
                        <p-inputNumber [(ngModel)]="editForm.nro_habitaciones_venta" [min]="0" [max]="50" class="w-full" />
                    </div>
                    <div class="field">
                        <label class="font-semibold text-sm text-[#1A262F]">Baños</label>
                        <p-inputNumber [(ngModel)]="editForm.nro_banos_prop" [min]="0" [max]="50" class="w-full" />
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="field">
                        <label class="font-semibold text-sm text-[#1A262F]">Metros²</label>
                        <p-inputNumber [(ngModel)]="editForm.metros_prop" [min]="0" [max]="99999" class="w-full" />
                    </div>
                    <div class="field">
                        <label class="font-semibold text-sm text-[#1A262F]">Planta</label>
                        <p-inputNumber [(ngModel)]="editForm.planta_prop" [min]="-5" [max]="200" class="w-full" />
                    </div>
                </div>
                <div class="field">
                    <label class="font-semibold text-sm text-[#1A262F]">Descripción</label>
                    <textarea [(ngModel)]="editForm.descripcion_venta" rows="4" class="w-full p-2 border border-gray-200 rounded-lg" placeholder="Descripción de la venta"></textarea>
                </div>
                <div class="flex items-center gap-6">
                    <div class="flex items-center gap-2">
                        <p-checkbox [(ngModel)]="editForm.ascensor_prop" [binary]="true" inputId="ascensor_v" />
                        <label for="ascensor_v" class="text-sm">Ascensor</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <p-checkbox [(ngModel)]="editForm.reforma_venta" [binary]="true" inputId="reforma_v" />
                        <label for="reforma_v" class="text-sm">Reformado</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <p-checkbox [(ngModel)]="editForm.aire_acondicionado_venta" [binary]="true" inputId="aire_v" />
                        <label for="aire_v" class="text-sm">A/A</label>
                    </div>
                </div>
            </div>
            <div class="flex justify-end gap-3 p-4 border-t border-gray-100">
                <button class="btn-cancelar" (click)="cerrarModal()">Cancelar</button>
                <button class="btn-guardar" (click)="guardarEdicion()" [disabled]="guardando">
                    @if (guardando) {
                        <i class="pi pi-spin pi-spinner"></i>
                    }
                    {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
                </button>
            </div>
        </p-dialog>

        <!-- MODAL EDITAR ALQUILER -->
        <p-dialog [(visible)]="modalAlquilerVisible" [modal]="true" [style]="{ width: '600px' }" [draggable]="false" [resizable]="false" header="Editar publicación de alquiler" class="edit-modal">
            <div class="flex flex-col gap-4 p-4">
                <div class="field">
                    <label class="font-semibold text-sm text-[#1A262F]">Dirección</label>
                    <input pInputText type="text" [(ngModel)]="editForm.direccion_prop" class="w-full" placeholder="Dirección" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="field">
                        <label class="font-semibold text-sm text-[#1A262F]">Nº</label>
                        <input pInputText type="text" [(ngModel)]="editForm.numero_prop" class="w-full" placeholder="Número" />
                    </div>
                    <div class="field">
                        <label class="font-semibold text-sm text-[#1A262F]">Provincia</label>
                        <input pInputText type="text" [(ngModel)]="editForm.provincia_prop" class="w-full" placeholder="Provincia" />
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-4">
                    <div class="field">
                        <label class="font-semibold text-sm text-[#1A262F]">Precio (€/mes)</label>
                        <p-inputNumber [(ngModel)]="editForm.precio_alquiler" [min]="0" [max]="999999" class="w-full" />
                    </div>
                    <div class="field">
                        <label class="font-semibold text-sm text-[#1A262F]">Habitaciones</label>
                        <p-inputNumber [(ngModel)]="editForm.nro_habitaciones" [min]="0" [max]="50" class="w-full" />
                    </div>
                    <div class="field">
                        <label class="font-semibold text-sm text-[#1A262F]">Baños</label>
                        <p-inputNumber [(ngModel)]="editForm.nro_banos_prop" [min]="0" [max]="50" class="w-full" />
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="field">
                        <label class="font-semibold text-sm text-[#1A262F]">Metros²</label>
                        <p-inputNumber [(ngModel)]="editForm.metros_prop" [min]="0" [max]="99999" class="w-full" />
                    </div>
                    <div class="field">
                        <label class="font-semibold text-sm text-[#1A262F]">Planta</label>
                        <p-inputNumber [(ngModel)]="editForm.planta_prop" [min]="-5" [max]="200" class="w-full" />
                    </div>
                </div>
                <div class="field">
                    <label class="font-semibold text-sm text-[#1A262F]">Descripción</label>
                    <textarea [(ngModel)]="editForm.descripcion_alquiler" rows="4" class="w-full p-2 border border-gray-200 rounded-lg" placeholder="Descripción del alquiler"></textarea>
                </div>
                <div class="flex items-center gap-6">
                    <div class="flex items-center gap-2">
                        <p-checkbox [(ngModel)]="editForm.ascensor_prop" [binary]="true" inputId="ascensor_a" />
                        <label for="ascensor_a" class="text-sm">Ascensor</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <p-checkbox [(ngModel)]="editForm.permite_mascotas_alquiler" [binary]="true" inputId="mascotas" />
                        <label for="mascotas" class="text-sm">Mascotas</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <p-checkbox [(ngModel)]="editForm.wifi_alquiler" [binary]="true" inputId="wifi" />
                        <label for="wifi" class="text-sm">WiFi</label>
                    </div>
                </div>
            </div>
            <div class="flex justify-end gap-3 p-4 border-t border-gray-100">
                <button class="btn-cancelar" (click)="cerrarModal()">Cancelar</button>
                <button class="btn-guardar" (click)="guardarEdicion()" [disabled]="guardando">
                    @if (guardando) {
                        <i class="pi pi-spin pi-spinner"></i>
                    }
                    {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
                </button>
            </div>
        </p-dialog>

        <p-toast position="top-center"></p-toast>
        <p-confirmDialog [style]="{ width: '450px' }" rejectButtonStyleClass="p-button-text" acceptButtonStyleClass="p-button-danger">
            <ng-template #acceptIcon><i class="pi pi-trash"></i></ng-template>
        </p-confirmDialog>
    `,
    styles: [
        `
            .publicaciones-hero {
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

            .empty-state {
                text-align: center;
                padding: 5rem 2rem;
                background: #fff;
                border-radius: 24px;
                box-shadow:
                    0 1px 3px rgba(0, 0, 0, 0.04),
                    0 4px 16px rgba(0, 0, 0, 0.04);
                border: 1px solid rgba(0, 0, 0, 0.04);
                max-width: 500px;
                margin: 0 auto;
                .empty-icon {
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                    i {
                        color: #a3c92a;
                    }
                }
                .empty-title {
                    font-size: 1.75rem;
                    font-weight: 900;
                    color: #1a262f;
                    margin-bottom: 0.75rem;
                }
                .empty-desc {
                    color: #64748b;
                    font-size: 1.05rem;
                    margin-bottom: 2rem;
                    line-height: 1.6;
                }
            }

            .btn-publicar {
                padding: 1rem 2.5rem;
                background: linear-gradient(135deg, #d4e157, #a3c92a);
                color: #1a262f;
                font-weight: 800;
                font-size: 1.05rem;
                border: none;
                border-radius: 14px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 0.6rem;
                transition: all 0.3s ease;
                box-shadow: 0 4px 16px rgba(163, 201, 42, 0.3);
                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(163, 201, 42, 0.4);
                }
            }

            .stats-row {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 1rem;
                margin-bottom: 2.5rem;
            }

            .stat-card {
                background: #fff;
                border-radius: 16px;
                padding: 1.5rem;
                text-align: center;
                box-shadow:
                    0 1px 3px rgba(0, 0, 0, 0.04),
                    0 4px 16px rgba(0, 0, 0, 0.04);
                border: 1px solid rgba(0, 0, 0, 0.04);
                .stat-number {
                    display: block;
                    font-size: 2.5rem;
                    font-weight: 900;
                    color: #1a262f;
                    line-height: 1;
                    margin-bottom: 0.25rem;
                }
                .stat-label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
            }

            .seccion {
                margin-bottom: 3rem;
            }

            .seccion-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 1.5rem;
            }

            .seccion-icon {
                width: 40px;
                height: 40px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                i {
                    font-size: 1.1rem;
                    color: #fff;
                }
                &.venta-icon {
                    background: linear-gradient(135deg, #d4e157, #a3c92a);
                }
                &.alquiler-icon {
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                }
            }

            .seccion-title {
                font-size: 1.5rem;
                font-weight: 800;
                color: #1a262f;
                margin: 0;
            }

            .seccion-count {
                background: #f1f5f9;
                color: #64748b;
                font-size: 0.85rem;
                font-weight: 700;
                padding: 0.25rem 0.75rem;
                border-radius: 999px;
            }

            .cards-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 1.25rem;
            }

            .pub-card {
                background: #fff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow:
                    0 1px 3px rgba(0, 0, 0, 0.04),
                    0 4px 16px rgba(0, 0, 0, 0.04);
                border: 1px solid rgba(0, 0, 0, 0.04);
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                &:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
                }
            }

            .pub-img-area {
                position: relative;
                height: 160px;
                overflow: hidden;
                background: #f1f5f9;
            }

            .pub-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .pub-badges {
                position: absolute;
                top: 0.75rem;
                left: 0.75rem;
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }

            .badge-tipo {
                padding: 0.3rem 0.65rem;
                border-radius: 8px;
                font-size: 0.7rem;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.03em;
                &.venta {
                    background: linear-gradient(135deg, #d4e157, #a3c92a);
                    color: #1a262f;
                }
                &.alquiler {
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    color: #fff;
                }
            }

            .badge-fotos {
                padding: 0.3rem 0.65rem;
                border-radius: 8px;
                font-size: 0.7rem;
                font-weight: 700;
                background: rgba(0, 0, 0, 0.6);
                color: #fff;
                display: inline-flex;
                align-items: center;
                gap: 0.3rem;
                backdrop-filter: blur(4px);
            }

            .pub-body {
                padding: 1rem 1.25rem;
                flex: 1;
            }

            .pub-address {
                font-size: 0.9rem;
                font-weight: 700;
                color: #1a262f;
                margin-bottom: 0.35rem;
                line-height: 1.3;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .pub-price {
                font-size: 1.3rem;
                font-weight: 900;
                color: #a3c92a;
                margin-bottom: 0.5rem;
            }

            .pub-features {
                display: flex;
                gap: 0.75rem;
                flex-wrap: wrap;
                span {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #64748b;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    i {
                        font-size: 0.75rem;
                    }
                }
            }

            .pub-actions {
                display: flex;
                gap: 0.5rem;
                padding: 0.75rem 1.25rem;
                border-top: 1px solid #f1f5f9;
            }

            .action-btn {
                flex: 1;
                padding: 0.55rem 0.75rem;
                border: none;
                border-radius: 10px;
                font-weight: 700;
                font-size: 0.8rem;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 0.35rem;
                transition: all 0.3s ease;
                &.view {
                    background: #eef2ff;
                    color: #4f46e5;
                    &:hover {
                        background: #e0e7ff;
                        color: #4338ca;
                    }
                }
                &.edit {
                    background: #f1f5f9;
                    color: #475569;
                    &:hover {
                        background: #e2e8f0;
                        color: #1a262f;
                    }
                }
                &.delete {
                    background: #fef2f2;
                    color: #ef4444;
                    &:hover {
                        background: #fee2e2;
                    }
                }
            }

            /* MODAL EDIT */
            .edit-modal :host ::ng-deep .p-dialog-header {
                background: linear-gradient(135deg, #d4e157 0%, #a3c92a 50%, #84b01e 100%);
                color: #1a262f;
                font-weight: 800;
                font-size: 1.2rem;
                padding: 1.25rem 1.5rem;
                border-radius: 12px 12px 0 0;
            }
            .edit-modal :host ::ng-deep .p-dialog-content {
                padding: 0;
            }
            .field label {
                display: block;
                margin-bottom: 0.35rem;
            }
            .btn-cancelar {
                padding: 0.65rem 1.5rem;
                background: #f1f5f9;
                color: #475569;
                font-weight: 700;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.2s;
                &:hover {
                    background: #e2e8f0;
                }
            }
            .btn-guardar {
                padding: 0.65rem 1.5rem;
                background: linear-gradient(135deg, #d4e157, #a3c92a);
                color: #1a262f;
                font-weight: 800;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.2s;
                &:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(163, 201, 42, 0.3);
                }
                &:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            }

            @media (max-width: 768px) {
                .publicaciones-hero .hero-title {
                    font-size: 2.2rem;
                }
                .cards-grid {
                    grid-template-columns: 1fr;
                }
                .stats-row {
                    grid-template-columns: 1fr 1fr;
                }
            }

            :host-context(.dark) {
                .empty-state {
                    background: #1e293b;
                    border-color: rgba(255, 255, 255, 0.05);
                    .empty-title {
                        color: #f1f5f9;
                    }
                }
                .stat-card {
                    background: #1e293b;
                    border-color: rgba(255, 255, 255, 0.05);
                    .stat-number {
                        color: #f1f5f9;
                    }
                }
                .pub-card {
                    background: #1e293b;
                    border-color: rgba(255, 255, 255, 0.05);
                }
                .pub-address {
                    color: #f1f5f9;
                }
                .pub-actions {
                    border-color: rgba(255, 255, 255, 0.05);
                }
                .action-btn.edit {
                    background: #334155;
                    color: #94a3b8;
                    &:hover {
                        background: #475569;
                        color: #f1f5f9;
                    }
                }
                .seccion-count {
                    background: #334155;
                    color: #94a3b8;
                }
            }
        `
    ]
})
export class Publicaciones implements OnInit {
    private router = inject(Router);
    private authService = inject(Auth);
    private inmuebleService = inject(InmuebleService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef);

    loading = true;
    errorCarga = false;
    ventas: any[] = [];
    alquileres: any[] = [];
    private nroDocActual = '';

    // Modal edición
    modalVentaVisible = false;
    modalAlquilerVisible = false;
    editTipo: 'venta' | 'alquiler' = 'venta';
    editId: number | null = null;
    guardando = false;
    editForm: any = {};

    ngOnInit() {
        const user = this.authService.getUser();
        if (!user?.nro_doc_dto) {
            this.router.navigate(['/login']);
            return;
        }
        this.nroDocActual = user.nro_doc_dto;
        this.cargarPublicaciones();
    }

    reintentar() {
        this.cargarPublicaciones();
    }

    private cargarPublicaciones() {
        this.loading = true;
        this.errorCarga = false;

        let ventasCargadas = false;
        let alquileresCargados = false;
        let ventasError = false;
        let alquileresError = false;

        const verificarCompletado = () => {
            if (ventasCargadas && alquileresCargados) {
                this.loading = false;
                if (ventasError && alquileresError) {
                    this.errorCarga = true;
                }
                this.cdr.detectChanges();
            }
        };

        console.log('[Publicaciones] Cargando para nroDoc:', this.nroDocActual);

        // Cargar ventas
        this.inmuebleService
            .getVentasByUser(this.nroDocActual)
            .pipe(
                catchError((err) => {
                    console.error('[Publicaciones] Error cargando ventas:', err);
                    ventasError = true;
                    return of([]);
                })
            )
            .subscribe({
                next: (data) => {
                    console.log('[Publicaciones] Ventas recibidas:', data?.length || 0);
                    this.ventas = data || [];
                    ventasCargadas = true;
                    verificarCompletado();
                },
                error: () => {
                    this.ventas = [];
                    ventasCargadas = true;
                    ventasError = true;
                    verificarCompletado();
                }
            });

        // Cargar alquileres
        this.inmuebleService
            .getAlquileresByUser(this.nroDocActual)
            .pipe(
                catchError((err) => {
                    console.error('[Publicaciones] Error cargando alquileres:', err);
                    alquileresError = true;
                    return of([]);
                })
            )
            .subscribe({
                next: (data) => {
                    console.log('[Publicaciones] Alquileres recibidos:', data?.length || 0);
                    this.alquileres = data || [];
                    alquileresCargados = true;
                    verificarCompletado();
                },
                error: () => {
                    this.alquileres = [];
                    alquileresCargados = true;
                    alquileresError = true;
                    verificarCompletado();
                }
            });
    }

    getDireccion(pub: any): string {
        if (pub.direccion_fisica) return pub.direccion_fisica;
        const parts = [];
        if (pub.tipo_via_prop) parts.push(pub.tipo_via_prop);
        if (pub.direccion_prop) parts.push(pub.direccion_prop);
        if (pub.numero_prop) parts.push(', ' + pub.numero_prop);
        if (parts.length > 0) return parts.join(' ');
        if (pub.provincia_prop) return pub.provincia_prop;
        return 'Dirección no disponible';
    }

    verAnuncio(pub: any, tipo: string) {
        this.router.navigate(['/landing'], {
            queryParams: { detalle: pub.id_prop, tipo }
        });
    }

    getFotoPrincipal(pub: any): string {
        if (pub.fotos && pub.fotos.length > 0) {
            const primera = pub.fotos[0];
            if (typeof primera === 'string') return primera;
            return primera.url_foto || primera.url || '/demo/images/galleria/no_photo.png';
        }
        if (pub.foto_principal) return pub.foto_principal;
        return '/demo/images/galleria/no_photo.png';
    }

    onImgError(event: Event) {
        const img = event.target as HTMLImageElement;
        img.src = '/demo/images/galleria/no_photo.png';
    }

    abrirModalEditar(pub: any, tipo: 'venta' | 'alquiler') {
        this.editTipo = tipo;
        this.editId = pub.id_prop;
        this.guardando = true;

        // Abrir el modal inmediatamente con datos básicos de la tarjeta
        // Incluir TODOS los campos obligatorios para que el backend no rechace la petición
        this.editForm = {
            direccion_prop: pub.direccion_prop || '',
            numero_prop: pub.numero_prop || 1,
            provincia_prop: pub.provincia_prop || '',
            metros_prop: pub.metros_prop || 1,
            planta_prop: pub.planta_prop || 0,
            ascensor_prop: pub.ascensor_prop || false,
            nro_banos_prop: pub.nro_banos_prop || 1,
            // Campos obligatorios que siempre deben tener valor
            puerta_prop: pub.puerta_prop || '',
            nro_catastral_prop: pub.nro_catastral_prop || '',
            nro_doc_dueno: pub.nro_doc_dueno || this.nroDocActual,
            tipo_via_prop: pub.tipo_via_prop || '',
            cp_prop: pub.cp_prop || '',
            anyo_construccion_prop: pub.anyo_construccion_prop || 1900,
            antiguedad_prop: pub.antiguedad_prop || '',
            fecha_publicacion_prop: pub.fecha_publicacion_prop || new Date().toISOString().split('T')[0],
            // Campos de venta
            precio_venta: pub.precio_venta || 0,
            nro_habitaciones_venta: pub.nro_habitaciones_venta || 1,
            descripcion_venta: pub.descripcion_venta || '',
            reforma_venta: pub.reforma_venta || false,
            aire_acondicionado_venta: pub.aire_acondicionado_venta || false,
            balcon_venta: pub.balcon_venta || false,
            clase_energetica_venta: pub.clase_energetica_venta || '',
            amueblada_venta: pub.amueblada_venta || false,
            garage_venta: pub.garage_venta || false,
            libre_cargas_venta: pub.libre_cargas_venta || false,
            negociable_venta: pub.negociable_venta || false,
            // Campos de alquiler
            precio_alquiler: pub.precio_alquiler || 0,
            nro_habitaciones: pub.nro_habitaciones || 1,
            descripcion_alquiler: pub.descripcion_alquiler || '',
            permite_mascotas_alquiler: pub.permite_mascotas_alquiler || false,
            wifi_alquiler: pub.wifi_alquiler || false,
            nro_personas_alquiler: pub.nro_personas_alquiler || 1,
            exterior_alquiler: pub.exterior_alquiler || false,
            permite_parejas_alquiler: pub.permite_parejas_alquiler || false,
            permitevisitas_alquiler: pub.permitevisitas_alquiler || false,
            fianza_alquiler: pub.fianza_alquiler || 0
        };

        if (tipo === 'venta') {
            this.modalVentaVisible = true;
        } else {
            this.modalAlquilerVisible = true;
        }
        this.cdr.detectChanges();

        // Hacer petición al backend para obtener datos completos
        const detalle$: any = tipo === 'venta' ? this.inmuebleService.getVentaById(pub.id_prop) : this.inmuebleService.getAlquilerById(pub.id_prop);

        detalle$.subscribe({
            next: (detalle: any) => {
                console.log('[Publicaciones] Detalle recibido del backend:', detalle);
                // Actualizar el formulario con los datos completos del backend
                this.editForm = {
                    direccion_prop: detalle.direccion_prop || '',
                    numero_prop: detalle.numero_prop || 1,
                    provincia_prop: detalle.provincia_prop || '',
                    metros_prop: detalle.metros_prop || 1,
                    planta_prop: detalle.planta_prop || 0,
                    ascensor_prop: detalle.ascensor_prop || false,
                    nro_banos_prop: detalle.nro_banos_prop || 1,
                    puerta_prop: detalle.puerta_prop || '',
                    nro_catastral_prop: detalle.nro_catastral_prop || '',
                    nro_doc_dueno: detalle.nro_doc_dueno || this.nroDocActual,
                    tipo_via_prop: detalle.tipo_via_prop || '',
                    cp_prop: detalle.cp_prop || '',
                    anyo_construccion_prop: detalle.anyo_construccion_prop || 1900,
                    antiguedad_prop: detalle.antiguedad_prop || '',
                    fecha_publicacion_prop: detalle.fecha_publicacion_prop || new Date().toISOString().split('T')[0],
                    precio_venta: detalle.precio_venta || 0,
                    nro_habitaciones_venta: detalle.nro_habitaciones_venta || 1,
                    descripcion_venta: detalle.descripcion_venta || '',
                    reforma_venta: detalle.reforma_venta || false,
                    aire_acondicionado_venta: detalle.aire_acondicionado_venta || false,
                    balcon_venta: detalle.balcon_venta || false,
                    clase_energetica_venta: detalle.clase_energetica_venta || '',
                    amueblada_venta: detalle.amueblada_venta || false,
                    garage_venta: detalle.garage_venta || false,
                    libre_cargas_venta: detalle.libre_cargas_venta || false,
                    negociable_venta: detalle.negociable_venta || false,
                    precio_alquiler: detalle.precio_alquiler || 0,
                    nro_habitaciones: detalle.nro_habitaciones || 1,
                    descripcion_alquiler: detalle.descripcion_alquiler || '',
                    permite_mascotas_alquiler: detalle.permite_mascotas_alquiler || false,
                    wifi_alquiler: detalle.wifi_alquiler || false,
                    nro_personas_alquiler: detalle.nro_personas_alquiler || 1,
                    exterior_alquiler: detalle.exterior_alquiler || false,
                    permite_parejas_alquiler: detalle.permite_parejas_alquiler || false,
                    permitevisitas_alquiler: detalle.permitevisitas_alquiler || false,
                    fianza_alquiler: detalle.fianza_alquiler || 0
                };
                this.guardando = false;
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                this.guardando = false;
                console.error('[Publicaciones] Error al obtener detalle del backend:', err);
                // El modal ya está abierto con los datos de la tarjeta, no lo cerramos
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Aviso',
                    detail: 'No se pudieron cargar los datos completos. Puedes editar con la información disponible.',
                    life: 4000
                });
                this.cdr.detectChanges();
            }
        });
    }

    cerrarModal() {
        this.modalVentaVisible = false;
        this.modalAlquilerVisible = false;
        this.editId = null;
        this.editForm = {};
    }

    guardarEdicion() {
        if (!this.editId) return;

        this.guardando = true;

        // Construir payload en snake_case (el backend acepta snake_case)
        const payload: any = {
            direccion_prop: this.editForm.direccion_prop,
            numero_prop: this.editForm.numero_prop || 1,
            provincia_prop: this.editForm.provincia_prop,
            metros_prop: this.editForm.metros_prop || 1,
            planta_prop: this.editForm.planta_prop || 0,
            ascensor_prop: this.editForm.ascensor_prop || false,
            nro_banos_prop: this.editForm.nro_banos_prop || 1,
            // Campos obligatorios
            puerta_prop: this.editForm.puerta_prop || '',
            nro_catastral_prop: this.editForm.nro_catastral_prop || '',
            nro_doc_dueno: this.editForm.nro_doc_dueno || this.nroDocActual,
            tipo_via_prop: this.editForm.tipo_via_prop || '',
            cp_prop: this.editForm.cp_prop || '',
            anyo_construccion_prop: this.editForm.anyo_construccion_prop || 1900,
            antiguedad_prop: this.editForm.antiguedad_prop || '',
            fecha_publicacion_prop: this.editForm.fecha_publicacion_prop || new Date().toISOString().split('T')[0]
        };

        if (this.editTipo === 'venta') {
            payload.precio_venta = this.editForm.precio_venta;
            payload.nro_habitaciones_venta = this.editForm.nro_habitaciones_venta || 1;
            payload.descripcion_venta = this.editForm.descripcion_venta || '';
            payload.reforma_venta = this.editForm.reforma_venta || false;
            payload.aire_acondicionado_venta = this.editForm.aire_acondicionado_venta || false;
            payload.balcon_venta = this.editForm.balcon_venta || false;
            payload.clase_energetica_venta = this.editForm.clase_energetica_venta || '';
            payload.amueblada_venta = this.editForm.amueblada_venta || false;
            payload.garage_venta = this.editForm.garage_venta || false;
            payload.libre_cargas_venta = this.editForm.libre_cargas_venta || false;
            payload.negociable_venta = this.editForm.negociable_venta || false;
        } else {
            payload.precio_alquiler = this.editForm.precio_alquiler;
            payload.nro_habitaciones = this.editForm.nro_habitaciones || 1;
            payload.descripcion_alquiler = this.editForm.descripcion_alquiler || '';
            payload.permite_mascotas_alquiler = this.editForm.permite_mascotas_alquiler || false;
            payload.wifi_alquiler = this.editForm.wifi_alquiler || false;
            payload.nro_personas_alquiler = this.editForm.nro_personas_alquiler || 1;
            payload.exterior_alquiler = this.editForm.exterior_alquiler || false;
            payload.permite_parejas_alquiler = this.editForm.permite_parejas_alquiler || false;
            payload.permitevisitas_alquiler = this.editForm.permitevisitas_alquiler || false;
            payload.fianza_alquiler = this.editForm.fianza_alquiler || 0;
        }

        const update$: any = this.editTipo === 'venta' ? this.inmuebleService.updateVenta(this.editId, payload) : this.inmuebleService.updateAlquiler(this.editId, payload);

        update$.subscribe({
            next: () => {
                this.guardando = false;
                this.cerrarModal();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Actualizada',
                    detail: 'La publicación se ha actualizado correctamente.',
                    life: 3000
                });
                // Recargar publicaciones para reflejar cambios
                this.cargarPublicaciones();
            },
            error: (err: any) => {
                this.guardando = false;
                console.error('[Publicaciones] Error al actualizar:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || 'No se pudo actualizar la publicación.',
                    life: 4000
                });
                this.cdr.detectChanges();
            }
        });
    }

    confirmarEliminar(pub: any, tipo: string) {
        this.confirmationService.confirm({
            message: `¿Estás seguro de eliminar esta publicación en ${this.getDireccion(pub)}?`,
            header: 'Eliminar publicación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            accept: () => this.eliminar(pub, tipo)
        });
    }

    private eliminar(pub: any, tipo: string) {
        const delete$ = tipo === 'venta' ? this.inmuebleService.deleteVenta(pub.id_prop) : this.inmuebleService.deleteAlquiler(pub.id_prop);

        delete$.subscribe({
            next: () => {
                if (tipo === 'venta') {
                    this.ventas = this.ventas.filter((p) => p.id_prop !== pub.id_prop);
                } else {
                    this.alquileres = this.alquileres.filter((p) => p.id_prop !== pub.id_prop);
                }
                this.messageService.add({
                    severity: 'success',
                    summary: 'Eliminada',
                    detail: 'La publicación se ha eliminado correctamente.',
                    life: 3000
                });
            },
            error: (err) => {
                console.error('Error al eliminar:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || 'No se pudo eliminar la publicación.',
                    life: 4000
                });
            }
        });
    }
}
