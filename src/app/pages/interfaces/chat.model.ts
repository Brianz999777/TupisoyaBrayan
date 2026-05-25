export interface Persona {
  nro_doc_dto: string;
  email_dto: string;
  nombre_dto: string;
  apellidos_dto: string;
  foto_dto: string | null;
}

export interface PropiedadSimplificada {
  id_prop: number;
  direccion_prop: string;
  provincia_prop: string;
  tipo_via_prop: string;
  foto_principal: string;
  tipo_inmueble: string;
}

export interface SalaChat {
  id_sala: number;
  propiedad: PropiedadSimplificada;
  comprador: Persona;
  vendedor: Persona;
  fecha_creacion: string;
}

export interface MensajeChat {
  id_mensaje?: number;
  id_sala: number;
  emisor_email: string;
  contenido: string;
  fecha_envio?: string;
  leido?: boolean;
}

/** DTO para enviar mensajes por WebSocket (coincide con MensajeInboundDTO del backend) */
export interface MensajeInboundDTO {
  id_sala: number;
  emisor_email: string;
  contenido: string;
}
