export interface UserDTO {
  nro_doc_dto: string;
  email_dto: string;
  rol_dto: string;
  nombre_dto: string;
  apellidos_dto: string;
  foto_dto: string | null;
  // Para compatibilidad con el perfil
  type?: string;
  nombre_representante_juri?: string;
  cargo_juri?: string;
  registro_mercantil_juri?: string;
}
