import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Notificacion } from '../interfaces/notificacion';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://tupisoyajava.onrender.com/tupisoya/notificacion';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  listarNotificaciones(correo: string): Observable<Notificacion[]> {
    console.log(`[NotificacionService] 🔔 GET notificaciones → ${this.baseUrl}/${correo}`);
    return this.http.get<Notificacion[]>(`${this.baseUrl}/${correo}`, { headers: this.getHeaders() });
  }

  marcarLeida(id: number): Observable<any> {
    console.log(`[NotificacionService] ✅ PUT marcar leída → ${this.baseUrl}/${id}/leida`);
    return this.http.put(`${this.baseUrl}/${id}/leida`, {}, { headers: this.getHeaders(), responseType: 'text' });
  }

  crearNotificacion(notificacion: {
    correo_usuario_noti: string;
    mensaje_noti: string;
    id_prop_noti: number;
    tipo_prop_noti: string;
  }): Observable<any> {
    console.log(`[NotificacionService] ➕ POST crear notificación → ${this.baseUrl}`, notificacion);
    return this.http.post(`${this.baseUrl}`, notificacion, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }
}
