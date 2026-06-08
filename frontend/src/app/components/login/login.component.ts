import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { LoginApiClient } from '../../services/login-api-client.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
// ... (mismo template)
`,
// ... (mismos estilos)
})
export class LoginComponent {
  nombreUsuario = '';
  clave = '';
  registrando = signal(false);
  mensaje = signal('');
  error = signal('');
  nuevoUsuario: { nombreUsuario: string; clave: string } = {
    nombreUsuario: '',
    clave: '',
  };

  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private loginApiClient = inject(LoginApiClient);
  private router = inject(Router);

  toggleRegistro() {
    this.error.set('');
    this.mensaje.set('');
    this.registrando.set(!this.registrando());
  }

  onSubmit() {
    this.error.set('');
    this.loginApiClient.iniciarSesion(this.nombreUsuario, this.clave).subscribe({
      next: (response) => {
        this.authService.setToken(response.accessToken);
        this.router.navigate(['/proyectos']);
      },
      error: () => {
        this.error.set('Credenciales inválidas');
      },
    });
  }

  crearUsuario() {
    this.error.set('');
    this.mensaje.set('');

    if (!this.nuevoUsuario.nombreUsuario.trim() || !this.nuevoUsuario.clave.trim()) {
      this.error.set('Completa usuario y contraseña');
      return;
    }

    this.usuarioService
      .crear({
        nombreUsuario: this.nuevoUsuario.nombreUsuario,
        clave: this.nuevoUsuario.clave,
      })
      .subscribe({
        next: () => {
          this.mensaje.set('Usuario creado. Ya puedes iniciar sesión.');
          this.nombreUsuario = this.nuevoUsuario.nombreUsuario;
          this.clave = this.nuevoUsuario.clave;
          this.nuevoUsuario = { nombreUsuario: '', clave: '' };
          this.registrando.set(false);
        },
        error: () => {
          this.error.set('No se pudo crear el usuario');
        },
      });
  }
}
