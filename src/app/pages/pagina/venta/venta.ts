import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';
import { TarjetaVenta } from '../../interfaces/inmueble';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule, RouterModule],
  templateUrl: './venta.html',
  styleUrl: './venta.scss',
})
export class Venta {
  @Input() inmueble!: TarjetaVenta;
  @Output() onVerDetalle = new EventEmitter<number>();

  verDetalle() {
    this.onVerDetalle.emit(this.inmueble.id_prop);
  }

  get fullAddress(): string {
    return this.inmueble.direccion_fisica || 'Dirección no disponible';
  }

  get mainPhoto(): string {
    if (this.inmueble.foto_principal) {
      const url = this.inmueble.foto_principal;
      // Si la URL es relativa, añadir el base del backend
      if (url && !url.startsWith('http') && !url.startsWith('/demo')) {
        return `http://localhost:8080/tupisoya/${url.replace(/^\//, '')}`;
      }
      return url;
    }
    // Si no hay foto_principal, intentar usar la primera foto del array
    if (this.inmueble.fotos && this.inmueble.fotos.length > 0) {
      const primeraFoto = this.inmueble.fotos[0];
      const url = typeof primeraFoto === 'string' ? primeraFoto : (primeraFoto.url_foto || '');

      if (url && !url.startsWith('http') && !url.startsWith('/demo')) {
        return `http://localhost:8080/tupisoya/${url.replace(/^\//, '')}`;
      }
      return url || '/demo/images/galleria/no_photo.png';
    }
    return '/demo/images/galleria/no_photo.png';
  }

}
