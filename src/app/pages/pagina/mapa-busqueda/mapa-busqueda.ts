import { Component, OnDestroy, inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet-draw';
import { InmuebleService } from '../../service/inmueble.service';
import { PropiedadVentaCardDTO, PropiedadAlquilerCardDTO } from '../../interfaces/busqueda-zona';
import { TopbarWidget } from '../topbar/topbarwidget.component';

type TipoBusqueda = 'venta' | 'alquiler';

@Component({
  selector: 'app-mapa-busqueda',
  standalone: true,
  imports: [CommonModule, RouterModule, TopbarWidget],
  templateUrl: './mapa-busqueda.html',
  styleUrls: ['./mapa-busqueda.scss'],
})
export class MapaBusqueda implements AfterViewInit, OnDestroy {
  private readonly inmuebleService = inject(InmuebleService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  private map!: L.Map;
  private drawnItems!: L.FeatureGroup;
  private drawControl!: L.Control.Draw;
  private markersLayer!: L.FeatureGroup;

  /** Tipo de búsqueda actual: 'venta' | 'alquiler' */
  tipoBusqueda: TipoBusqueda = 'venta';

  cargando = false;
  resultadosVenta: PropiedadVentaCardDTO[] = [];
  resultadosAlquiler: PropiedadAlquilerCardDTO[] = [];
  busquedaRealizada = false;
  mostrarPanel = false;
  errorMsg = '';

  ngAfterViewInit(): void {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/images/marker-icon-2x.png',
      iconUrl: 'assets/images/marker-icon.png',
      shadowUrl: 'assets/images/marker-shadow.png',
    });

    this.inicializarMapa();

    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  /** Cambia entre venta y alquiler y reinicia la búsqueda si ya hay un polígono dibujado */
  cambiarTipo(tipo: TipoBusqueda): void {
    if (this.tipoBusqueda === tipo) return;
    this.tipoBusqueda = tipo;
    this.limpiarResultados();

    // Si hay un polígono dibujado, buscar de nuevo con el nuevo tipo
    if (this.drawnItems.getLayers().length > 0) {
      const layer = this.drawnItems.getLayers()[0] as L.Polygon;
      if (layer && layer instanceof L.Polygon) {
        const latlngs = this.extraerCoordenadasPoligono(layer);
        if (latlngs && latlngs.length >= 3) {
          const wkt = this.coordenadasToWkt(latlngs);
          this.buscarInmueblesPorZona(wkt);
        }
      }
    }
  }

  private inicializarMapa(): void {
    this.map = L.map('mapaLeaflet', {
      center: [40.416775, -3.70379],
      zoom: 7,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    this.markersLayer = new L.FeatureGroup();
    this.map.addLayer(this.markersLayer);

    const drawOptions: L.Control.DrawConstructorOptions = {
      position: 'topright',
      draw: {
        polyline: false,
        circle: false,
        rectangle: false,
        marker: false,
        circlemarker: false,
        polygon: {
          allowIntersection: true,
          shapeOptions: {
            color: '#3b82f6',
            weight: 2,
            opacity: 0.8,
            fillColor: '#3b82f6',
            fillOpacity: 0.2,
          },
          showArea: true,
        },
      },
      edit: {
        featureGroup: this.drawnItems,
        edit: false,
        remove: true,
      },
    };

    this.drawControl = new L.Control.Draw(drawOptions);
    this.map.addControl(this.drawControl);

    this.map.on(L.Draw.Event.CREATED, (event: any) => {
      this.onPoligonoCreado(event);
    });

    this.map.on(L.Draw.Event.DELETED, () => {
      this.limpiarResultados();
    });
  }

  private onPoligonoCreado(event: L.DrawEvents.Created): void {
    const layer = event.layer;

    this.drawnItems.clearLayers();
    this.markersLayer.clearLayers();
    this.resultadosVenta = [];
    this.resultadosAlquiler = [];
    this.busquedaRealizada = false;
    this.mostrarPanel = false;

    this.drawnItems.addLayer(layer);

    if (layer instanceof L.Polygon) {
      this.map.fitBounds(layer.getBounds(), { padding: [50, 50] });
    }

    const latlngs = this.extraerCoordenadasPoligono(layer);

    if (!latlngs || latlngs.length < 3) {
      console.warn('[MapaBusqueda] El polígono tiene menos de 3 puntos, no se puede procesar.');
      return;
    }

    const wkt = this.coordenadasToWkt(latlngs);
    console.log('[MapaBusqueda] 🗺️ WKT generado:', wkt);

    this.buscarInmueblesPorZona(wkt);
  }

  private extraerCoordenadasPoligono(layer: L.Layer): Array<{ lat: number; lng: number }> {
    const coords: Array<{ lat: number; lng: number }> = [];

    if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
      const allLatLngs = (layer as L.Polygon).getLatLngs();
      const exterior = Array.isArray(allLatLngs[0])
        ? (allLatLngs[0] as L.LatLng[])
        : (allLatLngs as L.LatLng[]);

      exterior.forEach((ll: L.LatLng) => {
        coords.push({ lat: ll.lat, lng: ll.lng });
      });
    }

    return coords;
  }

  private coordenadasToWkt(coords: Array<{ lat: number; lng: number }>): string {
    if (coords.length < 3) {
      throw new Error('Se necesitan al menos 3 puntos para formar un polígono WKT.');
    }

    const puntos = coords
      .map((p) => `${p.lng} ${p.lat}`)
      .join(', ');

    const primerPunto = `${coords[0].lng} ${coords[0].lat}`;
    const wkt = `POLYGON((${puntos}, ${primerPunto}))`;

    return wkt;
  }

  private buscarInmueblesPorZona(wkt: string): void {
    this.cargando = true;
    this.busquedaRealizada = false;

    const observable = this.tipoBusqueda === 'venta'
      ? this.inmuebleService.buscarVentasPorZona({ poligono: wkt })
      : this.inmuebleService.buscarAlquileresPorZona({ poligono: wkt });

    observable.subscribe({
      next: (inmuebles: any) => {
        this.cargando = false;
        this.busquedaRealizada = true;

        if (this.tipoBusqueda === 'venta') {
          this.resultadosVenta = inmuebles as PropiedadVentaCardDTO[];
          this.resultadosAlquiler = [];
        } else {
          this.resultadosAlquiler = inmuebles as PropiedadAlquilerCardDTO[];
          this.resultadosVenta = [];
        }

        console.log(`[MapaBusqueda] ✅ ${inmuebles.length} inmuebles de ${this.tipoBusqueda} recibidos.`);

        if (inmuebles.length > 0) {
          this.mostrarPanel = true;
          this.cdr.detectChanges();

          setTimeout(() => {
            if (this.map) {
              this.map.invalidateSize();
            }
            this.pintarMarcadores(inmuebles);
          }, 100);
        } else {
          this.pintarMarcadores(inmuebles);
        }
      },
      error: (err) => {
        this.cargando = false;
        this.busquedaRealizada = true;
        this.errorMsg = err.error?.message || err.message || 'Error al conectar con el servidor';
        this.cdr.detectChanges();
        console.error('[MapaBusqueda] ❌ Error al buscar inmuebles por zona:', err);
      },
    });
  }

  private pintarMarcadores(inmuebles: (PropiedadVentaCardDTO | PropiedadAlquilerCardDTO)[]): void {
    this.markersLayer.clearLayers();

    inmuebles.forEach((inmueble) => {
      const { ubicacion } = inmueble;

      if (!ubicacion || ubicacion.lat == null || ubicacion.lng == null) {
        console.warn('[MapaBusqueda] ⚠️ Inmueble sin coordenadas válidas:', inmueble.id_prop);
        return;
      }

      const marker = L.marker([ubicacion.lat, ubicacion.lng]);

      const precio =
        (inmueble as PropiedadVentaCardDTO).precio_venta != null
          ? `${(inmueble as PropiedadVentaCardDTO).precio_venta!.toLocaleString()} €`
          : (inmueble as PropiedadAlquilerCardDTO).precio_alquiler != null
            ? `${(inmueble as PropiedadAlquilerCardDTO).precio_alquiler!.toLocaleString()} €/mes`
            : 'Consultar precio';

      const tipoRuta = this.tipoBusqueda;

      const popupContent = `
        <div style="font-family: Arial, sans-serif; min-width: 180px;">
          <strong style="font-size: 1rem; color: #1e293b;">
            ${inmueble.direccion_prop}
          </strong>
          <p style="margin: 6px 0 4px; font-size: 1.1rem; font-weight: 700; color: #059669;">
            💰 ${precio}
          </p>
          <p style="margin: 4px 0; font-size: 0.85rem; color: #64748b;">
            🛏️ ${inmueble.nro_habitaciones_prop} hab · 🚿 ${inmueble.nro_banos_prop} baños · 📐 ${inmueble.metros_prop} m²
          </p>
          <a
            href="/detalle-${tipoRuta}/${inmueble.id_prop}"
            style="display: inline-block; margin-top: 6px; font-weight: 600; color: #3b82f6; text-decoration: none;"
          >
            Ver detalle →
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);
      this.markersLayer.addLayer(marker);
    });

    if (inmuebles.length > 0) {
      const bounds = this.markersLayer.getBounds();
      if (bounds.isValid()) {
        this.map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }

  centrarEnInmueble(inmueble: PropiedadVentaCardDTO | PropiedadAlquilerCardDTO): void {
    const { ubicacion } = inmueble;
    if (ubicacion && ubicacion.lat != null && ubicacion.lng != null) {
      this.map.setView([ubicacion.lat, ubicacion.lng], 16);
    }
  }

  cerrarPanel(): void {
    this.mostrarPanel = false;
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 50);
  }

  private limpiarResultados(): void {
    this.markersLayer.clearLayers();
    this.resultadosVenta = [];
    this.resultadosAlquiler = [];
    this.busquedaRealizada = false;
    this.mostrarPanel = false;
  }

  /** Devuelve los resultados según el tipo de búsqueda */
  get resultados(): (PropiedadVentaCardDTO | PropiedadAlquilerCardDTO)[] {
    return this.tipoBusqueda === 'venta' ? this.resultadosVenta : this.resultadosAlquiler;
  }

  /** Formatea el precio según el tipo de búsqueda */
  formatearPrecio(inmueble: PropiedadVentaCardDTO | PropiedadAlquilerCardDTO): string {
    if (this.tipoBusqueda === 'venta') {
      const v = inmueble as PropiedadVentaCardDTO;
      return v.precio_venta != null ? `💰 ${v.precio_venta.toLocaleString()} €` : '💰 Consultar precio';
    } else {
      const a = inmueble as PropiedadAlquilerCardDTO;
      return a.precio_alquiler != null ? `💰 ${a.precio_alquiler.toLocaleString()} €/mes` : '💰 Consultar precio';
    }
  }
}
