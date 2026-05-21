import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-filtro-venta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputNumberModule,
    SliderModule,
    CheckboxModule,
    AccordionModule,
    SelectButtonModule,
    ButtonModule,
    RadioButtonModule
  ],
  templateUrl: './filtro-venta.html',
  styleUrl: './filtro-venta.scss',
})
export class FiltroVenta {
  @Output() onFilterChange = new EventEmitter<any>();

  precioMax: number | null = null;
  habitaciones: number[] = [];
  banos: number[] = [];
  tiposPropiedad: string[] = [];
  estado: string | null = null; // 'reformado' | 'a_reformar'

  aplicarFiltros() {
    this.onFilterChange.emit({
      precioMax: this.precioMax,
      habitaciones: this.habitaciones,
      banos: this.banos,
      tipos: this.tiposPropiedad,
      estado: this.estado
    });
  }

  limpiarFiltros() {
    this.precioMax = null;
    this.habitaciones = [];
    this.banos = [];
    this.tiposPropiedad = [];
    this.estado = null;
    this.aplicarFiltros();
  }
}
