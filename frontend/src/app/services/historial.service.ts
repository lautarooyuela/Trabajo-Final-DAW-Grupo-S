import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Historial } from '../models/historial.model';

@Injectable({ providedIn: 'root' })
export class HistorialService {
  private apiUrl = '/api/historial';

  constructor(private http: HttpClient) {}

  obtenerPorEntidad(entidad: string, entidadId: number) {
    return this.http.get<Historial[]>(`${this.apiUrl}/${entidad}/${entidadId}`);
  }

  obtenerPorEntidadGeneral(entidad: string) {
    return this.http.get<Historial[]>(`${this.apiUrl}/${entidad}`);
  }

  obtenerPorUsuario(usuarioId: number) {
    return this.http.get<Historial[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }
}