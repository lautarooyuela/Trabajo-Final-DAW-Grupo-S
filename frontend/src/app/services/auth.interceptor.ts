import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { AuthStore } from './auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authStore = inject(AuthStore);
  const usuario = authService.usuario();
  const token = authStore.obtenerToken();

  let headers = req.headers;

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  if (usuario) {
    headers = headers.set('X-Usuario', usuario.nombreUsuario);
  }

  const cloned = req.clone({ headers });
  return next(cloned);
};