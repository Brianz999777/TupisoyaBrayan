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
    <div class="register-page">
      <!-- Background decoration -->
      <div class="register-bg">
        <div class="bg-circle bg-circle-1"></div>
        <div class="bg-circle bg-circle-2"></div>
        <div class="bg-circle bg-circle-3"></div>
      </div>

      <div class="register-container">
        <div class="register-card">
          <!-- Logo -->
          <div class="register-logo">
            <div class="logo-icon">
              <i class="pi pi-home"></i>
            </div>
            <h1 class="logo-text">TuPisoYa</h1>
          </div>

          <div class="register-header">
            <h2 class="register-title">Crea tu cuenta</h2>
            <p class="register-subtitle">Únete a TuPisoYa y empieza a gestionar propiedades</p>
          </div>

          <!-- Error message from backend -->
          @if (errorMsg) {
            <div class="register-error">
              <i class="pi pi-exclamation-triangle"></i>
              <span>{{ errorMsg }}</span>
            </div>
          }

          <form [formGroup]="formRegister" (submit)="register()" class="register-form">
            <!-- Tipo de persona tabs -->
            <p-tabs [(value)]="activeTab" styleClass="register-tabs">
              <p-tablist>
                <p-tab value="0">Persona Natural</p-tab>
                <p-tab value="1">Persona Jurídica</p-tab>
              </p-tablist>
              <p-tabpanels>
                <!-- Persona Natural -->
                <p-tabpanel value="0">
                  <div class="tab-content">
                    <div class="form-row">
                      <div class="field">
                        <label class="field-label">Nombre</label>
                        <input pInputText type="text" placeholder="Tus nombres" class="field-input" formControlName="nombrePer"
                          [ngClass]="{ 'field-error': f['nombrePer'].invalid && (f['nombrePer'].dirty || f['nombrePer'].touched) }" />
                        @if (f['nombrePer'].invalid && (f['nombrePer'].dirty || f['nombrePer'].touched)) {
                          <div class="field-msg error"><i class="pi pi-exclamation-circle"></i> El nombre es obligatorio</div>
                        }
                      </div>
                      <div class="field">
                        <label class="field-label">Apellido Paterno</label>
                        <input pInputText type="text" placeholder="Apellido paterno" class="field-input" formControlName="apellidoPatPer"
                          [ngClass]="{ 'field-error': f['apellidoPatPer'].invalid && (f['apellidoPatPer'].dirty || f['apellidoPatPer'].touched) }" />
                        @if (f['apellidoPatPer'].invalid && (f['apellidoPatPer'].dirty || f['apellidoPatPer'].touched)) {
                          <div class="field-msg error"><i class="pi pi-exclamation-circle"></i> El apellido paterno es obligatorio</div>
                        }
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="field">
                        <label class="field-label">Apellido Materno</label>
                        <input pInputText type="text" placeholder="Apellido materno" class="field-input" formControlName="apellidoMatPer" />
                      </div>
                      <div class="field">
                        <label class="field-label">Sexo</label>
                        <div class="radio-group">
                          <div class="radio-option">
                            <input type="radio" value="M" formControlName="sexoPer" id="sexo_m" />
                            <label for="sexo_m">Masculino</label>
                          </div>
                          <div class="radio-option">
                            <input type="radio" value="F" formControlName="sexoPer" id="sexo_f" />
                            <label for="sexo_f">Femenino</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="field">
                        <label class="field-label">Año de Nacimiento</label>
                        <input pInputText type="number" placeholder="Ej. 1990" class="field-input" formControlName="anioNacPer"
                          [ngClass]="{ 'field-error': f['anioNacPer'].invalid && (f['anioNacPer'].dirty || f['anioNacPer'].touched) }" />
                        @if (f['anioNacPer'].invalid && (f['anioNacPer'].dirty || f['anioNacPer'].touched)) {
                          <div class="field-msg error"><i class="pi pi-exclamation-circle"></i> El año es obligatorio</div>
                        }
                      </div>
                      <div class="field">
                        <label class="field-label">Ingresos Aprox. (€)</label>
                        <input pInputText type="number" placeholder="2500" class="field-input" formControlName="ingresosAproxNatu" />
                      </div>
                    </div>
                    <div class="checkbox-row">
                      <p-checkbox formControlName="primerViviendaNatu" id="primerVivienda" binary></p-checkbox>
                      <label for="primerVivienda" class="checkbox-label">¿Es tu primera vivienda?</label>
                    </div>
                  </div>
                </p-tabpanel>

                <!-- Persona Jurídica -->
                <p-tabpanel value="1">
                  <div class="tab-content">
                    <div class="form-row">
                      <div class="field">
                        <label class="field-label">Razón Social</label>
                        <input pInputText type="text" placeholder="Nombre de la empresa" class="field-input" formControlName="nombrePer"
                          [ngClass]="{ 'field-error': f['nombrePer'].invalid && (f['nombrePer'].dirty || f['nombrePer'].touched) }" />
                        @if (f['nombrePer'].invalid && (f['nombrePer'].dirty || f['nombrePer'].touched)) {
                          <div class="field-msg error"><i class="pi pi-exclamation-circle"></i> La razón social es obligatoria</div>
                        }
                      </div>
                      <div class="field">
                        <label class="field-label">Cargo</label>
                        <input pInputText type="text" placeholder="Tu cargo en la empresa" class="field-input" formControlName="cargoJuri"
                          [ngClass]="{ 'field-error': f['cargoJuri'].invalid && (f['cargoJuri'].dirty || f['cargoJuri'].touched) }" />
                        @if (f['cargoJuri'].invalid && (f['cargoJuri'].dirty || f['cargoJuri'].touched)) {
                          <div class="field-msg error"><i class="pi pi-exclamation-circle"></i> El cargo es obligatorio</div>
                        }
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="field">
                        <label class="field-label">Nombre Representante</label>
                        <input pInputText type="text" placeholder="Nombre completo" class="field-input" formControlName="nombreRepresentanteJuri"
                          [ngClass]="{ 'field-error': f['nombreRepresentanteJuri'].invalid && (f['nombreRepresentanteJuri'].dirty || f['nombreRepresentanteJuri'].touched) }" />
                        @if (f['nombreRepresentanteJuri'].invalid && (f['nombreRepresentanteJuri'].dirty || f['nombreRepresentanteJuri'].touched)) {
                          <div class="field-msg error"><i class="pi pi-exclamation-circle"></i> El nombre del representante es obligatorio</div>
                        }
                      </div>
                      <div class="field">
                        <label class="field-label">Registro Mercantil</label>
                        <input pInputText type="text" placeholder="Número de registro" class="field-input" formControlName="registroMercantilJuri"
                          [ngClass]="{ 'field-error': f['registroMercantilJuri'].invalid && (f['registroMercantilJuri'].dirty || f['registroMercantilJuri'].touched) }" />
                        @if (f['registroMercantilJuri'].invalid && (f['registroMercantilJuri'].dirty || f['registroMercantilJuri'].touched)) {
                          <div class="field-msg error"><i class="pi pi-exclamation-circle"></i> El registro mercantil es obligatorio</div>
                        }
                      </div>
                    </div>
                  </div>
                </p-tabpanel>
              </p-tabpanels>
            </p-tabs>

            <!-- Common fields section -->
            <div class="section-divider">
              <span class="section-divider-line"></span>
              <span class="section-divider-text">Información de contacto y domicilio</span>
              <span class="section-divider-line"></span>
            </div>

            <div class="form-row">
              <div class="field">
                <label class="field-label">{{ activeTab === '0' ? 'DNI' : 'RUC / Identificación' }}</label>
                <input pInputText type="text" [placeholder]="activeTab === '0' ? 'Número de DNI' : 'Número de RUC'" class="field-input" formControlName="nroDocPer"
                  [ngClass]="{ 'field-error': f['nroDocPer'].invalid && (f['nroDocPer'].dirty || f['nroDocPer'].touched) }" />
                @if (f['nroDocPer'].invalid && (f['nroDocPer'].dirty || f['nroDocPer'].touched)) {
                  <div class="field-msg error"><i class="pi pi-exclamation-circle"></i> El documento es obligatorio</div>
                }
              </div>
              <div class="field">
                <label class="field-label">Domicilio</label>
                <input pInputText type="text" placeholder="Calle, número, departamento" class="field-input" formControlName="domicilioPer"
                  [ngClass]="{ 'field-error': f['domicilioPer'].invalid && (f['domicilioPer'].dirty || f['domicilioPer'].touched) }" />
                @if (f['domicilioPer'].invalid && (f['domicilioPer'].dirty || f['domicilioPer'].touched)) {
                  <div class="field-msg error"><i class="pi pi-exclamation-circle"></i> El domicilio es obligatorio</div>
                }
              </div>
            </div>

            <div class="form-row">
              <div class="field">
                <label class="field-label">Código Postal</label>
                <input pInputText type="text" placeholder="Ej. 1000" class="field-input" formControlName="cpPer"
                  [ngClass]="{ 'field-error': f['cpPer'].invalid && (f['cpPer'].dirty || f['cpPer'].touched) }" />
                @if (f['cpPer'].invalid && (f['cpPer'].dirty || f['cpPer'].touched)) {
                  <div class="field-msg error"><i class="pi pi-exclamation-circle"></i> El CP es obligatorio</div>
                }
              </div>
              <div class="field">
                <label class="field-label">Provincia</label>
                <input pInputText type="text" placeholder="Ej. Lima" class="field-input" formControlName="provinciaPer"
                  [ngClass]="{ 'field-error': f['provinciaPer'].invalid && (f['provinciaPer'].dirty || f['provinciaPer'].touched) }" />
                @if (f['provinciaPer'].invalid && (f['provinciaPer'].dirty || f['provinciaPer'].touched)) {
                  <div class="field-msg error"><i class="pi pi-exclamation-circle"></i> La provincia es obligatoria</div>
                }
              </div>
            </div>

            <div class="section-divider">
              <span class="section-divider-line"></span>
              <span class="section-divider-text">Credenciales de acceso</span>
              <span class="section-divider-line"></span>
            </div>

            <div class="field">
              <label class="field-label">
                <i class="pi pi-envelope"></i>
                Correo electrónico
              </label>
              <input pInputText type="email" placeholder="tu@email.com" class="field-input" formControlName="email"
                [ngClass]="{ 'field-error': f['email'].invalid && (f['email'].dirty || f['email'].touched) }" />
              @if (f['email'].invalid && (f['email'].dirty || f['email'].touched)) {
                <div class="field-msg error">
                  @if (f['email'].errors?.['required']) { <span><i class="pi pi-exclamation-circle"></i> El correo es obligatorio</span> }
                  @if (f['email'].errors?.['email']) { <span><i class="pi pi-exclamation-circle"></i> Formato no válido</span> }
                </div>
              }
            </div>

            <div class="form-row">
              <div class="field">
                <label class="field-label">
                  <i class="pi pi-lock"></i>
                  Contraseña
                </label>
                <p-password
                  formControlName="password"
                  placeholder="Mínimo 8 caracteres"
                  [toggleMask]="true"
                  [feedback]="true"
                  styleClass="w-full"
                  [fluid]="true"
                  [ngClass]="{ 'field-error': f['password'].invalid && (f['password'].dirty || f['password'].touched) }"
                ></p-password>
                @if (f['password'].invalid && (f['password'].dirty || f['password'].touched)) {
                  <div class="field-msg error">
                    @if (f['password'].errors?.['required']) { <span><i class="pi pi-exclamation-circle"></i> La contraseña es obligatoria</span> }
                    @if (f['password'].errors?.['minlength']) { <span><i class="pi pi-exclamation-circle"></i> Mínimo 8 caracteres</span> }
                  </div>
                }
              </div>
              <div class="field">
                <label class="field-label">
                  <i class="pi pi-lock"></i>
                  Confirmar contraseña
                </label>
                <p-password
                  formControlName="confirmPassword"
                  placeholder="Repite la contraseña"
                  [toggleMask]="true"
                  [feedback]="false"
                  styleClass="w-full"
                  [fluid]="true"
                  [ngClass]="{ 'field-error': (f['confirmPassword'].invalid || formRegister.errors?.['mismatch']) && (f['confirmPassword'].dirty || f['confirmPassword'].touched) }"
                ></p-password>
                @if (f['confirmPassword'].errors?.['required'] && (f['confirmPassword'].dirty || f['confirmPassword'].touched)) {
                  <div class="field-msg error"><i class="pi pi-exclamation-circle"></i> Debes confirmar la contraseña</div>
                }
                @if (formRegister.errors?.['mismatch'] && f['confirmPassword'].touched) {
                  <div class="field-msg error"><i class="pi pi-exclamation-circle"></i> Las contraseñas no coinciden</div>
                }
              </div>
            </div>

            <!-- Submit -->
            <button pButton
              [label]="submitting ? 'Creando cuenta...' : 'Crear cuenta'"
              icon="pi pi-user-plus"
              iconPos="right"
              class="register-btn"
              type="submit"
              [disabled]="submitting"
              [loading]="submitting">
            </button>

            <!-- Login link -->
            <div class="register-footer">
              <span class="footer-text">¿Ya tienes una cuenta?</span>
              <a routerLink="/login" class="footer-link">Inicia sesión</a>
            </div>
          </form>
        </div>
      </div>
    </div>

    <p-toast position="top-center"></p-toast>
  `,
  styles: [`
    /* ============================================
       REGISTER PAGE - Estilo moderno
       ============================================ */

    .register-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      position: relative;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 2rem 0;
    }

    .register-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .bg-circle {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.12;
    }

    .bg-circle-1 { width: 600px; height: 600px; background: #D4E157; top: -200px; right: -100px; }
    .bg-circle-2 { width: 400px; height: 400px; background: #A3C92A; bottom: -100px; left: -100px; }
    .bg-circle-3 { width: 300px; height: 300px; background: #84B01E; top: 30%; left: 60%; }

    .register-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 680px;
      padding: 1.5rem;
    }

    .register-card {
      background: #fff;
      border-radius: 24px;
      padding: 2.5rem 2.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06);
      border: 1px solid rgba(0,0,0,0.04);
    }

    .register-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .logo-icon {
      width: 44px; height: 44px;
      background: linear-gradient(135deg, #D4E157, #A3C92A);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(163,201,42,0.3);
      i { font-size: 1.3rem; color: #1A262F; }
    }

    .logo-text {
      font-size: 1.6rem; font-weight: 900; color: #1A262F; margin: 0;
    }

    .register-header {
      text-align: center;
      margin-bottom: 1.75rem;
    }

    .register-title {
      font-size: 1.5rem; font-weight: 800; color: #1A262F; margin: 0 0 0.3rem;
    }

    .register-subtitle {
      font-size: 0.9rem; color: #94a3b8; margin: 0; font-weight: 500;
    }

    /* --- Error message --- */
    .register-error {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.85rem 1rem;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 12px;
      color: #dc2626;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
      i { font-size: 1rem; flex-shrink: 0; }
    }

    /* --- Form --- */
    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .field-label {
      font-size: 0.82rem;
      font-weight: 700;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      i { font-size: 0.75rem; color: #94a3b8; }
    }

    .field-input {
      width: 100% !important;
      padding: 0.65rem 0.9rem !important;
      border: 2px solid #e2e8f0 !important;
      border-radius: 10px !important;
      font-size: 0.9rem !important;
      transition: all 0.2s ease !important;
      background: #f8fafc !important;

      &:focus {
        border-color: #A3C92A !important;
        box-shadow: 0 0 0 3px rgba(163,201,42,0.15) !important;
        background: #fff !important;
      }

      &.field-error {
        border-color: #ef4444 !important;
        background: #fef2f2 !important;
      }
    }

    .field-msg {
      font-size: 0.75rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      i { font-size: 0.7rem; }
      &.error { color: #ef4444; }
    }

    .radio-group {
      display: flex;
      gap: 1.5rem;
      padding-top: 0.5rem;
    }

    .radio-option {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      label {
        font-size: 0.85rem;
        font-weight: 600;
        color: #475569;
        cursor: pointer;
      }
    }

    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.25rem;
    }

    .checkbox-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
    }

    /* --- Tabs --- */
    .register-tabs {
      :host ::ng-deep .p-tablist {
        background: #f1f5f9;
        border-radius: 12px;
        padding: 0.25rem;
      }
      :host ::ng-deep .p-tab {
        border-radius: 10px;
        font-weight: 700;
        font-size: 0.85rem;
        padding: 0.6rem 1.5rem;
        color: #64748b;
        transition: all 0.2s;
        &[data-p-active="true"] {
          background: #fff;
          color: #1A262F;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
      }
    }

    .tab-content {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      padding-top: 1rem;
    }

    /* --- Section divider --- */
    .section-divider {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 0.5rem 0;
    }

    .section-divider-line {
      flex: 1;
      height: 1px;
      background: #e2e8f0;
    }

    .section-divider-text {
      font-size: 0.8rem;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    /* --- Submit button --- */
    .register-btn {
      width: 100% !important;
      padding: 0.85rem !important;
      background: linear-gradient(135deg, #D4E157, #A3C92A) !important;
      border: none !important;
      color: #1A262F !important;
      font-weight: 800 !important;
      font-size: 1.05rem !important;
      border-radius: 14px !important;
      box-shadow: 0 4px 16px rgba(163,201,42,0.3) !important;
      transition: all 0.3s ease !important;
      margin-top: 0.5rem;

      &:hover:not(:disabled) {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 24px rgba(163,201,42,0.4) !important;
      }
      &:active:not(:disabled) { transform: translateY(0) !important; }
      &:disabled { opacity: 0.6 !important; }
    }

    /* --- Footer --- */
    .register-footer {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      margin-top: 0.5rem;
    }

    .footer-text { font-size: 0.9rem; color: #94a3b8; font-weight: 500; }

    .footer-link {
      font-size: 0.9rem; font-weight: 700; color: #A3C92A;
      text-decoration: none; transition: color 0.2s;
      &:hover { color: #84B01E; text-decoration: underline; }
    }

    /* --- Dark mode --- */
    :host-context(.dark) {
      .register-page { background: #0f172a; }
      .register-card { background: #1e293b; border-color: rgba(255,255,255,0.05); }
      .register-title { color: #f1f5f9; }
      .field-label { color: #e2e8f0; i { color: #64748b; } }
      .field-input {
        background: #0f172a !important;
        border-color: #334155 !important;
        color: #f1f5f9 !important;
        &:focus { border-color: #A3C92A !important; background: #1e293b !important; }
        &.field-error { border-color: #ef4444 !important; background: rgba(239,68,68,0.1) !important; }
      }
      .radio-option label { color: #94a3b8; }
      .checkbox-label { color: #94a3b8; }
      .section-divider-line { background: #334155; }
      .section-divider-text { color: #64748b; }
      .footer-text { color: #64748b; }
      .register-tabs :host ::ng-deep .p-tablist { background: #0f172a; }
      .register-tabs :host ::ng-deep .p-tab {
        color: #64748b;
        &[data-p-active="true"] { background: #1e293b; color: #f1f5f9; }
      }
    }

    @media (max-width: 600px) {
      .form-row { grid-template-columns: 1fr; }
      .register-card { padding: 1.5rem; }
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
