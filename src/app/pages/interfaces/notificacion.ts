export interface Notificacion {
    id_noti: number;
    correo_usuario_noti: string;
    mensaje_noti: string;
    id_prop_noti: number;
    tipo_prop_noti: string;
    leida_noti: boolean;
    fecha_noti: string; // LocalDateTime como string ISO
}
