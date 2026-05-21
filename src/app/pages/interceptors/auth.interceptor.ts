import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../service/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/** Rutas que NO necesitan token JWT */
const RUTAS_PUBLICAS = [
  '/auth/',
  '/api/tasacion/'
];

function esRutaPublica(url: string): boolean {
  return RUTAS_PUBLICAS.some(ruta => url.includes(ruta));
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const token = authService.getToken();

  let request = req;

  // --- PARTE 1: AGREGAR EL TOKEN SOLO A RUTAS NO PÚBLICAS ---
  if (token && !esRutaPublica(req.url)) {
    // Si el body es FormData, NO clonar el request para no perder el Content-Type multipart/form-data con su boundary
    if (req.body instanceof FormData) {
      // Para FormData, NO podemos usar setHeaders porque Angular pierde el Content-Type multipart/form-data
      // En su lugar, usamos headers que no sobrescriban el Content-Type automático del navegador
      const headers = req.headers.set('Authorization', `Bearer ${token}`);
      request = req.clone({ headers });
    } else {
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  // --- PARTE 2: MANEJO DE ERRORES ---
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const isLoginRequest = req.url.includes('/auth/login');
      
      if (error.status === 401 && !isLoginRequest) {
        console.warn('[AuthInterceptor] Token inválido/expirado (401). Redirigiendo al login...');
        authService.logout();
        router.navigate(['/login']);
      } else if (error.status === 403 && !isLoginRequest) {
        console.warn('[AuthInterceptor] Acceso denegado (403) a:', req.url);
      }
      
      return throwError(() => error);
    })
  );
};
