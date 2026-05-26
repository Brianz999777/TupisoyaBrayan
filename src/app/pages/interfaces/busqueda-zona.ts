/** DTO para búsqueda de inmuebles por zona geográfica (polígono WKT) */
export interface BusquedaZonaDTO {
  poligono: string;
}

/** DTO de respuesta para propiedades en venta encontradas por zona */
export interface PropiedadVentaCardDTO {
  id_prop: number;
  nro_ref_prop: string;
  direccion_prop: string;
  numero_prop: number;
  poblacion_prop?: string;
  provincia_prop: string;
  nro_habitaciones_prop: number;
  nro_banos_prop: number;
  metros_prop: number;
  descripcion_prop: string;
  foto_principal: string;
  precio_venta?: number;
  precio_alquiler?: number;
  type?: 'venta' | 'alquiler';
  ubicacion: {
    lat: number;
    lng: number;
  };
}
