import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private apiUrl = '/api/clientes';

  constructor(private http: HttpClient) {}

  obtenerTodos() {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  obtenerActivos() {
    return this.http.get<Cliente[]>(`${this.apiUrl}/activos`);
  }

  obtenerPorId(id: number) {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  crear(cliente: Partial<Cliente>) {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  actualizar(id: number, cliente: Partial<Cliente>) {
    return this.http.patch<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  darDeBaja(id: number) {
    return this.http.delete<Cliente>(`${this.apiUrl}/${id}`);
  }
}
