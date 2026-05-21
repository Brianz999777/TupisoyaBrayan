import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PropiedadVenta, PropiedadAlquiler, InmuebleVentaDto, TarjetaVenta, TarjetaAlquiler } from '../interfaces/inmueble';

@Injectable({
  providedIn: 'root'
})
export class InmuebleService {
  private http = inject(HttpClient);
  // Asumiendo que esta es tu URL base para inmuebles (ajústala según tu backend)
  private readonly baseUrl = 'http://localhost:8080/tupisoya/inmuebles';

  getVentas(): Observable<TarjetaVenta[]> {
    return this.http.get<TarjetaVenta[]>(`${this.baseUrl}/ventas`);
  }

  getAlquileres(): Observable<TarjetaAlquiler[]> {
    return this.http.get<TarjetaAlquiler[]>(`${this.baseUrl}/alquiler`);
  }

  getVentaById(id: number): Observable<PropiedadVenta> {
    return this.http.get<PropiedadVenta>(`${this.baseUrl}/ventas/${id}`);
  }

  getAlquilerById(id: number): Observable<PropiedadAlquiler> {
    return this.http.get<PropiedadAlquiler>(`${this.baseUrl}/alquiler/${id}`);
  }

  insertVenta(venta: PropiedadVenta): Observable<PropiedadVenta> {
    const payload = { ...venta, type: 'venta' };
    return this.http.post<PropiedadVenta>(`${this.baseUrl}/ventas`, payload);
  }

  crearVenta(venta: any): Observable<any> {
    const payload = { ...venta, type: 'venta' };
    return this.http.post<any>(`${this.baseUrl}/ventas`, payload);
  }

  crearAlquiler(alquiler: any): Observable<any> {
    const payload = { ...alquiler, type: 'alquiler' };
    return this.http.post<any>(`${this.baseUrl}/alquiler`, payload);
  }

  updateVenta(id: number, venta: PropiedadVenta): Observable<PropiedadVenta> {
    const payload = { ...venta, type: 'venta' };
    return this.http.put<PropiedadVenta>(`${this.baseUrl}/ventas/${id}`, payload);
  }

  insertAlquiler(alquiler: PropiedadAlquiler): Observable<PropiedadAlquiler> {
    const payload = { ...alquiler, type: 'alquiler' };
    return this.http.post<PropiedadAlquiler>(`${this.baseUrl}/alquiler`, payload);
  }

  updateAlquiler(id: number, alquiler: PropiedadAlquiler): Observable<PropiedadAlquiler> {
    const payload = { ...alquiler, type: 'alquiler' };
    return this.http.put<PropiedadAlquiler>(`${this.baseUrl}/alquiler/${id}`, payload);
  }

  // Publicaciones del usuario logueado
  getVentasByUser(nroDoc: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ventas/usuario/${nroDoc}`);
  }

  getAlquileresByUser(nroDoc: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/alquiler/usuario/${nroDoc}`);
  }

  deleteVenta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/ventas/${id}`);
  }

  deleteAlquiler(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/alquiler/${id}`);
  }
}
