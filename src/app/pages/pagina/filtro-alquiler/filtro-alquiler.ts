import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-filtro-alquiler',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputNumberModule,
    CheckboxModule,
    AccordionModule,
    SelectButtonModule,
    ButtonModule,
    RadioButtonModule
  ],
  templateUrl: './filtro-alquiler.html',
  styleUrl: './filtro-alquiler.scss',
})
export class FiltroAlquiler {
  @Output() filterChange = new EventEmitter<any>();

  precioMax: number | null = null;
  habitaciones: number[] = [];
  banos: number[] = [];
  tiposPropiedad: string[] = [];
  estado: string = '';

  aplicarFiltros() {
    this.filterChange.emit({
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
    this.estado = '';
    this.aplicarFiltros();
  }
}
