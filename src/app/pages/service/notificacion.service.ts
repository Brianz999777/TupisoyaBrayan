import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Notificacion } from '../interfaces/notificacion';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/tupisoya/notificacion';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  listarNotificaciones(correo: string): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.baseUrl}/${correo}`, { headers: this.getHeaders() });
  }

  marcarLeida(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/leida`, {}, { headers: this.getHeaders(), responseType: 'text' });
  }
}
