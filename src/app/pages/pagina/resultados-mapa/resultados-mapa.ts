import { Component, OnInit, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import * as L from 'leaflet';
import { PropiedadVentaCardDTO } from '../../interfaces/busqueda-zona';
import { ResultadosMapaService } from '../../service/resultados-mapa.service';
import { TopbarWidget } from '../topbar/topbarwidget.component';

@Component({
  selector: 'app-resultados-mapa',
  standalone: true,
  imports: [CommonModule, RouterModule, TopbarWidget],
  templateUrl: './resultados-mapa.html',
  styleUrls: ['./resultados-mapa.scss'],
})
export class ResultadosMapa implements OnInit, AfterViewInit, OnDestroy {
  private readonly resultadosService = inject(ResultadosMapaService);
  private readonly router = inject(Router);

  resultados: PropiedadVentaCardDTO[] = [];

  private map!: L.Map;
  private markersLayer!: L.FeatureGroup;

  ngOnInit(): void {
    this.resultados = this.resultadosService.getResultados();

    // Si no hay resultados, redirigir al mapa
    if (this.resultados.length === 0) {
      this.router.navigate(['/mapa-busqueda']);
    }
  }

  ngAfterViewInit(): void {
    // Arreglar iconos de Leaflet
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/images/marker-icon-2x.png',
      iconUrl: 'assets/images/marker-icon.png',
      shadowUrl: 'assets/images/marker-shadow.png',
    });

    this.inicializarMapa();

    // Esperar a que el mapa tenga tamaño antes de pintar marcadores y hacer fitBounds
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
        this.pintarMarcadores();
      }
    }, 200);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private inicializarMapa(): void {
    this.map = L.map('mapaLeafletResultados', {
      center: [40.416775, -3.70379],
      zoom: 6,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.markersLayer = new L.FeatureGroup();
    this.map.addLayer(this.markersLayer);
  }

  private pintarMarcadores(): void {
    this.markersLayer.clearLayers();

    this.resultados.forEach((inmueble) => {
      const { ubicacion } = inmueble;
      if (!ubicacion || ubicacion.lat == null || ubicacion.lng == null) return;

      const marker = L.marker([ubicacion.lat, ubicacion.lng]);

      const precio =
        inmueble.precio_venta != null
          ? `${inmueble.precio_venta.toLocaleString()} €`
          : inmueble.precio_alquiler != null
            ? `${inmueble.precio_alquiler.toLocaleString()} €/mes`
            : 'Consultar precio';

      const tipoRuta = inmueble.type === 'venta' ? 'venta' : 'alquiler';

      const popupContent = `
        <div style="font-family: Arial, sans-serif; min-width: 180px;">
          <strong style="font-size: 1rem; color: #1e293b;">${inmueble.direccion_prop}</strong>
          <p style="margin: 6px 0 4px; font-size: 1.1rem; font-weight: 700; color: #059669;">💰 ${precio}</p>
          <p style="margin: 4px 0; font-size: 0.85rem; color: #64748b;">
            🛏️ ${inmueble.nro_habitaciones_prop} hab · 🚿 ${inmueble.nro_banos_prop} baños · 📐 ${inmueble.metros_prop} m²
          </p>
          <a href="/detalle-${tipoRuta}/${inmueble.id_prop}"
             style="display: inline-block; margin-top: 6px; font-weight: 600; color: #3b82f6; text-decoration: none;">
            Ver detalle →
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);
      this.markersLayer.addLayer(marker);
    });

    if (this.resultados.length > 0) {
      const bounds = this.markersLayer.getBounds();
      if (bounds.isValid()) {
        this.map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }

  /** Vuelve al mapa y limpia los resultados */
  volverAlMapa(): void {
    this.resultadosService.limpiar();
    this.router.navigate(['/mapa-busqueda']);
  }

  /** Centra el mapa en un inmueble */
  centrarEnInmueble(inmueble: PropiedadVentaCardDTO): void {
    const { ubicacion } = inmueble;
    if (ubicacion && ubicacion.lat != null && ubicacion.lng != null) {
      this.map.setView([ubicacion.lat, ubicacion.lng], 16);
    }
  }
}
