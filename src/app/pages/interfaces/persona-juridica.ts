export interface PersonaJuridica {
  type: 'juridica';
  nro_doc_per: string;
  tipo_doc_per: string;
  nombre_per: string;
  apellido_pat_per: string;
  apellido_mat_per: string;
  sexo_per: string;
  anio_nac_per: number;
  domicilio_per: string;
  cp_per: string;
  provincia_per: string;
  foto_per?: string;
  nombre_representante_juri: string;
  cargo_juri: string;
  registro_mercantil_juri: string;
}
