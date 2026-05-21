import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';


import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { Notificacion } from '../../interfaces/notificacion';
import { AlertaService } from '../../service/alerta.service';
import { NotificacionService } from '../../service/notificacion.service';
import { Auth } from '../../service/auth.service';
import { Alerta } from '../../interfaces/alerta';
import { TopbarWidget } from '../topbar/topbarwidget.component';
import { FooterWidget } from '../topbar/footerwidget';
import { UserDTO } from '../../interfaces/user-dto';

/**
 * Validador personalizado: la contraseña debe tener exactamente 1 carácter especial
 * y solo letras, números y ese carácter especial.
 * Coincide con el @Pattern del backend:
 *   ^(?=[^!@#$%^&*]*[!@#$%^&*][^!@#$%^&*]*$)[A-Za-z0-9!@#$%^&*]+$
 */
function passwordPatternValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    // Debe tener exactamente 1 carácter especial del conjunto !@#$%^&*
    const specialChars = value.match(/[!@#$%^&*]/g);
    if (!specialChars || specialChars.length !== 1) {
        return { passwordPattern: true };
    }
    // Solo debe contener letras, números y ese carácter especial
    if (!/^[A-Za-z0-9!@#$%^&*]+$/.test(value)) {
        return { passwordPattern: true };
    }
    return null;
}

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, TopbarWidget, FooterWidget, ButtonModule, CardModule, AvatarModule, DividerModule, InputTextModule, PasswordModule, ToastModule, RippleModule, ConfirmDialogModule, TooltipModule],
    templateUrl: './perfil.html',
    styleUrl: './perfil.scss',
    providers: [MessageService, ConfirmationService]
})
export class Perfil implements OnInit {
    user: UserDTO | null = null;
    changePasswordForm: FormGroup;
    showPasswordForm = false;
    submitting = false;
    errorMsg = '';

    // Alertas
    alertas: Alerta[] = [];
    alertasCargando = false;
    alertasError = false;
    alertasErrorMsg = '';

    // Notificaciones
    notificaciones: Notificacion[] = [];
    notificacionesCargando = false;
    notificacionesNoLeidas = 0;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: Auth,
        private alertaService: AlertaService,
        private notificacionService: NotificacionService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private cdr: ChangeDetectorRef
    ) {
        this.changePasswordForm = this.fb.group(
            {
                currentPassword: ['', [Validators.required, Validators.minLength(8)]],
                newPassword: ['', [Validators.required, Validators.minLength(8), passwordPatternValidator]],
                confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
            },
            { validators: this.passwordsMatchValidator }
        );
    }

    ngOnInit() {
        this.user = this.authService.getUser();
        if (!this.user) {
            this.router.navigate(['/login']);
        } else {
            this.cargarAlertas();
            this.cargarNotificaciones();
        }
    }

    cargarNotificaciones() {
        if (!this.user?.email_dto) {
            console.warn('[Perfil] No hay email de usuario para cargar notificaciones');
            return;
        }
        console.log('[Perfil] Cargando notificaciones para:', this.user.email_dto);
        this.notificacionesCargando = true;
        this.notificacionService.listarNotificaciones(this.user.email_dto).subscribe({
            next: (data) => {
                console.log('[Perfil] Notificaciones recibidas:', data?.length || 0);
                this.notificaciones = data;
                this.notificacionesNoLeidas = data.filter((n) => !n.leida_noti).length;
                this.notificacionesCargando = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('[Perfil] Error al cargar notificaciones:', err);
                this.notificacionesCargando = false;
                this.cdr.detectChanges();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar las notificaciones.',
                    life: 4000
                });
            }
        });
    }

    cargarAlertas() {
        if (!this.user?.email_dto) {
            console.warn('[Perfil] No hay email de usuario para cargar alertas');
            return;
        }

        console.log('[Perfil] Cargando alertas para:', this.user.email_dto);
        this.alertasCargando = true;
        this.alertasError = false;
        this.alertasErrorMsg = '';
        this.alertaService.getAlertasByCorreo(this.user.email_dto).subscribe({
            next: (data) => {
                console.log('[Perfil] Alertas recibidas:', data?.length || 0);
                // Ordenar por fecha descendente (último creado primero) y mostrar solo 5
                const ordenadas = [...data].sort((a, b) => {
                    if (!a.fecha_creacion) return 1;
                    if (!b.fecha_creacion) return -1;
                    return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
                });
                this.alertas = ordenadas.slice(0, 5);
                this.alertasCargando = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('[Perfil] Error al cargar alertas:', err);
                this.alertasCargando = false;
                this.alertasError = true;
                this.cdr.detectChanges();
                this.alertasErrorMsg = err.status === 0 ? 'No se pudo conectar con el servidor.' : err.status === 404 ? 'No se encontraron alertas para este usuario.' : `Error del servidor (${err.status}).`;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar las alertas.',
                    life: 4000
                });
            }
        });
    }

    confirmarEliminarAlerta(alerta: Alerta) {
        this.confirmationService.confirm({
            message: `¿Estás seguro de que deseas eliminar esta alerta${alerta.cp_alerta ? ' de ' + alerta.cp_alerta : ''}${alerta.provincia_alerta ? ' (' + alerta.provincia_alerta + ')' : ''}?`,

            header: 'Eliminar alerta',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.eliminarAlerta(alerta);
            }
        });
    }

    eliminarAlerta(alerta: Alerta) {
        if (!alerta.id_alerta) return;
        this.alertaService.deleteAlerta(alerta.id_alerta).subscribe({
            next: () => {
                // Recargar todas las alertas para que se rellene la lista como una pila
                this.cargarAlertas();

                this.messageService.add({
                    severity: 'success',
                    summary: 'Alerta eliminada',
                    detail: 'La alerta se ha eliminado correctamente.',
                    life: 3000
                });
            },
            error: (err) => {
                console.error('Error al eliminar alerta:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error?.message || 'No se pudo eliminar la alerta.',
                    life: 4000
                });
            }
        });
    }

    passwordsMatchValidator(form: FormGroup) {
        const newPass = form.get('newPassword')?.value;
        const confirmPass = form.get('confirmPassword')?.value;
        if (newPass !== confirmPass) {
            form.get('confirmPassword')?.setErrors({ mismatch: true });
        } else {
            form.get('confirmPassword')?.setErrors(null);
        }
        return null;
    }

    togglePasswordForm() {
        this.showPasswordForm = !this.showPasswordForm;
        if (!this.showPasswordForm) {
            this.changePasswordForm.reset();
            this.errorMsg = '';
        }
    }

    changePassword() {
        this.errorMsg = '';

        if (this.changePasswordForm.invalid) {
            this.changePasswordForm.markAllAsTouched();
            return;
        }

        this.submitting = true;
        const formValues = this.changePasswordForm.value;

        const peticion = {
            password_actual: formValues.currentPassword,
            password_nueva: formValues.newPassword
        };

        this.authService.cambioPassword(peticion).subscribe({
            next: (response) => {
                console.log('[Perfil] Cambio password exitoso:', response);
                this.submitting = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Contraseña actualizada',
                    detail: 'Tu contraseña se ha cambiado correctamente.',
                    life: 3000
                });
                this.showPasswordForm = false;
                this.changePasswordForm.reset();
            },
            error: (error: any) => {
                this.submitting = false;
                console.error('[Perfil] Error cambio password:', error);

                const backendMsg = error.error?.message || error.error || '';
                if (error.status === 400) {
                    this.errorMsg = backendMsg || 'La nueva contraseña no cumple con los requisitos (mín. 8 caracteres, 1 especial !@#$%^&*).';
                } else if (error.status === 401) {
                    this.errorMsg = backendMsg || 'La contraseña actual no es correcta.';
                } else if (error.status === 0) {
                    this.errorMsg = 'No se pudo conectar con el servidor. Intenta de nuevo.';
                } else {
                    this.errorMsg = backendMsg || 'Error al cambiar la contraseña. Intenta de nuevo.';
                }
            }
        });
    }

    goToPublish() {
        this.router.navigate(['/publicar-anuncio']);
    }

    goToPublicaciones() {
        this.router.navigate(['/publicaciones']);
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    getInitials(): string {
        if (!this.user) return '?';
        const apellidos = this.user.apellidos_dto || '';
        return apellidos.charAt(0).toUpperCase() || '?';
    }

    getFullName(): string {
        if (!this.user) return 'Usuario';
        return this.user.apellidos_dto || 'Usuario';
    }

    getEmail(): string {
        return this.user?.email_dto || 'email@ejemplo.com';
    }

    getDocument(): string {
        return this.user?.nro_doc_dto || '---';
    }

    getDocumentType(): string {
        return 'DNI';
    }

    getRole(): string {
        const role = this.user?.rol_dto || '';
        switch (role) {
            case 'ADMIN':
                return 'Administrador';
            case 'USER':
                return 'Usuario';
            case 'AGENT':
                return 'Agente Inmobiliario';
            default:
                return role || 'Usuario';
        }
    }

    getRoleIcon(): string {
        const role = this.user?.rol_dto || '';
        switch (role) {
            case 'ADMIN':
                return 'pi pi-shield';
            case 'AGENT':
                return 'pi pi-briefcase';
            default:
                return 'pi pi-user';
        }
    }

    getPersonType(): string {
        return 'Persona Natural';
    }

    getRepresentante(): string {
        return this.user?.nombre_representante_juri || '---';
    }

    getCargo(): string {
        return this.user?.cargo_juri || '---';
    }

    getRegistroMercantil(): string {
        return this.user?.registro_mercantil_juri || '---';
    }

  irANotificacion(noti: Notificacion) {
    // Marcar como leída si no lo está
    if (!noti.leida_noti) {
      this.notificacionService.marcarLeida(noti.id_noti).subscribe({
        next: () => {
          noti.leida_noti = true;
          this.notificacionesNoLeidas = Math.max(0, this.notificacionesNoLeidas - 1);
        },
        error: (err) => console.error('[Perfil] Error al marcar notificación como leída:', err)
      });
    }
    // Redirigir al landing con query params (el landing ya maneja ?detalle=ID&tipo=TIPO)
    const tipo = noti.tipo_prop_noti?.toLowerCase() || 'venta';
    const id = noti.id_prop_noti;
    if (id) {
      this.router.navigate(['/landing'], {
        queryParams: { detalle: id, tipo: tipo }
      });
    } else {
      this.router.navigate(['/landing']);
    }
  }
}
