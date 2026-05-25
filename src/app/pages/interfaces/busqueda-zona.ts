/** DTO para búsqueda de inmuebles por zona geográfica (polígono WKT) */
export interface BusquedaZonaDTO {
  poligono: string;
}

/** DTO de respuesta para propiedades en venta encontradas por zona */
export interface PropiedadVentaCardDTO {
  id_prop: number;
  direccion_prop: string;
  provincia_prop: string;
  poblacion_prop?: string;
  nro_habitaciones_prop: number;
  nro_banos_prop: number;
  metros_prop: number;
  precio_venta?: number;
  precio_alquiler?: number;
  type?: 'venta' | 'alquiler';
  ubicacion: {
    lat: number;
    lng: number;
  };
}
