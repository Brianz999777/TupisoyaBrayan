import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges, Input, inject, ChangeDetectorRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TarjetaVenta } from '../../interfaces/inmueble';
import { Venta } from '../venta/venta';
import { FiltroVenta } from '../filtro-venta/filtro-venta';
import { InmuebleService } from '../../service/inmueble.service';
import { AlertaService } from '../../service/alerta.service';
import { Auth } from '../../service/auth.service';

@Component({
  selector: 'app-buqueda-venta',
  standalone: true,
  imports: [CommonModule, FormsModule, DataViewModule, ButtonModule, DialogModule, InputTextModule, ToastModule, Venta, FiltroVenta],
  templateUrl: './buqueda-venta.html',
  styleUrl: './buqueda-venta.scss',
  providers: [MessageService]
})
export class BuquedaVenta implements OnInit, OnChanges, OnDestroy {
  @ViewChild('filtroVenta') filtroVenta!: FiltroVenta;
  @Input() terminoBusquedaInput: string | null = null;

  private inmuebleService = inject(InmuebleService);
  private alertaService = inject(AlertaService);
  private authService = inject(Auth);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  
  inmuebles: TarjetaVenta[] = [];
  inmueblesFiltrados: TarjetaVenta[] = [];
  filtrosActuales: any = {};
  terminoBusqueda: string | null = null;

  @Output() onInmuebleSelected = new EventEmitter<{id: number, tipo: 'venta' | 'alquiler'}>();

  // Alerta modal
  showAlertaModal = false;
  showAlertaConfirmacion = false;
  alertaCorreo = '';
  alertaCp = '';
  alertaProvincia = '';
  alertaGuardando = false;
  private scrollTimer: any = null;
  private scrollActivo = false;
  private tiempoInicioScroll: number = 0;
  private confirmacionTimer: any = null;

  seleccionarInmueble(id: number) {
    this.onInmuebleSelected.emit({id, tipo: 'venta'});
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.terminoBusqueda = params['q'].toLowerCase();
        this.aplicarFiltrosActuales();
        this.mostrarAlerta();
      }
    });

    this.inmuebleService.getVentas().subscribe({
      next: (data) => {
        this.inmuebles = data;
        this.aplicarFiltrosActuales();
      },
      error: (err) => console.error("Error al obtener ventas", err)
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['terminoBusquedaInput']) {
      this.terminoBusqueda = this.terminoBusquedaInput ? this.terminoBusquedaInput.toLowerCase() : null;
      this.aplicarFiltrosActuales();
      if (this.terminoBusqueda) {
        this.mostrarAlerta();
      }
    }
  }

  ngOnDestroy() {
    if (this.confirmacionTimer) {
      clearTimeout(this.confirmacionTimer);
    }
  }

  private mostrarAlerta() {
    // Solo mostrar el modal si el usuario está logueado (tiene token)
    if (!this.authService.isLoggedIn()) {
      return;
    }

    if (this.terminoBusqueda) {
      const esCp = /^\d+$/.test(this.terminoBusqueda);
      if (esCp) {
        this.alertaCp = this.terminoBusqueda;
      } else {
        this.alertaProvincia = this.terminoBusqueda;
      }
    }

    if (!this.alertaCp && !this.alertaProvincia && this.inmueblesFiltrados.length > 0) {
      const primero = this.inmueblesFiltrados[0];
      if (primero.cp_prop) this.alertaCp = primero.cp_prop;
      if (primero.provincia_prop) this.alertaProvincia = primero.provincia_prop;
    }

    const user = this.authService.getUser();
    if (user?.email_dto) {
      this.alertaCorreo = user.email_dto;
    }

    this.showAlertaModal = true;
    this.scrollActivo = false;
    this.cdr.detectChanges();
  }

  crearAlerta() {
    if (!this.alertaCorreo.trim()) return;

    this.alertaGuardando = true;

    const alerta: any = {
      correo_alerta: this.alertaCorreo.trim()
    };

    if (this.alertaCp.trim()) {
      alerta.cp_alerta = this.alertaCp.trim();
    }
    if (this.alertaProvincia.trim()) {
      alerta.provincia_alerta = this.alertaProvincia.trim();
    }

    this.alertaService.crearAlerta(alerta).subscribe({
      next: () => {
        this.alertaGuardando = false;
        // Cerrar modal de creación y abrir confirmación
        this.showAlertaModal = false;
        this.showAlertaConfirmacion = true;
        this.cdr.detectChanges();

        // Auto-cerrar la confirmación a los 5 segundos
        this.confirmacionTimer = setTimeout(() => {
          this.showAlertaConfirmacion = false;
          this.cdr.detectChanges();
        }, 5000);
      },
      error: (err) => {
        this.alertaGuardando = false;
        console.error('Error al crear alerta:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'No se pudo crear la alerta.',
          life: 4000
        });
        this.cdr.detectChanges();
      }
    });
  }

  cerrarAlertaModal() {
    this.showAlertaModal = false;
    this.scrollActivo = false;
    this.tiempoInicioScroll = 0;
  }

  handleFilter(filtros: any) {
    this.filtrosActuales = filtros || {};
    this.aplicarFiltrosActuales();
  }

  limpiarFiltros() {
    if (this.filtroVenta) {
      this.filtroVenta.limpiarFiltros();
    }
  }

  aplicarFiltrosActuales() {
    const filtros = this.filtrosActuales;
    this.inmueblesFiltrados = this.inmuebles.filter(inm => {
      let cumple = true;

      if (this.terminoBusqueda) {
        const busqueda = this.terminoBusqueda;
        const provincia = (inm.provincia_prop || '').toLowerCase();
        const cp = (inm.cp_prop || '').toLowerCase();
        const direccion = (inm.direccion_fisica || '').toLowerCase();
        
        if (!provincia.includes(busqueda) && !cp.includes(busqueda) && !direccion.includes(busqueda)) {
          cumple = false;
        }
      }

      if (filtros.precioMax && inm.precio_venta > filtros.precioMax) cumple = false;

      if (filtros.tipos && filtros.tipos.length > 0) {
        if (inm.tipo_inmueble && !filtros.tipos.includes(inm.tipo_inmueble)) cumple = false;
      }

      if (filtros.habitaciones && filtros.habitaciones.length > 0) {
        const matches = filtros.habitaciones.some((h: number) => {
          if (h === 4) return (inm.nro_habitaciones ?? 0) >= 4;
          return inm.nro_habitaciones === h;
        });
        if (!matches) cumple = false;
      }

      if (filtros.banos && filtros.banos.length > 0) {
        const matches = filtros.banos.some((b: number) => {
          if (b === 3) return (inm.nro_banos ?? 0) >= 3;
          return inm.nro_banos === b;
        });
        if (!matches) cumple = false;
      }

      if (filtros.estado) {
        const esReformado = inm.reformado === true;
        if (inm.reformado !== undefined) {
          if (filtros.estado === 'reformado' && !esReformado) cumple = false;
          if (filtros.estado === 'a_reformar' && esReformado) cumple = false;
        }
      }

      return cumple;
    });
    this.cdr.detectChanges();
  }
}
