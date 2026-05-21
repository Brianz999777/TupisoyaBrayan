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
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 relative overflow-hidden p-4">
      <!-- Background decoration -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute w-[500px] h-[500px] bg-emerald-200/20 dark:bg-emerald-500/5 rounded-full blur-3xl -top-32 -right-32"></div>
        <div class="absolute w-[400px] h-[400px] bg-teal-200/20 dark:bg-teal-500/5 rounded-full blur-3xl -bottom-32 -left-32"></div>
      </div>

      <div class="relative z-10 w-full max-w-[420px]">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 shadow-xl shadow-emerald-500/5 border border-gray-100 dark:border-gray-700">
          <!-- Logo -->
          <div class="flex items-center justify-center gap-3 mb-8">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <i class="pi pi-home text-xl text-white"></i>
            </div>
            <span class="text-2xl font-black text-gray-900 dark:text-white">TuPisoYa</span>
          </div>

          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Bienvenido de nuevo</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">Inicia sesión para continuar</p>
          </div>

          <form [formGroup]="formLogin" (submit)="login()" class="space-y-5">
            <!-- Email -->
            <div class="flex flex-col gap-1.5">
              <label for="email" class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Correo electrónico
              </label>
              <input
                pInputText
                id="email"
                type="email"
                placeholder="tu@email.com"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-gray-700 placeholder:text-gray-400"
                formControlName="email"
                [ngClass]="{ '!border-red-400 !bg-red-50 dark:!bg-red-900/20': formLogin.get('email')?.invalid && (formLogin.get('email')?.dirty || formLogin.get('email')?.touched) }"
              />
              @if (formLogin.get('email')?.invalid && (formLogin.get('email')?.dirty || formLogin.get('email')?.touched)) {
                <div class="flex items-center gap-1 text-xs font-semibold text-red-500">
                  @if (formLogin.get('email')?.errors?.['required']) { <span><i class="pi pi-exclamation-circle text-[10px]"></i> El correo es obligatorio</span> }
                  @if (formLogin.get('email')?.errors?.['email']) { <span><i class="pi pi-exclamation-circle text-[10px]"></i> Formato de correo no válido</span> }
                </div>
              }
            </div>

            <!-- Password -->
            <div class="flex flex-col gap-1.5">
              <label for="password" class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
                <div class="flex items-center gap-1 text-xs font-semibold text-red-500">
                  @if (formLogin.get('password')?.errors?.['required']) { <span><i class="pi pi-exclamation-circle text-[10px]"></i> La contraseña es obligatoria</span> }
                  @if (formLogin.get('password')?.errors?.['minlength']) { <span><i class="pi pi-exclamation-circle text-[10px]"></i> Mínimo 8 caracteres</span> }
                </div>
              }
            </div>

            <!-- Remember + Forgot -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <p-checkbox formControlName="checked" id="rememberme" binary></p-checkbox>
                <label for="rememberme" class="text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer">Recordarme</label>
              </div>
              <span class="text-sm font-semibold text-emerald-500 hover:text-emerald-600 cursor-pointer transition-colors">¿Olvidaste tu contraseña?</span>
            </div>

            <!-- Error message from backend -->
            @if (errorMsg) {
              <div class="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400">
                <i class="pi pi-exclamation-triangle text-sm flex-shrink-0"></i>
                <span>{{ errorMsg }}</span>
              </div>
            }

            <!-- Submit -->
            <button pButton
              [label]="submitting ? 'Iniciando sesión...' : 'Iniciar sesión'"
              icon="pi pi-arrow-right"
              iconPos="right"
              class="!w-full !py-3.5 !bg-gradient-to-r !from-emerald-500 !to-teal-500 !text-white !font-semibold !rounded-xl !border-0 hover:!from-emerald-600 hover:!to-teal-600 !transition-all !shadow-lg !shadow-emerald-500/25"
              type="submit"
              [disabled]="submitting"
              [loading]="submitting">
            </button>

            <!-- Register link -->
            <div class="text-center flex items-center justify-center gap-1.5 pt-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">¿No tienes cuenta?</span>
              <a routerLink="/register" class="text-sm font-bold text-emerald-500 hover:text-emerald-600 transition-colors">Crear cuenta</a>
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
      padding: 0.75rem 1rem !important;
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
