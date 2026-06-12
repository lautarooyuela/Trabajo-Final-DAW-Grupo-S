import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/usuarios';
  usuario = signal<Usuario | null>(null);

  constructor(private http: HttpClient) {
    const guardado = localStorage.getItem('usuario');
    if (guardado) {
      this.usuario.set(JSON.parse(guardado));
    }
  }

  login(nombreUsuario: string, clave: string) {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { nombreUsuario, clave });
  }

  setUsuario(u: Usuario) {
    this.usuario.set(u);
    localStorage.setItem('usuario', JSON.stringify(u));
  }

  logout() {
    this.usuario.set(null);
    localStorage.removeItem('usuario');
  }

  estaLogueado(): boolean {
    return this.usuario() !== null;
  }
}
