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
      this.usuario.set(this.normalizarUsuario(JSON.parse(guardado)));
    }
  }

  private normalizarUsuario(usuario: Usuario): Usuario {
    return {
      ...usuario,
      rol: usuario.rol ?? (usuario.nombreUsuario === 'admin' ? 'ADMIN' : 'LECTOR'),
      estado: usuario.estado ?? 'ACTIVO',
    };
  }

  login(nombreUsuario: string, clave: string) {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { nombreUsuario, clave });
  }

  setUsuario(u: Usuario) {
    const normalizado = this.normalizarUsuario(u);
    this.usuario.set(normalizado);
    localStorage.setItem('usuario', JSON.stringify(normalizado));
  }

  logout() {
    this.usuario.set(null);
    localStorage.removeItem('usuario');
  }

  estaLogueado(): boolean {
    return this.usuario() !== null;
  }

  esAdmin(): boolean {
    return this.usuario()?.rol === 'ADMIN';
  }

  puedeCrear(): boolean {
    const rol = this.usuario()?.rol;
    return rol === 'ADMIN' || rol === 'EDITOR';
  }

  puedeEditar(): boolean {
    return this.puedeCrear();
  }

  puedeEliminar(): boolean {
    return this.esAdmin();
  }

  puedeGestionarClientes(): boolean {
    const rol = this.usuario()?.rol;
    return rol === 'ADMIN' || rol === 'EDITOR';
  }
}
