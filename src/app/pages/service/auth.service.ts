import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDTO } from '../interfaces/user-dto';
import { tap } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class Auth {

  private readonly baseUrl = 'http://localhost:8080/tupisoya';

  private readonly tokenKey = 'authToken';
  private readonly userKey = 'authUser';

  constructor(private http: HttpClient) {}

  register(registerRequest: any) {
    console.log("registerRequest AUTH", registerRequest);
    console.log("registerRequest", registerRequest.persona_dto);
    
    
    // Retornamos el observable SIN suscribirnos aquí
    return this.http.post<any>(`${this.baseUrl}/auth/register`, registerRequest).pipe(
      tap((response) => {
        // Esto se ejecuta automáticamente cuando el componente se suscriba
        this.setToken(response.token);
        this.setUser(response.usuario_dto); // Ojo: verifica si es usuario_dto o usuarioDTO
      })
    );
  }

  // Haz lo mismo con el login para evitar errores futuros
  login(loginRequest: any) {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, loginRequest).pipe(
      tap((response) => {
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

  setUser(user: UserDTO): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    
  }

  getUser(): UserDTO | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }
}
