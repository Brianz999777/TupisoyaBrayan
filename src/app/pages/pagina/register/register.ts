import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../service/auth.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NotificacionService } from '../../service/notificacion.service';
import {RegisterRequest} from '../../interfaces/register';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    RouterModule,
    RippleModule,
    ReactiveFormsModule,
    TabsModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 relative overflow-hidden p-4 py-8">
      <!-- Background decoration -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute w-[600px] h-[600px] bg-emerald-200/20 dark:bg-emerald-500/5 rounded-full blur-3xl -top-48 -right-32"></div>
        <div class="absolute w-[500px] h-[500px] bg-teal-200/20 dark:bg-teal-500/5 rounded-full blur-3xl -bottom-48 -left-32"></div>
      </div>

      <div class="relative z-10 w-full max-w-[680px]">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 shadow-xl shadow-emerald-500/5 border border-gray-100 dark:border-gray-700">
          <!-- Logo -->
          <div class="flex items-center justify-center gap-3 mb-6">
            <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <i class="pi pi-home text-lg text-white"></i>
            </div>
            <span class="text-2xl font-black text-gray-900 dark:text-white">TuPisoYa</span>
          </div>

          <div class="text-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Crea tu cuenta</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">Únete a TuPisoYa y empieza a gestionar propiedades</p>
          </div>

          <!-- Error message from backend -->
          @if (errorMsg) {
            <div class="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 mb-5">
              <i class="pi pi-exclamation-triangle text-sm flex-shrink-0"></i>
              <span>{{ errorMsg }}</span>
            </div>
          }

          <form [formGroup]="formRegister" (submit)="register()" class="space-y-5">
            <!-- Tipo de persona tabs -->
            <p-tabs [(value)]="activeTab" styleClass="register-tabs">
              <p-tablist>
                <p-tab value="0">Persona Natural</p-tab>
                <p-tab value="1">Persona Jurídica</p-tab>
              </p-tablist>
              <p-tabpanels>
                <!-- Persona Natural -->
                <p-tabpanel value="0">
                  <div class="space-y-4 pt-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</label>
                        <input pInputText type="text" placeholder="Tus nombres"
                          class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400"
                          formControlName="nombrePer"
                          [ngClass]="{ '!border-red-400 !bg-red-50 dark:!bg-red-900/20': f['nombrePer'].invalid && (f['nombrePer'].dirty || f['nombrePer'].touched) }" />
                        @if (f['nombrePer'].invalid && (f['nombrePer'].dirty || f['nombrePer'].touched)) {
                          <div class="flex items-center gap-1 text-xs font-semibold text-red-500"><i class="pi pi-exclamation-circle text-[10px]"></i> El nombre es obligatorio</div>
                        }
                      </div>
                      <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Apellido Paterno</label>
                        <input pInputText type="text" placeholder="Apellido paterno"
                          class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400"
                          formControlName="apellidoPatPer"
                          [ngClass]="{ '!border-red-400 !bg-red-50 dark:!bg-red-900/20': f['apellidoPatPer'].invalid && (f['apellidoPatPer'].dirty || f['apellidoPatPer'].touched) }" />
                        @if (f['apellidoPatPer'].invalid && (f['apellidoPatPer'].dirty || f['apellidoPatPer'].touched)) {
                          <div class="flex items-center gap-1 text-xs font-semibold text-red-500"><i class="pi pi-exclamation-circle text-[10px]"></i> El apellido paterno es obligatorio</div>
                        }
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Apellido Materno</label>
                        <input pInputText type="text" placeholder="Apellido materno"
                          class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400"
                          formControlName="apellidoMatPer" />
                      </div>
                      <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sexo</label>
                        <div class="flex gap-6 pt-2">
                          <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value="M" formControlName="sexoPer" id="sexo_m" class="accent-emerald-500" />
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Masculino</span>
                          </label>
                          <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value="F" formControlName="sexoPer" id="sexo_f" class="accent-emerald-500" />
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Femenino</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Año de Nacimiento</label>
                        <input pInputText type="number" placeholder="Ej. 1990"
                          class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400"
                          formControlName="anioNacPer"
                          [ngClass]="{ '!border-red-400 !bg-red-50 dark:!bg-red-900/20': f['anioNacPer'].invalid && (f['anioNacPer'].dirty || f['anioNacPer'].touched) }" />
                        @if (f['anioNacPer'].invalid && (f['anioNacPer'].dirty || f['anioNacPer'].touched)) {
                          <div class="flex items-center gap-1 text-xs font-semibold text-red-500"><i class="pi pi-exclamation-circle text-[10px]"></i> El año es obligatorio</div>
                        }
                      </div>
                      <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ingresos Aprox. (€)</label>
                        <input pInputText type="number" placeholder="2500"
                          class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400"
                          formControlName="ingresosAproxNatu" />
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <p-checkbox formControlName="primerViviendaNatu" id="primerVivienda" binary></p-checkbox>
                      <label for="primerVivienda" class="text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer">¿Es tu primera vivienda?</label>
                    </div>
                  </div>
                </p-tabpanel>

                <!-- Persona Jurídica -->
                <p-tabpanel value="1">
                  <div class="space-y-4 pt-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Razón Social</label>
                        <input pInputText type="text" placeholder="Nombre de la empresa"
                          class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400"
                          formControlName="nombrePer"
                          [ngClass]="{ '!border-red-400 !bg-red-50 dark:!bg-red-900/20': f['nombrePer'].invalid && (f['nombrePer'].dirty || f['nombrePer'].touched) }" />
                        @if (f['nombrePer'].invalid && (f['nombrePer'].dirty || f['nombrePer'].touched)) {
                          <div class="flex items-center gap-1 text-xs font-semibold text-red-500"><i class="pi pi-exclamation-circle text-[10px]"></i> La razón social es obligatoria</div>
                        }
                      </div>
                      <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cargo</label>
                        <input pInputText type="text" placeholder="Tu cargo en la empresa"
                          class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400"
                          formControlName="cargoJuri"
                          [ngClass]="{ '!border-red-400 !bg-red-50 dark:!bg-red-900/20': f['cargoJuri'].invalid && (f['cargoJuri'].dirty || f['cargoJuri'].touched) }" />
                        @if (f['cargoJuri'].invalid && (f['cargoJuri'].dirty || f['cargoJuri'].touched)) {
                          <div class="flex items-center gap-1 text-xs font-semibold text-red-500"><i class="pi pi-exclamation-circle text-[10px]"></i> El cargo es obligatorio</div>
                        }
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre Representante</label>
                        <input pInputText type="text" placeholder="Nombre completo"
                          class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400"
                          formControlName="nombreRepresentanteJuri"
                          [ngClass]="{ '!border-red-400 !bg-red-50 dark:!bg-red-900/20': f['nombreRepresentanteJuri'].invalid && (f['nombreRepresentanteJuri'].dirty || f['nombreRepresentanteJuri'].touched) }" />
                        @if (f['nombreRepresentanteJuri'].invalid && (f['nombreRepresentanteJuri'].dirty || f['nombreRepresentanteJuri'].touched)) {
                          <div class="flex items-center gap-1 text-xs font-semibold text-red-500"><i class="pi pi-exclamation-circle text-[10px]"></i> El nombre del representante es obligatorio</div>
                        }
                      </div>
                      <div class="flex flex-col gap-1.5">
                        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Registro Mercantil</label>
                        <input pInputText type="text" placeholder="Número de registro"
                          class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400"
                          formControlName="registroMercantilJuri"
                          [ngClass]="{ '!border-red-400 !bg-red-50 dark:!bg-red-900/20': f['registroMercantilJuri'].invalid && (f['registroMercantilJuri'].dirty || f['registroMercantilJuri'].touched) }" />
                        @if (f['registroMercantilJuri'].invalid && (f['registroMercantilJuri'].dirty || f['registroMercantilJuri'].touched)) {
                          <div class="flex items-center gap-1 text-xs font-semibold text-red-500"><i class="pi pi-exclamation-circle text-[10px]"></i> El registro mercantil es obligatorio</div>
                        }
                      </div>
                    </div>
                  </div>
                </p-tabpanel>
              </p-tabpanels>
            </p-tabs>

            <!-- Common fields section -->
            <div class="flex items-center gap-4">
              <span class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></span>
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Información de contacto y domicilio</span>
              <span class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ activeTab === '0' ? 'DNI' : 'RUC / Identificación' }}</label>
                <input pInputText type="text" [placeholder]="activeTab === '0' ? 'Número de DNI' : 'Número de RUC'"
                  class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400"
                  formControlName="nroDocPer"
                  [ngClass]="{ '!border-red-400 !bg-red-50 dark:!bg-red-900/20': f['nroDocPer'].invalid && (f['nroDocPer'].dirty || f['nroDocPer'].touched) }" />
                @if (f['nroDocPer'].invalid && (f['nroDocPer'].dirty || f['nroDocPer'].touched)) {
                  <div class="flex items-center gap-1 text-xs font-semibold text-red-500"><i class="pi pi-exclamation-circle text-[10px]"></i> El documento es obligatorio</div>
                }
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Domicilio</label>
                <input pInputText type="text" placeholder="Calle, número, departamento"
                  class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400"
                  formControlName="domicilioPer"
                  [ngClass]="{ '!border-red-400 !bg-red-50 dark:!bg-red-900/20': f['domicilioPer'].invalid && (f['domicilioPer'].dirty || f['domicilioPer'].touched) }" />
                @if (f['domicilioPer'].invalid && (f['domicilioPer'].dirty || f['domicilioPer'].touched)) {
                  <div class="flex items-center gap-1 text-xs font-semibold text-red-500"><i class="pi pi-exclamation-circle text-[10px]"></i> El domicilio es obligatorio</div>
                }
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Código Postal</label>
                <input pInputText type="text" placeholder="Ej. 1000"
                  class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400"
                  formControlName="cpPer"
                  [ngClass]="{ '!border-red-400 !bg-red-50 dark:!bg-red-900/20': f['cpPer'].invalid && (f['cpPer'].dirty || f['cpPer'].touched) }" />
                @if (f['cpPer'].invalid && (f['cpPer'].dirty || f['cpPer'].touched)) {
                  <div class="flex items-center gap-1 text-xs font-semibold text-red-500"><i class="pi pi-exclamation-circle text-[10px]"></i> El CP es obligatorio</div>
                }
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provincia</label>
                <input pInputText type="text" placeholder="Ej. Lima"
                  class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400"
                  formControlName="provinciaPer"
                  [ngClass]="{ '!border-red-400 !bg-red-50 dark:!bg-red-900/20': f['provinciaPer'].invalid && (f['provinciaPer'].dirty || f['provinciaPer'].touched) }" />
                @if (f['provinciaPer'].invalid && (f['provinciaPer'].dirty || f['provinciaPer'].touched)) {
                  <div class="flex items-center gap-1 text-xs font-semibold text-red-500"><i class="pi pi-exclamation-circle text-[10px]"></i> La provincia es obligatoria</div>
                }
              </div>
            </div>

            <div class="flex items-center gap-4">
              <span class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></span>
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Credenciales de acceso</span>
              <span class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></span>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Correo electrónico</label>
              <input pInputText type="email" placeholder="tu@email.com"
                class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400"
                formControlName="email"
                [ngClass]="{ '!border-red-400 !bg-red-50 dark:!bg-red-900/20': f['email'].invalid && (f['email'].dirty || f['email'].touched) }" />
              @if (f['email'].invalid && (f['email'].dirty || f['email'].touched)) {
                <div class="flex items-center gap-1 text-xs font-semibold text-red-500">
                  @if (f['email'].errors?.['required']) { <span><i class="pi pi-exclamation-circle text-[10px]"></i> El correo es obligatorio</span> }
                  @if (f['email'].errors?.['email']) { <span><i class="pi pi-exclamation-circle text-[10px]"></i> Formato no válido</span> }
                </div>
              }
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contraseña</label>
                <p-password
                  formControlName="password"
                  placeholder="Mínimo 8 caracteres"
                  [toggleMask]="true"
                  [feedback]="true"
                  styleClass="w-full"
                  [fluid]="true"
                ></p-password>
                @if (f['password'].invalid && (f['password'].dirty || f['password'].touched)) {
                  <div class="flex items-center gap-1 text-xs font-semibold text-red-500">
                    @if (f['password'].errors?.['required']) { <span><i class="pi pi-exclamation-circle text-[10px]"></i> La contraseña es obligatoria</span> }
                    @if (f['password'].errors?.['minlength']) { <span><i class="pi pi-exclamation-circle text-[10px]"></i> Mínimo 8 caracteres</span> }
                  </div>
                }
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Confirmar contraseña</label>
                <p-password
                  formControlName="confirmPassword"
                  placeholder="Repite la contraseña"
                  [toggleMask]="true"
                  [feedback]="false"
                  styleClass="w-full"
                  [fluid]="true"
                ></p-password>
                @if (f['confirmPassword'].errors?.['required'] && (f['confirmPassword'].dirty || f['confirmPassword'].touched)) {
                  <div class="flex items-center gap-1 text-xs font-semibold text-red-500"><i class="pi pi-exclamation-circle text-[10px]"></i> Debes confirmar la contraseña</div>
                }
                @if (formRegister.errors?.['mismatch'] && f['confirmPassword'].touched) {
                  <div class="flex items-center gap-1 text-xs font-semibold text-red-500"><i class="pi pi-exclamation-circle text-[10px]"></i> Las contraseñas no coinciden</div>
                }
              </div>
            </div>

            <!-- Submit -->
            <button pButton
              [label]="submitting ? 'Creando cuenta...' : 'Crear cuenta'"
              icon="pi pi-user-plus"
              iconPos="right"
              class="!w-full !py-3.5 !bg-gradient-to-r !from-emerald-500 !to-teal-500 !text-white !font-semibold !rounded-xl !border-0 hover:!from-emerald-600 hover:!to-teal-600 !transition-all !shadow-lg !shadow-emerald-500/25"
              type="submit"
              [disabled]="submitting"
              [loading]="submitting">
            </button>

            <!-- Login link -->
            <div class="text-center flex items-center justify-center gap-1.5 pt-1">
              <span class="text-sm text-gray-500 dark:text-gray-400">¿Ya tienes una cuenta?</span>
              <a routerLink="/login" class="text-sm font-bold text-emerald-500 hover:text-emerald-600 transition-colors">Inicia sesión</a>
            </div>
          </form>
        </div>
      </div>
    </div>

    <p-toast position="top-center"></p-toast>
  `,
  styles: [`
    :host ::ng-deep .p-password input {
      width: 100% !important;
      padding: 0.65rem 0.9rem !important;
      border: 2px solid #e2e8f0 !important;
      border-radius: 0.75rem !important;
      font-size: 0.9rem !important;
      font-weight: 500 !important;
      background: #f8fafc !important;
      color: #111827 !important;
      outline: none !important;
      transition: all 0.2s ease !important;
    }
    :host ::ng-deep .p-password input:focus {
      border-color: #10b981 !important;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15) !important;
      background: #fff !important;
    }
    :host-context(.dark) :host ::ng-deep .p-password input {
      background: rgba(55, 65, 81, 0.5) !important;
      border-color: #4b5563 !important;
      color: #f3f4f6 !important;
    }
    :host-context(.dark) :host ::ng-deep .p-password input:focus {
      border-color: #10b981 !important;
      background: #374151 !important;
    }
    :host ::ng-deep .p-password .p-password-toggle-icon {
      color: #9ca3af !important;
    }
    :host ::ng-deep .p-password.p-fluid .p-password-input {
      width: 100% !important;
    }
    :host ::ng-deep .p-checkbox .p-checkbox-box {
      border-radius: 6px !important;
      border: 2px solid #d1d5db !important;
      width: 18px !important;
      height: 18px !important;
    }
    :host ::ng-deep .p-checkbox.p-highlight .p-checkbox-box {
      background: #10b981 !important;
      border-color: #10b981 !important;
    }
    :host-context(.dark) :host ::ng-deep .p-checkbox .p-checkbox-box {
      border-color: #6b7280 !important;
    }
    :host ::ng-deep .register-tabs .p-tablist {
      background: #f1f5f9 !important;
      border-radius: 12px !important;
      padding: 0.25rem !important;
    }
    :host ::ng-deep .register-tabs .p-tab {
      border-radius: 10px !important;
      font-weight: 700 !important;
      font-size: 0.85rem !important;
      padding: 0.6rem 1.5rem !important;
      color: #64748b !important;
      transition: all 0.2s !important;
    }
    :host ::ng-deep .register-tabs .p-tab[data-p-active="true"] {
      background: #fff !important;
      color: #111827 !important;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important;
    }
    :host-context(.dark) :host ::ng-deep .register-tabs .p-tablist {
      background: #0f172a !important;
    }
    :host-context(.dark) :host ::ng-deep .register-tabs .p-tab {
      color: #64748b !important;
    }
    :host-context(.dark) :host ::ng-deep .register-tabs .p-tab[data-p-active="true"] {
      background: #1e293b !important;
      color: #f1f5f9 !important;
    }
  `]
})
export class Register {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(Auth);
  private messageService = inject(MessageService);

  formRegister: FormGroup;
  submitting = false;
  errorMsg = '';

  get activeTab(): string { return this._activeTab; }
  set activeTab(value: string) {
    this._activeTab = value;
    this.updateValidators();
  }
  private _activeTab: string = '0';

  // Getter para acceder a los controles más fácilmente en el template
  get f() { return this.formRegister.controls; }

  constructor() {
    this.formRegister = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],

      nroDocPer: ['', Validators.required],
      nombrePer: ['', Validators.required],
      apellidoPatPer: ['', Validators.required],
      apellidoMatPer: [''],
      sexoPer: ['M'],
      anioNacPer: [1990, Validators.required],
      domicilioPer: ['', Validators.required],
      cpPer: ['', Validators.required],
      provinciaPer: ['', Validators.required],

      primerViviendaNatu: [false],
      ingresosAproxNatu: [0],

      cargoJuri: [''],
      nombreRepresentanteJuri: [''],
      registroMercantilJuri: ['']
    }, { validators: this.passwordMatchValidator });

    this.updateValidators();
  }

  updateValidators() {
    const cargo = this.formRegister.get('cargoJuri');
    const representante = this.formRegister.get('nombreRepresentanteJuri');
    const mercantil = this.formRegister.get('registroMercantilJuri');
    const apellido = this.formRegister.get('apellidoPatPer');

    if (this.activeTab === '1') {
      cargo?.setValidators([Validators.required]);
      representante?.setValidators([Validators.required]);
      mercantil?.setValidators([Validators.required]);
      apellido?.clearValidators();
    } else {
      cargo?.clearValidators();
      representante?.clearValidators();
      mercantil?.clearValidators();
      apellido?.setValidators([Validators.required]);
    }

    cargo?.updateValueAndValidity();
    representante?.updateValueAndValidity();
    mercantil?.updateValueAndValidity();
    apellido?.updateValueAndValidity();
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  register() {
    this.errorMsg = '';

    if (this.formRegister.invalid || this.submitting) {
      this.formRegister.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const formValues = this.formRegister.value;

    // Construir el objeto persona con snake_case (coincide con los DTOs de Spring)
    const personaBase: any = {
      type: this.activeTab === '0' ? 'natural' : 'juridica',
      nro_doc_per: formValues.nroDocPer,
      tipo_doc_per: this.activeTab === '0' ? 'DNI' : 'RUC',
      nombre_per: formValues.nombrePer,
      apellido_pat_per: this.activeTab === '0' ? formValues.apellidoPatPer : 'N/A',
      apellido_mat_per: this.activeTab === '0' ? formValues.apellidoMatPer : 'N/A',
      sexo_per: formValues.sexoPer,
      anio_nac_per: formValues.anioNacPer,
      domicilio_per: formValues.domicilioPer,
      cp_per: formValues.cpPer,
      provincia_per: formValues.provinciaPer
    };

    if (this.activeTab === '0') {
      // PersonaNatural
      personaBase.primer_vivienda_natu = formValues.primerViviendaNatu;
      personaBase.ingresos_aprox_natu = formValues.ingresosAproxNatu;
    } else {
      // PersonaJuridica
      personaBase.cargo_juri = formValues.cargoJuri;
      personaBase.nombre_representante_juri = formValues.nombreRepresentanteJuri;
      personaBase.registro_mercantil_juri = formValues.registroMercantilJuri;
    }

    const registerRequest: any = {
      email: formValues.email,
      password: formValues.password,
      estado_usu: 'ACTIVO',
      rol: 'USER',
      persona: personaBase
    };

    console.log('[Register] JSON enviado:', JSON.stringify(registerRequest, null, 2));

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        console.log('[Register] Respuesta del servidor:', response);
        this.submitting = false;
        this.messageService.add({
          severity: 'success',
          summary: '¡Registro exitoso!',
          detail: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
          life: 3000
        });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (error: any) => {
        this.submitting = false;
        console.error('[Register] Error completo:', error);
        console.error('[Register] Error body:', error.error);

        const backendMsg = error.error?.message || error.error?.error || '';
        if (error.status === 409) {
          this.errorMsg = backendMsg || 'El correo electrónico ya está registrado.';
        } else if (error.status === 400) {
          this.errorMsg = backendMsg || 'Datos inválidos. Revisa los campos e intenta de nuevo.';
        } else if (error.status === 0) {
          this.errorMsg = 'No se pudo conectar con el servidor. Intenta de nuevo.';
        } else {
          this.errorMsg = backendMsg || 'Error al registrarse. Intenta de nuevo.';
        }
      }
    });
  }
}
