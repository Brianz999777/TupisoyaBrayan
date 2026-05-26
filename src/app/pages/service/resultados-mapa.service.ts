import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PropiedadVentaCardDTO } from '../interfaces/busqueda-zona';

/**
 * Servicio compartido para pasar los resultados de búsqueda por zona
 * desde el componente MapaBusqueda al componente ResultadosMapa.
 */
@Injectable({
  providedIn: 'root',
})
export class ResultadosMapaService {
  private resultadosSource = new BehaviorSubject<PropiedadVentaCardDTO[]>([]);
  resultados$ = this.resultadosSource.asObservable();

  setResultados(resultados: PropiedadVentaCardDTO[]): void {
    this.resultadosSource.next(resultados);
  }

  getResultados(): PropiedadVentaCardDTO[] {
    return this.resultadosSource.getValue();
  }

  limpiar(): void {
    this.resultadosSource.next([]);
  }
}
