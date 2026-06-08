import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Proyecto } from '../models/proyecto.model';

@Injectable({ providedIn: 'root' })
export class ProyectoService {
  private apiUrl = '/api/proyectos';

  constructor(private http: HttpClient) {}

  obtenerTodos() {
    return this.http.get<Proyecto[]>(this.apiUrl);
  }

  obtenerPorId(id: number) {
    return this.http.get<Proyecto>(`${this.apiUrl}/${id}`);
  }

  crear(proyecto: Partial<Proyecto>) {
    return this.http.post<Proyecto>(this.apiUrl, proyecto);
  }

  actualizar(id: number, proyecto: Partial<Proyecto>) {
    return this.http.patch<Proyecto>(`${this.apiUrl}/${id}`, proyecto);
  }

  darDeBaja(id: number) {
    return this.http.delete<Proyecto>(`${this.apiUrl}/${id}`);
  }
}
