import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDTO } from '../interfaces/user-dto';
import { tap } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class Auth {

  private readonly baseUrl = '/tupisoya';

  private readonly tokenKey = 'authToken';
  private readonly userKey = 'authUser';

  constructor(private http: HttpClient) {}

  register(registerRequest: any) {
    console.log(`[AuthService] 📝 POST register → ${this.baseUrl}/auth/register`, registerRequest);
    
    // Retornamos el observable SIN suscribirnos aquí
    return this.http.post<any>(`${this.baseUrl}/auth/register`, registerRequest).pipe(
      tap((response) => {
        console.log(`[AuthService] ✅ Register OK, token recibido`);
        // Esto se ejecuta automáticamente cuando el componente se suscriba
        this.setToken(response.token);
        this.setUser(response.usuario_dto); // Ojo: verifica si es usuario_dto o usuarioDTO
      })
    );
  }

  // Haz lo mismo con el login para evitar errores futuros
  login(loginRequest: any) {
    console.log(`[AuthService] 🔑 POST login → ${this.baseUrl}/auth/login`, loginRequest);
    return this.http.post<any>(`${this.baseUrl}/auth/login`, loginRequest).pipe(
      tap((response) => {
        console.log(`[AuthService] ✅ Login OK, token recibido`);
        this.setToken(response.token);
        this.setUser(response.usuario_dto);
      })
    );
  }


  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  cambioPassword(peticion: { password_actual: string; password_nueva: string }) {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/cambio-password`, peticion, { headers, responseType: 'text' });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** Limpia valores "N/A" que el backend envía para campos que no aplican (ej: persona jurídica no tiene nombre/apellidos) */
  private sanitizeUser(user: UserDTO): UserDTO {
    if (!user) return user;
    // Si el nombre es "N/A" o "N/A N/A", lo dejamos vacío
    if (user.nombre_dto && /^N\/A/i.test(user.nombre_dto.trim())) {
      user.nombre_dto = '';
    }
    if (user.apellidos_dto && /^N\/A/i.test(user.apellidos_dto.trim())) {
      user.apellidos_dto = '';
    }
    return user;
  }

  setUser(user: UserDTO): void {
    const sanitized = this.sanitizeUser(user);
    localStorage.setItem(this.userKey, JSON.stringify(sanitized));
  }

  getUser(): UserDTO | null {
    const user = localStorage.getItem(this.userKey);
    if (!user) return null;
    const parsed: UserDTO = JSON.parse(user);
    return this.sanitizeUser(parsed);
  }
}
