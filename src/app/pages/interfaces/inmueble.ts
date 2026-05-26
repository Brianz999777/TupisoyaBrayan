export interface Foto {
    id_foto?: number;
    url_foto: string;
    descripcion_foto?: string;
}

export interface Propiedad {

    id_prop?: number;

    nro_ref_prop: string;

    tipo_via_prop: string;

    direccion_prop: string;

    numero_prop: number;

    planta_prop: number;

    puerta_prop: string;

    cp_prop: string;

    provincia_prop: string;

    poblacion_prop?: string;

    nro_catastral_prop: string;

    ascensor_prop: boolean;

    metros_prop: number;

    anyo_construccion_prop: number;

    antiguedad_prop: string;

    fecha_publicacion_prop: string;

    tipo_inmueble: 'casa' | 'piso';

    nro_habitaciones_prop: number;

    nro_banos_prop: number;

    fotos_urls: string[];

    type?: 'venta' | 'alquiler';
}

// =======================================================
// ======================= CARDS =========================
// =======================================================

export interface TarjetaAlquiler {

    id_prop: number;

    nro_ref_prop: string;

    direccion_prop: string;

    numero_prop?: number;

    provincia_prop: string;

    poblacion_prop?: string;

    nro_banos_prop: number;

    nro_habitaciones_prop: number;

    metros_prop: number;

    descripcion_prop: string;

    foto_principal: string;

    precio_alquiler: number;

    nro_personas_alquiler: number;

    planta_prop: number;

    permite_mascotas_alquiler: boolean;

    ascensor_prop: boolean;

    fotos?: Foto[];

    tipo_inmueble?: string;

    cp_prop?: string;
}

export interface TarjetaVenta {

    id_prop: number;

    nro_ref_prop: string;

    direccion_prop: string;

    numero_prop?: number;

    provincia_prop: string;

    poblacion_prop?: string;

    nro_banos_prop: number;

    nro_habitaciones_prop: number;

    metros_prop: number;

    descripcion_prop: string;

    foto_principal: string;

    precio_venta: number;

    planta_prop: number;

    clase_energetica_venta: string;

    reforma_venta: boolean;

    aire_acondicionado_venta: boolean;

    fotos?: Foto[];

    tipo_inmueble?: string;

    cp_prop?: string;
}

// =======================================================
// ===================== ALQUILER ========================
// =======================================================

export interface PropiedadAlquiler extends Propiedad {

    fianza_alquiler: number;

    nro_personas_alquiler: number;

    exterior_alquiler: boolean;

    permite_mascotas_alquiler: boolean;

    permite_parejas_alquiler: boolean;

    wifi_alquiler: boolean;

    permite_visitas_alquiler: boolean;

    descripcion_alquiler: string;

    precio_alquiler: number;
}

// =======================================================
// ======================= VENTA =========================
// =======================================================

export interface PropiedadVenta extends Propiedad {

    balcon_venta: boolean;

    clase_energetica_venta: string;

    amueblada_venta: boolean;

    garage_venta: boolean;

    aire_acondicionado_venta: boolean;

    libre_cargas_venta: boolean;

    negociable_venta: boolean;

    reforma_venta: boolean;

    descripcion_venta: string;

    precio_venta: number;
}

// =======================================================
// ====================== DTO VENTA ======================
// =======================================================

export interface InmuebleVentaDto {

    tipo_via_prop: string;

    direccion_prop: string;

    numero_prop: number;

    planta_prop: number;

    puerta_prop: string;

    cp_prop: string;

    provincia_prop: string;

    nro_catastral_prop: string;

    ascensor_prop: boolean;

    metros_prop: number;

    anyo_construccion_prop: number;

    antiguedad_prop: string;

    fecha_publicacion_prop: string;

    nro_habitaciones_prop: number;

    nro_banos_prop: number;

    balcon_venta: boolean;

    clase_energetica_venta: string;

    amueblada_venta: boolean;

    garage_venta: boolean;

    aire_acondicionado_venta: boolean;

    libre_cargas_venta: boolean;

    negociable_venta: boolean;

    reforma_venta: boolean;

    descripcion_venta: string;

    precio_venta: number;

    fotos_urls: string[];

    nro_doc_dueno: string;

    type: 'venta';
}