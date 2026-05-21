import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Notificacion } from '../interfaces/notificacion';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/tupisoya/notificacion';

  listarNotificaciones(correo: string): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.baseUrl}/${correo}`);
  }

  marcarLeida(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/leida`, {}, { responseType: 'text' });
  }
}
