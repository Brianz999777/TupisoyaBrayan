import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Alerta } from '../interfaces/alerta';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/tupisoya/alertas';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  crearAlerta(alerta: Alerta): Observable<Alerta> {
    return this.http.post<Alerta>(this.baseUrl, alerta, { headers: this.getHeaders() });
  }

  getAlertasByCorreo(correo: string): Observable<Alerta[]> {
    return this.http.get<Alerta[]>(`${this.baseUrl}/${correo}`, { headers: this.getHeaders() });
  }

  deleteAlerta(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders(), responseType: 'text' });
  }
}
