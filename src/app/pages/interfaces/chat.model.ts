export interface Persona {
  nro_doc_dto: string;
  email_dto: string;
  nombre_dto: string;
  apellidos_dto: string;
  foto_dto: string | null;
}

export interface SalaChat {
  id_sala: number;
  id_prop: number;
  nro_doc_comprador: string;
  nro_doc_vendedor: string;
  fecha_creacion: string;
  no_leidos?: number;
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
