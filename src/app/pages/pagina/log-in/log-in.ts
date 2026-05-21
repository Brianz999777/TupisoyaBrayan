import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../service/auth.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';


@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PasswordModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    RippleModule,
    RouterLink,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="login-page">
      <!-- Background decoration -->
      <div class="login-bg">
        <div class="bg-circle bg-circle-1"></div>
        <div class="bg-circle bg-circle-2"></div>
        <div class="bg-circle bg-circle-3"></div>
      </div>

      <div class="login-container">
        <div class="login-card">
          <!-- Logo -->
          <div class="login-logo">
            <div class="logo-icon">
              <i class="pi pi-home"></i>
            </div>
            <h1 class="logo-text">TuPisoYa</h1>
          </div>

          <div class="login-header">
            <h2 class="login-title">Bienvenido de nuevo</h2>
            <p class="login-subtitle">Inicia sesión para continuar</p>
          </div>

          <form [formGroup]="formLogin" (submit)="login()" class="login-form">
            <!-- Email -->
            <div class="field">
              <label for="email" class="field-label">
                <i class="pi pi-envelope"></i>
                Correo electrónico
              </label>
              <input
                pInputText
                id="email"
                type="email"
                placeholder="tu@email.com"
                class="field-input"
                formControlName="email"
                [ngClass]="{ 'field-error': formLogin.get('email')?.invalid && (formLogin.get('email')?.dirty || formLogin.get('email')?.touched) }"
              />
              @if (formLogin.get('email')?.invalid && (formLogin.get('email')?.dirty || formLogin.get('email')?.touched)) {
                <div class="field-msg error">
                  @if (formLogin.get('email')?.errors?.['required']) { <span><i class="pi pi-exclamation-circle"></i> El correo es obligatorio</span> }
                  @if (formLogin.get('email')?.errors?.['email']) { <span><i class="pi pi-exclamation-circle"></i> Formato de correo no válido</span> }
                </div>
              }
            </div>

            <!-- Password -->
            <div class="field">
              <label for="password" class="field-label">
                <i class="pi pi-lock"></i>
                Contraseña
              </label>
              <p-password
                id="password"
                formControlName="password"
                placeholder="Tu contraseña"
                [toggleMask]="true"
                [feedback]="false"
                styleClass="w-full"
                [fluid]="true"
                [ngClass]="{ 'field-error': formLogin.get('password')?.invalid && (formLogin.get('password')?.dirty || formLogin.get('password')?.touched) }"
              ></p-password>
              @if (formLogin.get('password')?.invalid && (formLogin.get('password')?.dirty || formLogin.get('password')?.touched)) {
                <div class="field-msg error">
                  @if (formLogin.get('password')?.errors?.['required']) { <span><i class="pi pi-exclamation-circle"></i> La contraseña es obligatoria</span> }
                  @if (formLogin.get('password')?.errors?.['minlength']) { <span><i class="pi pi-exclamation-circle"></i> Mínimo 8 caracteres</span> }
                </div>
              }
            </div>

            <!-- Remember + Forgot -->
            <div class="login-options">
              <div class="remember-row">
                <p-checkbox formControlName="checked" id="rememberme" binary></p-checkbox>
                <label for="rememberme" class="remember-label">Recordarme</label>
              </div>
              <span class="forgot-link">¿Olvidaste tu contraseña?</span>
            </div>

            <!-- Error message from backend -->
            @if (errorMsg) {
              <div class="login-error">
                <i class="pi pi-exclamation-triangle"></i>
                <span>{{ errorMsg }}</span>
              </div>
            }

            <!-- Submit -->
            <button pButton
              [label]="submitting ? 'Iniciando sesión...' : 'Iniciar sesión'"
              icon="pi pi-arrow-right"
              iconPos="right"
              class="login-btn"
              type="submit"
              [disabled]="submitting"
              [loading]="submitting">
            </button>

            <!-- Register link -->
            <div class="login-footer">
              <span class="footer-text">¿No tienes cuenta?</span>
              <a routerLink="/register" class="footer-link">Crear cuenta</a>
            </div>
          </form>
        </div>
      </div>
    </div>

    <p-toast position="top-center"></p-toast>
  `,
  styles: [`
    /* ============================================
       LOGIN PAGE - Estilo moderno
       ============================================ */

    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      position: relative;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* --- Background decoration --- */
    .login-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .bg-circle {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.15;
    }

    .bg-circle-1 {
      width: 600px;
      height: 600px;
      background: #D4E157;
      top: -200px;
      right: -100px;
    }

    .bg-circle-2 {
      width: 400px;
      height: 400px;
      background: #A3C92A;
      bottom: -100px;
      left: -100px;
    }

    .bg-circle-3 {
      width: 300px;
      height: 300px;
      background: #84B01E;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    /* --- Container --- */
    .login-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 440px;
      padding: 1.5rem;
    }

    /* --- Card --- */
    .login-card {
      background: #fff;
      border-radius: 24px;
      padding: 2.5rem 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06);
      border: 1px solid rgba(0,0,0,0.04);
    }

    /* --- Logo --- */
    .login-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .logo-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #D4E157, #A3C92A);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(163,201,42,0.3);

      i {
        font-size: 1.5rem;
        color: #1A262F;
      }
    }

    .logo-text {
      font-size: 1.8rem;
      font-weight: 900;
      color: #1A262F;
      margin: 0;
    }

    /* --- Header --- */
    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: #1A262F;
      margin: 0 0 0.4rem;
    }

    .login-subtitle {
      font-size: 0.95rem;
      color: #94a3b8;
      margin: 0;
      font-weight: 500;
    }

    /* --- Form --- */
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .field-label {
      font-size: 0.85rem;
      font-weight: 700;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 0.4rem;

      i {
        font-size: 0.8rem;
        color: #94a3b8;
      }
    }

    .field-input {
      width: 100% !important;
      padding: 0.75rem 1rem !important;
      border: 2px solid #e2e8f0 !important;
      border-radius: 12px !important;
      font-size: 0.95rem !important;
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
      font-size: 0.8rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.3rem;

      i { font-size: 0.75rem; }

      &.error {
        color: #ef4444;
      }
    }

    /* --- Options row --- */
    .login-options {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .remember-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .remember-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
    }

    .forgot-link {
      font-size: 0.85rem;
      font-weight: 600;
      color: #A3C92A;
      cursor: pointer;
      transition: color 0.2s;

      &:hover {
        color: #84B01E;
        text-decoration: underline;
      }
    }

    /* --- Error message --- */
    .login-error {
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

      i {
        font-size: 1rem;
        flex-shrink: 0;
      }
    }

    /* --- Submit button --- */
    .login-btn {
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

      &:hover:not(:disabled) {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 24px rgba(163,201,42,0.4) !important;
      }

      &:active:not(:disabled) {
        transform: translateY(0) !important;
      }

      &:disabled {
        opacity: 0.6 !important;
      }
    }

    /* --- Footer --- */
    .login-footer {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
    }

    .footer-text {
      font-size: 0.9rem;
      color: #94a3b8;
      font-weight: 500;
    }

    .footer-link {
      font-size: 0.9rem;
      font-weight: 700;
      color: #A3C92A;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: #84B01E;
        text-decoration: underline;
      }
    }

    /* --- Dark mode --- */
    :host-context(.dark) {
      .login-page {
        background: #0f172a;
      }

      .login-card {
        background: #1e293b;
        border-color: rgba(255,255,255,0.05);
      }

      .login-title { color: #f1f5f9; }

      .field-label {
        color: #e2e8f0;
        i { color: #64748b; }
      }

      .field-input {
        background: #0f172a !important;
        border-color: #334155 !important;
        color: #f1f5f9 !important;

        &:focus {
          border-color: #A3C92A !important;
          background: #1e293b !important;
        }

        &.field-error {
          border-color: #ef4444 !important;
          background: rgba(239,68,68,0.1) !important;
        }
      }

      .remember-label { color: #94a3b8; }
      .footer-text { color: #64748b; }
    }
  `]
})
export class LogIn {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(Auth);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);


  formLogin: FormGroup;
  submitting = false;
  errorMsg = '';

  constructor() {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      checked: [false]
    });
  }

  login() {
    // Limpiar error anterior
    this.errorMsg = '';

    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const formValues = this.formLogin.value;

    const loginRequest: any = {
      email: formValues.email,
      password: formValues.password
    };

    this.authService.login(loginRequest).pipe(
      finalize(() => {
        this.submitting = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (response) => {
        console.log('[Login] Éxito:', response);
        this.messageService.add({
          severity: 'success',
          summary: '¡Bienvenido!',
          detail: 'Has iniciado sesión correctamente.',
          life: 2000
        });
        setTimeout(() => {
          this.router.navigate(['/perfil']);
        }, 500);
      },
      error: (error: any) => {
        console.error('[Login] Error:', error);

        // Extraer mensaje de error del backend
        let backendMsg = '';
        try {
          backendMsg = error.error?.message || error.error?.error || '';
        } catch (e) {
          backendMsg = '';
        }

        if (error.status === 401 || error.status === 403) {
          this.errorMsg = backendMsg || 'Credenciales incorrectas. Verifica tu email y contraseña.';
        } else if (error.status === 0) {
          this.errorMsg = 'No se pudo conectar con el servidor. Intenta de nuevo.';
        } else {
          this.errorMsg = backendMsg || 'Error al iniciar sesión. Intenta de nuevo.';
        }

        this.cdr.detectChanges();
      }
    });


  }
}
