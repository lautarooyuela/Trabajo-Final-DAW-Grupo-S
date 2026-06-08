import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  obtenerTodos() {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  crear(usuario: Partial<Usuario> & { clave: string }) {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  actualizar(id: number, usuario: Partial<Usuario>) {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }
}
