import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PropiedadVenta, PropiedadAlquiler, InmuebleVentaDto, TarjetaVenta, TarjetaAlquiler } from '../interfaces/inmueble';
import { ContactoInmuebleDTO } from '../interfaces/contacto-inmueble';

@Injectable({
  providedIn: 'root'
})
export class InmuebleService {
  private http = inject(HttpClient);
  // Asumiendo que esta es tu URL base para inmuebles (ajústala según tu backend)
  private readonly baseUrl = '/tupisoya/inmuebles';
  private readonly emailUrl = '/tupisoya/email';

  getVentas(): Observable<TarjetaVenta[]> {
    console.log(`[InmuebleService] 🔍 GET ventas → ${this.baseUrl}/ventas`);
    return this.http.get<TarjetaVenta[]>(`${this.baseUrl}/ventas`);
  }

  getAlquileres(): Observable<TarjetaAlquiler[]> {
    console.log(`[InmuebleService] 🔍 GET alquileres → ${this.baseUrl}/alquiler`);
    return this.http.get<TarjetaAlquiler[]>(`${this.baseUrl}/alquiler`);
  }

  /** Búsqueda por palabra clave en alquileres */
  buscarAlquileres(palabra: string): Observable<TarjetaAlquiler[]> {
    console.log(`[InmuebleService] 🔍 GET buscar alquileres → ${this.baseUrl}/alquiler/busqueda/${encodeURIComponent(palabra)}`);
    return this.http.get<TarjetaAlquiler[]>(`${this.baseUrl}/alquiler/busqueda/${encodeURIComponent(palabra)}`);
  }

  /** Búsqueda por palabra clave en ventas */
  buscarVentas(palabra: string): Observable<TarjetaVenta[]> {
    console.log(`[InmuebleService] 🔍 GET buscar ventas → ${this.baseUrl}/ventas/busqueda/${encodeURIComponent(palabra)}`);
    return this.http.get<TarjetaVenta[]>(`${this.baseUrl}/ventas/busqueda/${encodeURIComponent(palabra)}`);
  }

  getVentaById(id: number): Observable<PropiedadVenta> {
    console.log(`[InmuebleService] 🔍 GET venta by ID → ${this.baseUrl}/ventas/${id}`);
    return this.http.get<PropiedadVenta>(`${this.baseUrl}/ventas/${id}`);
  }

  getAlquilerById(id: number): Observable<PropiedadAlquiler> {
    console.log(`[InmuebleService] 🔍 GET alquiler by ID → ${this.baseUrl}/alquiler/${id}`);
    return this.http.get<PropiedadAlquiler>(`${this.baseUrl}/alquiler/${id}`);
  }

  insertVenta(venta: PropiedadVenta): Observable<PropiedadVenta> {
    const payload = { ...venta, type: 'venta' };
    console.log(`[InmuebleService] ➕ POST insertVenta → ${this.baseUrl}/ventas`, payload);
    return this.http.post<PropiedadVenta>(`${this.baseUrl}/ventas`, payload);
  }

  crearVenta(venta: any): Observable<any> {
    const payload = { ...venta, type: 'venta' };
    console.log(`[InmuebleService] ➕ POST crearVenta → ${this.baseUrl}/ventas`, payload);
    return this.http.post<any>(`${this.baseUrl}/ventas`, payload);
  }

  crearAlquiler(alquiler: any): Observable<any> {
    const payload = { ...alquiler, type: 'alquiler' };
    console.log(`[InmuebleService] ➕ POST crearAlquiler → ${this.baseUrl}/alquiler`, payload);
    return this.http.post<any>(`${this.baseUrl}/alquiler`, payload);
  }

  updateVenta(id: number, venta: any): Observable<any> {
    const payload = { ...venta, type: 'venta' };
    console.log(`[InmuebleService] ✏️ PUT updateVenta → ${this.baseUrl}/ventas/${id}`, payload);
    return this.http.put<any>(`${this.baseUrl}/ventas/${id}`, payload);
  }

  insertAlquiler(alquiler: PropiedadAlquiler): Observable<PropiedadAlquiler> {
    const payload = { ...alquiler, type: 'alquiler' };
    console.log(`[InmuebleService] ➕ POST insertAlquiler → ${this.baseUrl}/alquiler`, payload);
    return this.http.post<PropiedadAlquiler>(`${this.baseUrl}/alquiler`, payload);
  }

  updateAlquiler(id: number, alquiler: any): Observable<any> {
    const payload = { ...alquiler, type: 'alquiler' };
    console.log(`[InmuebleService] ✏️ PUT updateAlquiler → ${this.baseUrl}/alquiler/${id}`, payload);
    return this.http.put<any>(`${this.baseUrl}/alquiler/${id}`, payload);
  }

  // Publicaciones del usuario logueado
  getVentasByUser(nroDoc: string): Observable<any[]> {
    console.log(`[InmuebleService] 🔍 GET ventas by user → ${this.baseUrl}/ventas/usuario/${nroDoc}`);
    return this.http.get<any[]>(`${this.baseUrl}/ventas/usuario/${nroDoc}`);
  }

  getAlquileresByUser(nroDoc: string): Observable<any[]> {
    console.log(`[InmuebleService] 🔍 GET alquileres by user → ${this.baseUrl}/alquiler/usuario/${nroDoc}`);
    return this.http.get<any[]>(`${this.baseUrl}/alquiler/usuario/${nroDoc}`);
  }

  deleteVenta(id: number): Observable<any> {
    console.log(`[InmuebleService] 🗑️ DELETE venta → ${this.baseUrl}/ventas/${id}`);
    return this.http.delete<any>(`${this.baseUrl}/ventas/${id}`);
  }

  deleteAlquiler(id: number): Observable<any> {
    console.log(`[InmuebleService] 🗑️ DELETE alquiler → ${this.baseUrl}/alquiler/${id}`);
    return this.http.delete<any>(`${this.baseUrl}/alquiler/${id}`);
  }

  subirFotos(propiedadId: number, type: string, formData: FormData): Observable<any> {
    const endpoint = type === 'venta' ? 'ventas' : 'alquiler';
    console.log(`[InmuebleService] 📸 POST subirFotos → ${this.baseUrl}/${endpoint}/${propiedadId}/fotos`);
    return this.http.post<any>(`${this.baseUrl}/${endpoint}/${propiedadId}/fotos`, formData);
  }

  /** Envía un email al dueño del inmueble expresando interés */
  enviarEmailContacto(dto: ContactoInmuebleDTO): Observable<string> {
    console.log(`[InmuebleService] 📧 POST enviarEmailContacto → ${this.emailUrl}`, dto);
    return this.http.post<string>(`${this.emailUrl}`, dto, { responseType: 'text' as 'json' });
  }
}
