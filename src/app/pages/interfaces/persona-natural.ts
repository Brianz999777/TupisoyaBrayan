export interface PersonaNatural {
  type: 'natural';
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
  primer_vivienda_natu: boolean;
  ingresos_aprox_natu: number;
}
