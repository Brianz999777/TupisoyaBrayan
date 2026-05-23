import { Component, OnInit, OnChanges, SimpleChanges, Input, inject, ChangeDetectorRef, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { TarjetaVenta } from '../../interfaces/inmueble';
import { Venta } from '../venta/venta';
import { FiltroVenta } from '../filtro-venta/filtro-venta';
import { InmuebleService } from '../../service/inmueble.service';
import { AlertaService } from '../../service/alerta.service';
import { Auth } from '../../service/auth.service';

@Component({
  selector: 'app-buqueda-venta',
  standalone: true,
  imports: [CommonModule, DataViewModule, ButtonModule, DialogModule, InputTextModule, ToastModule, FormsModule, Venta, FiltroVenta],
  providers: [MessageService],
  templateUrl: './buqueda-venta.html',
  styleUrl: './buqueda-venta.scss',
})
export class BuquedaVenta implements OnInit, OnChanges, OnDestroy {
  @ViewChild('filtroVenta') filtroVenta!: FiltroVenta;
  @Input() terminoBusquedaInput: string | null = null;

  private inmuebleService = inject(InmuebleService);
  private alertaService = inject(AlertaService);
  private auth = inject(Auth);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  
  inmuebles: TarjetaVenta[] = [];
  inmueblesFiltrados: TarjetaVenta[] = [];
  filtrosActuales: any = {};
  terminoBusqueda: string | null = null;

  @Output() onInmuebleSelected = new EventEmitter<{id: number, tipo: 'venta' | 'alquiler'}>();

  // Modal alerta
  mostrarModalAlerta = false;
  correoAlerta = '';
  guardandoAlerta = false;
  private timerAlerta: any = null;

  seleccionarInmueble(id: number) {
    this.onInmuebleSelected.emit({id, tipo: 'venta'});
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.terminoBusqueda = params['q'].toLowerCase();
        this.cargarInmuebles();
      } else {
        this.terminoBusqueda = null;
        this.cargarInmuebles();
      }
    });
  }

  private cargarInmuebles() {
    if (this.terminoBusqueda) {
      // Búsqueda por palabra clave en el backend
      this.inmuebleService.buscarVentas(this.terminoBusqueda).subscribe({
        next: (data) => {
          this.inmuebles = data;
          this.inmueblesFiltrados = data;
          this.iniciarTimerAlerta();
          this.cdr.detectChanges();
        },
        error: (err) => console.error("Error al buscar ventas", err)
      });
    } else {
      // Sin búsqueda, cargar todos
      this.inmuebleService.getVentas().subscribe({
        next: (data) => {
          this.inmuebles = data;
          this.aplicarFiltrosActuales();
          this.iniciarTimerAlerta();
        },
        error: (err) => console.error("Error al obtener ventas", err)
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['terminoBusquedaInput']) {
      this.terminoBusqueda = this.terminoBusquedaInput ? this.terminoBusquedaInput.toLowerCase() : null;
      this.aplicarFiltrosActuales();
    }
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

  // ─── MODAL ALERTA ───────────────────────────────────────
  private iniciarTimerAlerta() {
    this.pararTimerAlerta();
    this.timerAlerta = setTimeout(() => {
      // Precargar email del usuario si está logueado
      const user = this.auth.getUser();
      this.correoAlerta = user?.email_dto || '';
      this.mostrarModalAlerta = true;
      this.cdr.detectChanges();
    }, 5000);
  }

  private pararTimerAlerta() {
    if (this.timerAlerta) {
      clearTimeout(this.timerAlerta);
      this.timerAlerta = null;
    }
  }

  cerrarModalAlerta() {
    this.mostrarModalAlerta = false;
    this.pararTimerAlerta();
  }

  crearAlerta() {
    if (!this.correoAlerta.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Correo requerido', detail: 'Introduce tu correo electrónico.' });
      return;
    }
    this.guardandoAlerta = true;

    // Detectar si el término de búsqueda es CP (solo dígitos) o provincia
    let cp_alerta: string | undefined;
    let provincia_alerta: string | undefined;
    if (this.terminoBusqueda) {
      if (/^\d+$/.test(this.terminoBusqueda)) {
        cp_alerta = this.terminoBusqueda;
      } else {
        provincia_alerta = this.terminoBusqueda.charAt(0).toUpperCase() + this.terminoBusqueda.slice(1);
      }
    }

    const alerta = {
      correo_alerta: this.correoAlerta.trim(),
      cp_alerta,
      provincia_alerta
    };
    this.alertaService.crearAlerta(alerta).subscribe({
      next: () => {
        this.guardandoAlerta = false;
        this.mostrarModalAlerta = false;
        this.messageService.add({ severity: 'success', summary: '¡Alerta creada!', detail: 'Te avisaremos cuando haya nuevos inmuebles.' });
      },
      error: (err) => {
        this.guardandoAlerta = false;
        console.error('Error al crear alerta:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la alerta.' });
      }
    });
  }

  ngOnDestroy() {
    this.pararTimerAlerta();
  }

  aplicarFiltrosActuales() {
    const filtros = this.filtrosActuales;
    this.inmueblesFiltrados = this.inmuebles.filter(inm => {
      let cumple = true;

      // Filtro de Búsqueda General (Población, Provincia, CP, Dirección)
      if (this.terminoBusqueda) {
        const busqueda = this.terminoBusqueda;
        const poblacion = (inm.poblacion_prop || '').toLowerCase();
        const provincia = (inm.provincia_prop || '').toLowerCase();
        const cp = (inm.cp_prop || '').toLowerCase();
        const direccion = (inm.direccion_prop || '').toLowerCase();
        
        if (!poblacion.includes(busqueda) && !provincia.includes(busqueda) && !cp.includes(busqueda) && !direccion.includes(busqueda)) {
          cumple = false;
        }
      }

      // Filtro Precio Máximo
      if (filtros.precioMax && inm.precio_venta > filtros.precioMax) cumple = false;

      // Filtro Tipo (Casa/Piso)
      if (filtros.tipos && filtros.tipos.length > 0) {
        if (inm.tipo_inmueble && !filtros.tipos.includes(inm.tipo_inmueble)) cumple = false;
      }

      // Filtro Habitaciones (Checkbox)
      if (filtros.habitaciones && filtros.habitaciones.length > 0) {
        const matches = filtros.habitaciones.some((h: number) => {
          if (h === 4) return (inm.nro_habitaciones_prop ?? 0) >= 4;
          return inm.nro_habitaciones_prop === h;
        });
        if (!matches) cumple = false;
      }

      // Filtro Baños (Checkbox)
      if (filtros.banos && filtros.banos.length > 0) {
        const matches = filtros.banos.some((b: number) => {
          if (b === 3) return (inm.nro_banos_prop ?? 0) >= 3;
          return inm.nro_banos_prop === b;
        });
        if (!matches) cumple = false;
      }

      // Filtro Estado
      if (filtros.estado) {
        const esReformado = inm.reforma_venta === true;
        if (inm.reforma_venta !== undefined) {
          if (filtros.estado === 'reformado' && !esReformado) cumple = false;
          if (filtros.estado === 'a_reformar' && esReformado) cumple = false;
        }
      }

      return cumple;
    });
    this.cdr.detectChanges();
  }
}
