import { Component, OnInit, OnChanges, SimpleChanges, Input, inject, ChangeDetectorRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { TarjetaAlquiler } from '../../interfaces/inmueble';
import { Alquiler } from '../alquiler/alquiler';
import { FiltroAlquiler } from '../filtro-alquiler/filtro-alquiler';
import { InmuebleService } from '../../service/inmueble.service';

@Component({
  selector: 'app-buqueda-alquiler',
  standalone: true,
  imports: [CommonModule, DataViewModule, ButtonModule, Alquiler, FiltroAlquiler],
  templateUrl: './buqueda-alquiler.html',
  styleUrl: './buqueda-alquiler.scss',
})
export class BuquedaAlquiler implements OnInit, OnChanges {
  @ViewChild('filtroAlquiler') filtroAlquiler!: FiltroAlquiler;
  @Input() terminoBusquedaInput: string | null = null;
  @Output() onInmuebleSelected = new EventEmitter<{id: number, tipo: 'venta' | 'alquiler'}>();

  private inmuebleService = inject(InmuebleService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  
  inmuebles: TarjetaAlquiler[] = [];
  inmueblesFiltrados: TarjetaAlquiler[] = [];
  filtrosActuales: any = {};
  terminoBusqueda: string | null = null;

  seleccionarInmueble(id: number) {
    this.onInmuebleSelected.emit({id, tipo: 'alquiler'});
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.terminoBusqueda = params['q'].toLowerCase();
        this.aplicarFiltrosActuales();
      }
    });

    this.inmuebleService.getAlquileres().subscribe({
      next: (data) => {
        this.inmuebles = data;
        this.aplicarFiltrosActuales();
      },
      error: (err) => console.error("Error al obtener alquileres", err)
    });
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
    if (this.filtroAlquiler) {
      this.filtroAlquiler.limpiarFiltros();
    }
  }

  aplicarFiltrosActuales() {
    const filtros = this.filtrosActuales;
    this.inmueblesFiltrados = this.inmuebles.filter(inm => {
      let cumple = true;

      // Filtro de Búsqueda General (Provincia, CP, Dirección)
      if (this.terminoBusqueda) {
        const busqueda = this.terminoBusqueda;
        const provincia = (inm.provincia_prop || '').toLowerCase();
        const cp = (inm.cp_prop || '').toLowerCase();
        const direccion = (inm.direccion_fisica || '').toLowerCase();
        
        if (!provincia.includes(busqueda) && !cp.includes(busqueda) && !direccion.includes(busqueda)) {
          cumple = false;
        }
      }

      // Filtro Precio Máximo
      if (filtros.precioMax && inm.precio_alquiler > filtros.precioMax) cumple = false;

      // Filtro Tipo (Casa/Piso)
      if (filtros.tipos && filtros.tipos.length > 0) {
        if (inm.tipo_inmueble && !filtros.tipos.includes(inm.tipo_inmueble)) cumple = false;
      }

      // Filtro Habitaciones (Checkbox)
      if (filtros.habitaciones && filtros.habitaciones.length > 0) {
        const matches = filtros.habitaciones.some((h: number) => {
          if (h === 4) return (inm.nro_habitaciones ?? 0) >= 4;
          return inm.nro_habitaciones === h;
        });
        if (!matches) cumple = false;
      }

      // Filtro Baños (Checkbox)
      if (filtros.banos && filtros.banos.length > 0) {
        const matches = filtros.banos.some((b: number) => {
          if (b === 3) return (inm.nro_banos ?? 0) >= 3;
          return inm.nro_banos === b;
        });
        if (!matches) cumple = false;
      }

      // Filtro Estado
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
