import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Alerta } from '../interfaces/alerta';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/tupisoya/alertas';

  crearAlerta(alerta: Alerta): Observable<Alerta> {
    return this.http.post<Alerta>(this.baseUrl, alerta);
  }

  getAlertasByCorreo(correo: string): Observable<Alerta[]> {
    return this.http.get<Alerta[]>(`${this.baseUrl}/${correo}`);
  }

  deleteAlerta(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
}
