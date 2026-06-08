import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tarea } from '../models/tarea.model';

@Injectable({ providedIn: 'root' })
export class TareaService {
  private apiUrl = 'http://localhost:3000/tareas';

  constructor(private http: HttpClient) {}

  obtenerPorProyecto(proyectoId: number) {
    return this.http.get<Tarea[]>(`${this.apiUrl}/proyecto/${proyectoId}`);
  }

  crear(tarea: Partial<Tarea>) {
    return this.http.post<Tarea>(this.apiUrl, tarea);
  }

  actualizar(id: number, tarea: Partial<Tarea>) {
    return this.http.patch<Tarea>(`${this.apiUrl}/${id}`, tarea);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  darDeBaja(id: number) {
    return this.http.delete<Tarea>(`${this.apiUrl}/${id}`);
  }
}
