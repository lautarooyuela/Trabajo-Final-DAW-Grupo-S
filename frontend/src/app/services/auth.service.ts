import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { AuthStore } from './auth.store';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStore = inject(AuthStore);
  usuario = signal<Usuario | null>(null);

  constructor() {
    const token = this.authStore.obtenerToken();
    if (token) {
      this.cargarUsuarioDesdeToken(token);
    }
  }

  private cargarUsuarioDesdeToken(token: string) {
    try {
      const decoded: any = jwtDecode(token);
      // El payload del backend es { nombre: usuario.nombreUsuario, sub: usuario.id, rol: usuario.rol }
      const usuario: Usuario = {
        id: decoded.sub,
        nombreUsuario: decoded.nombre,
        rol: decoded.rol,
        clave: '', // No necesitamos la clave en el frontend
        estado: 'ACTIVO' // Si tiene token, está activo
      };
      this.usuario.set(usuario);
    } catch (error) {
      console.error('Error decodificando token', error);
      this.logout();
    }
  }

  setToken(token: string) {
    this.authStore.guardarToken(token);
    this.cargarUsuarioDesdeToken(token);
  }

  logout() {
    this.usuario.set(null);
    this.authStore.cerrarSesion();
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
