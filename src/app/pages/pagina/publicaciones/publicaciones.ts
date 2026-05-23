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
import { InmuebleService } from '../../service/inmueble.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Auth } from '../../service/auth.service';

@Component({
    selector: 'app-publicaciones',
    standalone: true,
    imports: [CommonModule, RouterModule, TopbarWidget, FooterWidget, ButtonModule, ToastModule, ConfirmDialogModule, DialogModule, InputTextModule, InputNumberModule, SelectModule, CheckboxModule, FormsModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950">
            <topbar-widget class="py-6 px-6 lg:px-20 flex items-center justify-between relative lg:static" />
            <div class="flex-1">
                <!-- Hero -->
                <section class="relative pt-32 pb-28 overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"></div>
                    <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2"></div>
                    <div class="absolute bottom-0 left-0 w-80 h-80 bg-teal-200/20 dark:bg-teal-500/5 rounded-full blur-3xl translate-y-1/2"></div>
                    <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
                        <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">Mis <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">publicaciones</span></h1>
                        <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Gestiona todos tus anuncios de venta y alquiler desde un solo lugar.</p>
                    </div>
                </section>

                <section class="py-12 bg-gray-50 dark:bg-gray-900/50">
                    <div class="max-w-6xl mx-auto px-6">
                        @if (loading) {
                            <div class="flex flex-col items-center justify-center py-20">
                                <i class="pi pi-spin pi-spinner text-5xl text-emerald-400 mb-6"></i>
                                <p class="text-lg font-bold text-gray-900 dark:text-white">Cargando publicaciones...</p>
                            </div>
                        } @else if (errorCarga) {
                            <div class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <div class="w-20 h-20 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
                                    <i class="pi pi-exclamation-triangle text-4xl text-red-500"></i>
                                </div>
                                <p class="text-lg font-bold text-red-600 mb-2">Error al cargar publicaciones</p>
                                <p class="text-sm text-gray-500 mb-6">El servidor no respondió a tiempo. Intenta de nuevo.</p>
                                <button (click)="reintentar()"
                                    class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25">
                                    <i class="pi pi-refresh text-sm"></i>
                                    Reintentar
                                </button>
                            </div>
                        } @else if (ventas.length === 0 && alquileres.length === 0) {
                            <div class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 max-w-lg mx-auto">
                                <div class="w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-6">
                                    <i class="pi pi-home text-4xl text-emerald-400"></i>
                                </div>
                                <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-2">Aún no tienes publicaciones</h2>
                                <p class="text-gray-500 dark:text-gray-400 text-center max-w-xs mb-8">¡Publica tu primer anuncio y llega a miles de interesados!</p>
                                <button routerLink="/publicar-anuncio"
                                    class="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25">
                                    <i class="pi pi-plus-circle text-sm"></i>
                                    Publicar mi primer anuncio
                                </button>
                            </div>
                        } @else {
                            <!-- Stats -->
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <span class="block text-3xl font-black text-gray-900 dark:text-white mb-1">{{ ventas.length + alquileres.length }}</span>
                                    <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total publicaciones</span>
                                </div>
                                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <span class="block text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-1">{{ ventas.length }}</span>
                                    <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">En venta</span>
                                </div>
                                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <span class="block text-3xl font-black text-amber-600 dark:text-amber-400 mb-1">{{ alquileres.length }}</span>
                                    <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">En alquiler</span>
                                </div>
                            </div>

                            <!-- SECCIÓN VENTAS -->
                            @if (ventas.length > 0) {
                                <div class="mb-10">
                                    <div class="flex items-center gap-3 mb-6">
                                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                                            <i class="pi pi-tag text-sm text-white"></i>
                                        </div>
                                        <h2 class="text-xl font-black text-gray-900 dark:text-white">Ventas</h2>
                                        <span class="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">{{ ventas.length }}</span>
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        @for (pub of ventas; track pub.id_prop) {
                                            <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                                <div class="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                    <img [src]="getFotoPrincipal(pub)" alt="" class="w-full h-full object-cover" (error)="onImgError($event)" />
                                                    <div class="absolute top-3 left-3 flex gap-2">
                                                        <span class="px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black rounded-lg">Venta</span>
                                                        @if (pub.fotos?.length > 0) {
                                                            <span class="px-2.5 py-1 bg-gray-900/60 backdrop-blur text-white text-[10px] font-bold rounded-lg inline-flex items-center gap-1">
                                                                <i class="pi pi-camera text-[9px]"></i>
                                                                {{ pub.fotos.length }}
                                                            </span>
                                                        }
                                                    </div>
                                                </div>
                                                <div class="p-5 flex-1 flex flex-col">
                                                    <h3 class="font-bold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">{{ pub.direccion_prop || 'Dirección no disponible' }}</h3>
                                                    <p class="text-xl font-black text-emerald-600 dark:text-emerald-400 mb-3">{{ pub.precio_venta | number: '1.0-0' }} €</p>
                                                    <div class="flex flex-wrap gap-3 mb-4">
                                                        <span class="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                                            <i class="pi pi-home text-gray-300 text-[10px]"></i>
                                                            {{ pub.nro_habitaciones_prop || '?' }} hab.
                                                        </span>
                                                        <span class="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                                            <i class="pi pi-box text-gray-300 text-[10px]"></i>
                                                            {{ pub.nro_banos_prop || '?' }} baños
                                                        </span>
                                                        <span class="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                                            <i class="pi pi-expand text-gray-300 text-[10px]"></i>
                                                            {{ pub.metros_prop }} m²
                                                        </span>
                                                    </div>
                                                    <div class="flex gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                                        <button (click)="verAnuncio(pub, 'venta')"
                                                            class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all inline-flex items-center justify-center gap-1.5">
                                                            <i class="pi pi-eye text-[10px]"></i>
                                                            Ver
                                                        </button>
                                                        <button (click)="abrirModalEditar(pub, 'venta')"
                                                            class="flex-1 px-3 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all inline-flex items-center justify-center gap-1.5">
                                                            <i class="pi pi-pencil text-[10px]"></i>
                                                            Editar
                                                        </button>
                                                        <button (click)="confirmarEliminar(pub, 'venta')"
                                                            class="flex-1 px-3 py-2 bg-red-50 dark:bg-red-500/10 text-red-500 font-bold text-xs rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-all inline-flex items-center justify-center gap-1.5">
                                                            <i class="pi pi-trash text-[10px]"></i>
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }

                            <!-- SECCIÓN ALQUILERES -->
                            @if (alquileres.length > 0) {
                                <div class="mb-10">
                                    <div class="flex items-center gap-3 mb-6">
                                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                            <i class="pi pi-key text-sm text-white"></i>
                                        </div>
                                        <h2 class="text-xl font-black text-gray-900 dark:text-white">Alquileres</h2>
                                        <span class="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">{{ alquileres.length }}</span>
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        @for (pub of alquileres; track pub.id_prop) {
                                            <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                                <div class="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                    <img [src]="getFotoPrincipal(pub)" alt="" class="w-full h-full object-cover" (error)="onImgError($event)" />
                                                    <div class="absolute top-3 left-3 flex gap-2">
                                                        <span class="px-2.5 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black rounded-lg">Alquiler</span>
                                                        @if (pub.fotos?.length > 0) {
                                                            <span class="px-2.5 py-1 bg-gray-900/60 backdrop-blur text-white text-[10px] font-bold rounded-lg inline-flex items-center gap-1">
                                                                <i class="pi pi-camera text-[9px]"></i>
                                                                {{ pub.fotos.length }}
                                                            </span>
                                                        }
                                                    </div>
                                                </div>
                                                <div class="p-5 flex-1 flex flex-col">
                                                    <h3 class="font-bold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">{{ getDireccion(pub) }}</h3>
                                                    <p class="text-xl font-black text-amber-600 dark:text-amber-400 mb-3">{{ pub.precio_alquiler | number: '1.0-0' }} € <span class="text-sm font-medium text-gray-400">/mes</span></p>
                                                    <div class="flex flex-wrap gap-3 mb-4">
                                                        <span class="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                                            <i class="pi pi-home text-gray-300 text-[10px]"></i>
                                                            {{ pub.nro_habitaciones_prop || '?' }} hab.
                                                        </span>
                                                        <span class="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                                            <i class="pi pi-box text-gray-300 text-[10px]"></i>
                                                            {{ pub.nro_banos_prop || '?' }} baños
                                                        </span>
                                                        <span class="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                                            <i class="pi pi-expand text-gray-300 text-[10px]"></i>
                                                            {{ pub.metros_prop }} m²
                                                        </span>
                                                    </div>
                                                    <div class="flex gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                                        <button (click)="verAnuncio(pub, 'alquiler')"
                                                            class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all inline-flex items-center justify-center gap-1.5">
                                                            <i class="pi pi-eye text-[10px]"></i>
                                                            Ver
                                                        </button>
                                                        <button (click)="abrirModalEditar(pub, 'alquiler')"
                                                            class="flex-1 px-3 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all inline-flex items-center justify-center gap-1.5">
                                                            <i class="pi pi-pencil text-[10px]"></i>
                                                            Editar
                                                        </button>
                                                        <button (click)="confirmarEliminar(pub, 'alquiler')"
                                                            class="flex-1 px-3 py-2 bg-red-50 dark:bg-red-500/10 text-red-500 font-bold text-xs rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-all inline-flex items-center justify-center gap-1.5">
                                                            <i class="pi pi-trash text-[10px]"></i>
                                                            Eliminar
                                                        </button>
                                                    </div>
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
            <app-footer-widget class="mt-auto" />
        </div>

        <!-- MODAL EDITAR VENTA -->
        <p-dialog [(visible)]="modalVentaVisible" [modal]="true" [style]="{ width: '600px' }" [draggable]="false" [resizable]="false" header="Editar publicación de venta" class="edit-modal">
            <div class="flex flex-col gap-4 p-4">
                <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Dirección</label>
                    <input pInputText type="text" [(ngModel)]="editForm.direccion_prop" class="w-full" placeholder="Dirección" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Nº</label>
                        <input pInputText type="text" [(ngModel)]="editForm.numero_prop" class="w-full" placeholder="Número" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Provincia</label>
                        <input pInputText type="text" [(ngModel)]="editForm.provincia_prop" class="w-full" placeholder="Provincia" />
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-4">
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Precio (€)</label>
                        <p-inputNumber [(ngModel)]="editForm.precio_venta" [min]="0" [max]="999999999" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Habitaciones</label>
                        <p-inputNumber [(ngModel)]="editForm.nro_habitaciones_prop" [min]="0" [max]="50" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Baños</label>
                        <p-inputNumber [(ngModel)]="editForm.nro_banos_prop" [min]="0" [max]="50" class="w-full" />
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Metros²</label>
                        <p-inputNumber [(ngModel)]="editForm.metros_prop" [min]="0" [max]="99999" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Planta</label>
                        <p-inputNumber [(ngModel)]="editForm.planta_prop" [min]="-5" [max]="200" class="w-full" />
                    </div>
                </div>
                <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción</label>
                    <textarea [(ngModel)]="editForm.descripcion_venta" rows="4" class="w-full p-3 border-2 border-gray-200 rounded-xl text-sm" placeholder="Descripción de la venta"></textarea>
                </div>
                <div class="flex items-center gap-6">
                    <div class="flex items-center gap-2">
                        <p-checkbox [(ngModel)]="editForm.ascensor_prop" [binary]="true" inputId="ascensor_v" />
                        <label for="ascensor_v" class="text-sm font-medium text-gray-700">Ascensor</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <p-checkbox [(ngModel)]="editForm.reforma_venta" [binary]="true" inputId="reforma_v" />
                        <label for="reforma_v" class="text-sm font-medium text-gray-700">Reformado</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <p-checkbox [(ngModel)]="editForm.aire_acondicionado_venta" [binary]="true" inputId="aire_v" />
                        <label for="aire_v" class="text-sm font-medium text-gray-700">A/A</label>
                    </div>
                </div>
            </div>
            <div class="flex justify-end gap-3 p-4 border-t border-gray-100">
                <button (click)="cerrarModal()"
                    class="px-5 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all">Cancelar</button>
                <button (click)="guardarEdicion()" [disabled]="guardando"
                    class="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 inline-flex items-center gap-2">
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
                <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Dirección</label>
                    <input pInputText type="text" [(ngModel)]="editForm.direccion_prop" class="w-full" placeholder="Dirección" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Nº</label>
                        <input pInputText type="text" [(ngModel)]="editForm.numero_prop" class="w-full" placeholder="Número" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Provincia</label>
                        <input pInputText type="text" [(ngModel)]="editForm.provincia_prop" class="w-full" placeholder="Provincia" />
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-4">
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Precio (€/mes)</label>
                        <p-inputNumber [(ngModel)]="editForm.precio_alquiler" [min]="0" [max]="999999" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Habitaciones</label>
                        <p-inputNumber [(ngModel)]="editForm.nro_habitaciones_prop" [min]="0" [max]="50" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Baños</label>
                        <p-inputNumber [(ngModel)]="editForm.nro_banos_prop" [min]="0" [max]="50" class="w-full" />
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Metros²</label>
                        <p-inputNumber [(ngModel)]="editForm.metros_prop" [min]="0" [max]="99999" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Planta</label>
                        <p-inputNumber [(ngModel)]="editForm.planta_prop" [min]="-5" [max]="200" class="w-full" />
                    </div>
                </div>
                <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción</label>
                    <textarea [(ngModel)]="editForm.descripcion_alquiler" rows="4" class="w-full p-3 border-2 border-gray-200 rounded-xl text-sm" placeholder="Descripción del alquiler"></textarea>
                </div>
                <div class="flex items-center gap-6">
                    <div class="flex items-center gap-2">
                        <p-checkbox [(ngModel)]="editForm.ascensor_prop" [binary]="true" inputId="ascensor_a" />
                        <label for="ascensor_a" class="text-sm font-medium text-gray-700">Ascensor</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <p-checkbox [(ngModel)]="editForm.permite_mascotas_alquiler" [binary]="true" inputId="mascotas" />
                        <label for="mascotas" class="text-sm font-medium text-gray-700">Mascotas</label>
                    </div>
                    <div class="flex items-center gap-2">
                        <p-checkbox [(ngModel)]="editForm.wifi_alquiler" [binary]="true" inputId="wifi" />
                        <label for="wifi" class="text-sm font-medium text-gray-700">WiFi</label>
                    </div>
                </div>
            </div>
            <div class="flex justify-end gap-3 p-4 border-t border-gray-100">
                <button (click)="cerrarModal()"
                    class="px-5 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all">Cancelar</button>
                <button (click)="guardarEdicion()" [disabled]="guardando"
                    class="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 inline-flex items-center gap-2">
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
    styles: [`
        :host ::ng-deep .p-inputnumber-input {
            width: 100% !important;
            padding: 0.75rem 1rem !important;
            background: #f8fafc !important;
            border: 2px solid #e2e8f0 !important;
            border-radius: 0.75rem !important;
            font-size: 0.875rem !important;
            font-weight: 500 !important;
            color: #1e293b !important;
            outline: none !important;
            transition: all 0.2s ease !important;
        }
        :host ::ng-deep .p-inputnumber-input:focus {
            border-color: #10b981 !important;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15) !important;
            background: #fff !important;
        }
        :host-context(.dark) :host ::ng-deep .p-inputnumber-input {
            background: rgba(51, 65, 85, 0.5) !important;
            border-color: #475569 !important;
            color: #f1f5f9 !important;
        }
        :host-context(.dark) :host ::ng-deep .p-inputnumber-input:focus {
            border-color: #10b981 !important;
            background: rgba(51, 65, 85, 0.8) !important;
        }
        :host ::ng-deep .p-dialog-header {
            background: linear-gradient(135deg, #10b981, #14b8a6) !important;
            color: white !important;
            font-weight: 800 !important;
            font-size: 1.1rem !important;
            padding: 1.25rem 1.5rem !important;
            border-radius: 12px 12px 0 0 !important;
        }
        :host ::ng-deep .p-dialog-content {
            padding: 0 !important;
        }
        :host ::ng-deep .p-dialog .p-dialog-header .p-dialog-header-icon {
            color: white !important;
        }
        :host-context(.dark) :host ::ng-deep .p-dialog-content {
            background: #1e293b !important;
        }
        :host-context(.dark) :host ::ng-deep .p-dialog .p-dialog-header {
            background: linear-gradient(135deg, #059669, #0d9488) !important;
        }
    `]
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

        this.inmuebleService
            .getVentasByUser(this.nroDocActual)
            .pipe(
                catchError((err) => {
                    ventasError = true;
                    return of([]);
                })
            )
                .subscribe({
                next: (data) => {
                    this.ventas = data || [];
                    if (this.ventas.length > 0) {
                        console.log('[Publicaciones] 🏠 VENTA - 1er elemento COMPLETO:', JSON.stringify(this.ventas[0], null, 2));
                        console.log('[Publicaciones] 🏠 VENTA - Keys del objeto:', Object.keys(this.ventas[0]));
                        console.log('[Publicaciones] 🏠 VENTA - nro_habitaciones_prop:', this.ventas[0].nro_habitaciones_prop);
                        console.log('[Publicaciones] 🏠 VENTA - precio_venta:', this.ventas[0].precio_venta);
                        console.log('[Publicaciones] 🏠 VENTA - nro_banos_prop:', this.ventas[0].nro_banos_prop);
                        console.log('[Publicaciones] 🏠 VENTA - id_prop:', this.ventas[0].id_prop);
                        console.log('[Publicaciones] 🏠 VENTA - fotos:', this.ventas[0].fotos);
                    } else {
                        console.warn('[Publicaciones] ⚠️ No hay ventas en la respuesta');
                    }
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

        this.inmuebleService
            .getAlquileresByUser(this.nroDocActual)
            .pipe(
                catchError((err) => {
                    alquileresError = true;
                    return of([]);
                })
            )
            .subscribe({
                next: (data) => {
                    this.alquileres = data || [];
                    if (this.alquileres.length > 0) {
                        console.log('[Publicaciones] 🔑 ALQUILER - 1er elemento COMPLETO:', JSON.stringify(this.alquileres[0], null, 2));
                        console.log('[Publicaciones] 🔑 ALQUILER - Keys del objeto:', Object.keys(this.alquileres[0]));
                        console.log('[Publicaciones] 🔑 ALQUILER - nro_habitaciones_prop:', this.alquileres[0].nro_habitaciones_prop);
                        console.log('[Publicaciones] 🔑 ALQUILER - precio_alquiler:', this.alquileres[0].precio_alquiler);
                    }
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

    getFotoPrincipal(pub: any): string {
        if (pub.foto_principal) {
            const url = pub.foto_principal;
            if (url && !url.startsWith('http') && !url.startsWith('/demo')) {
                return `http://localhost:8080/tupisoya/${url.replace(/^\//, '')}`;
            }
            return url;
        }
        if (pub.fotos && pub.fotos.length > 0) {
            const primeraFoto = pub.fotos[0];
            const url = typeof primeraFoto === 'string' ? primeraFoto : (primeraFoto.url_foto || '');
            if (url && !url.startsWith('http') && !url.startsWith('/demo')) {
                return `http://localhost:8080/tupisoya/${url.replace(/^\//, '')}`;
            }
            return url || '/demo/images/galleria/no_photo.png';
        }
        return '/demo/images/galleria/no_photo.png';
    }

    getDireccion(pub: any): string {
        return pub.direccion_fisica || pub.direccion_prop || 'Dirección no disponible';
    }

    onImgError(event: any) {
        event.target.src = '/demo/images/galleria/no_photo.png';
    }

    verAnuncio(pub: any, tipo: string) {
        const id = pub.id_prop;
        this.router.navigate(['/landing'], { queryParams: { detalle: id, tipo: tipo } });
    }

    abrirModalEditar(pub: any, tipo: 'venta' | 'alquiler') {
        this.editTipo = tipo;
        this.editId = pub.id_prop;
        // Cargar datos COMPLETOS desde el backend (como hace DetalleInmueble)
        if (tipo === 'venta') {
            this.inmuebleService.getVentaById(pub.id_prop).subscribe({
                next: (data: any) => {
                    this.editForm = { ...data };
                    this.modalVentaVisible = true;
                    this.cdr.detectChanges();
                },
                error: () => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos completos del inmueble.' });
                }
            });
        } else {
            this.inmuebleService.getAlquilerById(pub.id_prop).subscribe({
                next: (data: any) => {
                    this.editForm = { ...data };
                    this.modalAlquilerVisible = true;
                    this.cdr.detectChanges();
                },
                error: () => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los datos completos del inmueble.' });
                }
            });
        }
    }

    cerrarModal() {
        this.modalVentaVisible = false;
        this.modalAlquilerVisible = false;
        this.editForm = {};
        this.editId = null;
    }

    guardarEdicion() {
        if (!this.editId) return;
        this.guardando = true;

        // IMPORTANTE: SOLO snake_case porque el backend usa Jackson con snake_case
        const f = this.editForm;
        const payload: any = {
            type: this.editTipo,
            nro_doc_dueno: this.nroDocActual, // ← siempre del usuario logueado
            tipo_via_prop: f.tipo_via_prop || '',
            direccion_prop: f.direccion_prop || '',
            numero_prop: f.numero_prop || 0,
            planta_prop: f.planta_prop || 0,
            puerta_prop: f.puerta_prop || '',
            cp_prop: f.cp_prop || '',
            provincia_prop: f.provincia_prop || '',
            nro_catastral_prop: f.nro_catastral_prop || '',
            ascensor_prop: !!f.ascensor_prop,
            metros_prop: f.metros_prop || 0,
            anyo_construccion_prop: f.anyo_construccion_prop || 0,
            antiguedad_prop: f.antiguedad_prop || '',
            fecha_publicacion_prop: f.fecha_publicacion_prop || new Date().toISOString().split('T')[0]
        };

        if (this.editTipo === 'venta') {
            payload.nro_habitaciones_prop = f.nro_habitaciones_prop || 0;
            payload.nro_banos_prop = f.nro_banos_prop || 0;
            payload.descripcion_venta = f.descripcion_venta || '';
            payload.precio_venta = f.precio_venta || 0;
            payload.clase_energetica_venta = f.clase_energetica_venta || '';
            payload.balcon_venta = !!f.balcon_venta;
            payload.amueblada_venta = !!f.amueblada_venta;
            payload.garage_venta = !!f.garage_venta;
            payload.aire_acondicionado_venta = !!f.aire_acondicionado_venta;
            payload.libre_cargas_venta = !!f.libre_cargas_venta;
            payload.negociable_venta = !!f.negociable_venta;
            payload.reforma_venta = !!f.reforma_venta;

            console.log('[guardarEdicion] Payload venta:', JSON.stringify(payload));

            this.inmuebleService.updateVenta(this.editId, payload).subscribe({
                next: () => {
                    this.guardando = false;
                    this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Publicación actualizada correctamente.' });
                    this.cerrarModal();
                    this.cargarPublicaciones();
                },
                error: (err) => {
                    this.guardando = false;
                    console.error('[guardarEdicion] Error al actualizar venta:', err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la publicación.' });
                }
            });
        } else {
            payload.nro_habitaciones_prop = f.nro_habitaciones_prop || 0;
            payload.nro_banos_prop = f.nro_banos_prop || 0;
            payload.descripcion_alquiler = f.descripcion_alquiler || '';
            payload.precio_alquiler = f.precio_alquiler || 0;
            payload.fianza_alquiler = f.fianza_alquiler || 0;
            payload.nro_personas_alquiler = f.nro_personas_alquiler || 0;
            payload.permite_mascotas_alquiler = !!f.permite_mascotas_alquiler;
            payload.wifi_alquiler = !!f.wifi_alquiler;

            console.log('[guardarEdicion] Payload alquiler:', JSON.stringify(payload));

            this.inmuebleService.updateAlquiler(this.editId, payload).subscribe({
                next: () => {
                    this.guardando = false;
                    this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Publicación actualizada correctamente.' });
                    this.cerrarModal();
                    this.cargarPublicaciones();
                },
                error: (err) => {
                    this.guardando = false;
                    console.error('[guardarEdicion] Error al actualizar alquiler:', err);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la publicación.' });
                }
            });
        }
    }

    confirmarEliminar(pub: any, tipo: string) {
        const id = pub.id_prop;
        this.confirmationService.confirm({
            message: `¿Estás seguro de eliminar esta publicación de ${tipo}?`,
            header: 'Eliminar publicación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (tipo === 'venta') {
                    this.inmuebleService.deleteVenta(id).subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Publicación eliminada correctamente.' });
                            this.cargarPublicaciones();
                        },
                        error: () => {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la publicación.' });
                        }
                    });
                } else {
                    this.inmuebleService.deleteAlquiler(id).subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Publicación eliminada correctamente.' });
                            this.cargarPublicaciones();
                        },
                        error: () => {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la publicación.' });
                        }
                    });
                }
            }
        });
    }
}
