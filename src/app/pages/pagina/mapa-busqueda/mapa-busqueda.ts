import { Component, OnDestroy, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet-draw';
import { InmuebleService } from '../../service/inmueble.service';
import { PropiedadVentaCardDTO } from '../../interfaces/busqueda-zona';

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

@Component({
  selector: 'app-mapa-busqueda',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mapa-busqueda.html',
  styleUrls: ['./mapa-busqueda.scss'],
})
export class MapaBusqueda implements AfterViewInit, OnDestroy {
  // -----------------------------------------------------------------------
  // Inyección de dependencias
  // -----------------------------------------------------------------------
  private readonly inmuebleService = inject(InmuebleService);

  // -----------------------------------------------------------------------
  // Propiedades del mapa
  // -----------------------------------------------------------------------
  private map!: L.Map;
  private drawnItems!: L.FeatureGroup;
  private drawControl!: L.Control.Draw;
  private markersLayer!: L.FeatureGroup;

  // -----------------------------------------------------------------------
  // Estado del componente
  // -----------------------------------------------------------------------
  /** Indica si se está realizando una petición HTTP */
  cargando = false;
  /** Lista de inmuebles recibidos del backend */
  resultados: PropiedadVentaCardDTO[] = [];
  /** Se vuelve true tras la primera búsqueda */
  busquedaRealizada = false;

  // -----------------------------------------------------------------------
  // Ciclo de vida
  // -----------------------------------------------------------------------

  ngAfterViewInit(): void {
    // ═════════════════════════════════════════════════════════════════════
    //  SOLUCIÓN AL BUG DE ICONOS DE LEAFLET EN ANGULAR
    //  Los iconos por defecto de Leaflet se rompen en Angular porque
    //  webpack / esbuild no resuelve correctamente las rutas de las
    //  imágenes PNG que Leaflet espera encontrar en su directorio.
    //  Reconfiguramos el prototipo para que use rutas absolutas desde
    //  node_modules.
    // ═════════════════════════════════════════════════════════════════════
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/images/marker-icon-2x.png',
      iconUrl: 'assets/images/marker-icon.png',
      shadowUrl: 'assets/images/marker-shadow.png',
    });

    this.inicializarMapa();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  // -----------------------------------------------------------------------
  // Inicialización del mapa
  // -----------------------------------------------------------------------

  private inicializarMapa(): void {
    // ── 1. Crear el mapa centrado en España ──────────────────────────────
    this.map = L.map('mapaLeaflet', {
      center: [40.416775, -3.70379], // Madrid / centro de España
      zoom: 6,
      zoomControl: true,
    });

    // ── 2. Capa base de OpenStreetMap ────────────────────────────────────
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);

    // ── 3. FeatureGroup para almacenar los dibujos ───────────────────────
    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    // ── 4. Capa para los marcadores de resultados ────────────────────────
    this.markersLayer = new L.FeatureGroup();
    this.map.addLayer(this.markersLayer);

    // ── 5. Configurar el panel de dibujo (solo polígono) ─────────────────
    const drawOptions: L.Control.DrawConstructorOptions = {
      position: 'topright',
      draw: {
        // Desactivamos TODAS las herramientas excepto polygon
        polyline: false,
        circle: false,
        rectangle: false,
        marker: false,
        circlemarker: false,
        polygon: {
          allowIntersection: false, // Evita que el usuario cruce líneas
          shapeOptions: {
            color: '#3b82f6', // Azul primary
            weight: 2,
            opacity: 0.8,
            fillColor: '#3b82f6',
            fillOpacity: 0.2,
          },
          showArea: true, // Muestra el área mientras se dibuja
        },
      },
      edit: {
        featureGroup: this.drawnItems,
        edit: false, // Desactivamos edición para mantenerlo simple
        remove: true, // Permitir borrar el polígono dibujado
      },
    };

    this.drawControl = new L.Control.Draw(drawOptions);
    this.map.addControl(this.drawControl);

    // ── 6. Escuchar el evento de creación de polígono ────────────────────
    this.map.on(L.Draw.Event.CREATED, (event: any) => {
      this.onPoligonoCreado(event);
    });

    // ── 7. Escuchar el evento de borrado para limpiar resultados ─────────
    this.map.on(L.Draw.Event.DELETED, () => {
      this.limpiarResultados();
    });
  }

  // -----------------------------------------------------------------------
  // Manejo del dibujo del polígono
  // -----------------------------------------------------------------------

  /**
   * Se ejecuta cuando el usuario termina de dibujar un polígono.
   * Extrae las coordenadas, las convierte a WKT y envía la petición HTTP.
   */
  private onPoligonoCreado(event: L.DrawEvents.Created): void {
    const layer = event.layer;

    // Limpiar dibujos anteriores y marcadores
    this.drawnItems.clearLayers();
    this.markersLayer.clearLayers();
    this.resultados = [];
    this.busquedaRealizada = false;

    // Añadir el nuevo polígono al grupo
    this.drawnItems.addLayer(layer);

    // Ajustar el zoom para que se vea el polígono completo
    if (layer instanceof L.Polygon) {
      this.map.fitBounds(layer.getBounds(), { padding: [50, 50] });
    }

    // ── Extraer coordenadas del polígono ─────────────────────────────────
    const latlngs = this.extraerCoordenadasPoligono(layer);

    if (!latlngs || latlngs.length < 3) {
      console.warn('[MapaBusqueda] El polígono tiene menos de 3 puntos, no se puede procesar.');
      return;
    }

    // ── Convertir a WKT ──────────────────────────────────────────────────
    const wkt = this.coordenadasToWkt(latlngs);
    console.log('[MapaBusqueda] 🗺️ WKT generado:', wkt);

    // ── Enviar al backend ────────────────────────────────────────────────
    this.buscarInmueblesPorZona(wkt);
  }

  // -----------------------------------------------------------------------
  // Extracción de coordenadas
  // -----------------------------------------------------------------------

  /**
   * Extrae el array de {lat, lng} desde la capa del polígono dibujado.
   * Soporta tanto L.Polygon como L.Polyline.
   */
  private extraerCoordenadasPoligono(layer: L.Layer): Array<{ lat: number; lng: number }> {
    const coords: Array<{ lat: number; lng: number }> = [];

    if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
      // Para polígonos, getLatLngs() devuelve un array de anillos.
      // El primer anillo (índice 0) es el perímetro exterior.
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

  // -----------------------------------------------------------------------
  // Conversión a WKT (Well-Known Text)
  // -----------------------------------------------------------------------

  /**
   * Convierte un array de coordenadas {lat, lng} al formato WKT:
   *   POLYGON((lng1 lat1, lng2 lat2, ..., lng1 lat1))
   *
   * Requisitos WKT:
   *   - Las coordenadas se expresan como "lng lat" (longitud primero).
   *   - El primer punto debe repetirse al final para cerrar el polígono.
   *   - Los valores decimales usan punto como separador.
   */
  private coordenadasToWkt(coords: Array<{ lat: number; lng: number }>): string {
    if (coords.length < 3) {
      throw new Error('Se necesitan al menos 3 puntos para formar un polígono WKT.');
    }

    // Construir la cadena de coordenadas: "lng1 lat1, lng2 lat2, ..."
    const puntos = coords
      .map((p) => `${p.lng} ${p.lat}`)
      .join(', ');

    // Repetir el primer punto al final para cerrar la geometría
    const primerPunto = `${coords[0].lng} ${coords[0].lat}`;
    const wkt = `POLYGON((${puntos}, ${primerPunto}))`;

    return wkt;
  }

  // -----------------------------------------------------------------------
  // Petición HTTP al backend
  // -----------------------------------------------------------------------

  /**
   * Envía el WKT al backend y pinta los marcadores con los resultados.
   * Endpoint: POST /inmuebles/ventas/buscar-por-zona
   * Body: { poligono: "POLYGON((...))" }
   * El backend recibe un BusquedaZonaDTO con el campo "poligono".
   */
  private buscarInmueblesPorZona(wkt: string): void {
    this.cargando = true;
    this.busquedaRealizada = false;

    this.inmuebleService.buscarVentasPorZona({ poligono: wkt }).subscribe({
      next: (inmuebles) => {
        this.cargando = false;
        this.busquedaRealizada = true;
        this.resultados = inmuebles;
        this.pintarMarcadores(inmuebles);
        console.log(`[MapaBusqueda] ✅ ${inmuebles.length} inmuebles recibidos.`);
      },
      error: (err) => {
        this.cargando = false;
        this.busquedaRealizada = true;
        console.error('[MapaBusqueda] ❌ Error al buscar inmuebles por zona:', err);
      },
    });
  }

  // -----------------------------------------------------------------------
  // Renderizado de marcadores
  // -----------------------------------------------------------------------

  /**
   * Limpia los marcadores anteriores y pinta los nuevos en el mapa.
   * Cada marcador incluye un popup con dirección, precio y enlace.
   */
  private pintarMarcadores(inmuebles: PropiedadVentaCardDTO[]): void {
    // Limpiar marcadores anteriores
    this.markersLayer.clearLayers();

    inmuebles.forEach((inmueble) => {
      const { ubicacion } = inmueble;

      if (!ubicacion || ubicacion.lat == null || ubicacion.lng == null) {
        console.warn('[MapaBusqueda] ⚠️ Inmueble sin coordenadas válidas:', inmueble.id_prop);
        return;
      }

      // Crear el marcador
      const marker = L.marker([ubicacion.lat, ubicacion.lng]);

      // Construir el contenido del popup
      const precio =
        inmueble.precio_venta != null
          ? `${inmueble.precio_venta.toLocaleString()} €`
          : inmueble.precio_alquiler != null
            ? `${inmueble.precio_alquiler.toLocaleString()} €/mes`
            : 'Consultar precio';

      const tipoRuta = inmueble.type === 'venta' ? 'venta' : 'alquiler';

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

    // Si hay marcadores, ajustar el zoom para que se vean todos
    if (inmuebles.length > 0) {
      const bounds = this.markersLayer.getBounds();
      if (bounds.isValid()) {
        this.map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }

  // -----------------------------------------------------------------------
  // Limpieza
  // -----------------------------------------------------------------------

  /** Limpia los resultados y marcadores cuando se borra el polígono */
  private limpiarResultados(): void {
    this.markersLayer.clearLayers();
    this.resultados = [];
    this.busquedaRealizada = false;
  }
}
