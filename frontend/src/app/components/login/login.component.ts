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
    <div class="login-container">
      <div class="login-card">
        <h2>{{ registrando() ? 'Crear cuenta' : 'Bienvenido' }}</h2>
        <p class="subtitle">
          {{ registrando() ? 'Regístrate para comenzar' : 'Inicia sesión en tu panel' }}
        </p>

        @if (!registrando()) {
          <form (ngSubmit)="onSubmit()">
            <div class="field">
              <label>Usuario</label>
              <input
                type="text"
                [(ngModel)]="nombreUsuario"
                name="usuario"
                placeholder="Tu nombre de usuario"
                required
              />
            </div>
            <div class="field">
              <label>Contraseña</label>
              <input
                type="password"
                [(ngModel)]="clave"
                name="clave"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" class="login-btn">Entrar al sistema</button>
          </form>
        } @else {
          <form (ngSubmit)="crearUsuario()">
            <div class="field">
              <label>Usuario</label>
              <input
                type="text"
                [(ngModel)]="nuevoUsuario.nombreUsuario"
                name="nuevoUsuario"
                placeholder="Elige un usuario"
                required
              />
            </div>
            <div class="field">
              <label>Contraseña</label>
              <input
                type="password"
                [(ngModel)]="nuevoUsuario.clave"
                name="nuevaClave"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            <button type="submit" class="login-btn">Registrarse</button>
          </form>
        }

        <button type="button" class="link-btn" (click)="toggleRegistro()">
          {{
            registrando()
              ? '¿Ya tienes cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate gratis'
          }}
        </button>

        @if (error()) {
          <div class="alert error-alert">{{ error() }}</div>
        }
        @if (mensaje()) {
          <div class="alert success-alert">{{ mensaje() }}</div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: var(--bg-main);
      }

      .login-card {
        background: var(--bg-card);
        padding: 48px;
        border-radius: 20px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        width: 100%;
        max-width: 400px;
        text-align: center;
        border: 1px solid var(--border-color);
      }

      h2 {
        margin-bottom: 8px;
        color: var(--text-primary);
        font-size: 2em;
        font-weight: 800;
      }
      .subtitle {
        color: var(--text-secondary);
        margin-bottom: 32px;
        font-size: 0.95em;
      }

      .field {
        text-align: left;
        margin-bottom: 20px;
      }
      label {
        display: block;
        margin-bottom: 8px;
        color: var(--text-secondary);
        font-size: 0.85em;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      input {
        width: 100%;
        padding: 14px 18px;
        background-color: var(--bg-main) !important;
        border: 1px solid var(--border-color) !important;
        border-radius: 12px !important;
        color: var(--text-primary) !important;
        font-size: 1em;
        transition: all 0.2s;
        box-sizing: border-box;
      }

      input:focus {
        border-color: var(--primary-color) !important;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15) !important;
      }

      .login-btn {
        width: 100%;
        padding: 14px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 700;
        font-size: 1em;
        margin-top: 12px;
        transition: all 0.2s;
        box-sizing: border-box;
      }

      .login-btn:hover {
        filter: brightness(1.1);
        transform: translateY(-1px);
      }

      .link-btn {
        margin-top: 24px;
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-weight: 500;
        font-size: 0.9em;
      }

      .link-btn:hover {
        color: var(--primary-color);
      }

      .alert {
        margin-top: 24px;
        padding: 12px;
        border-radius: 10px;
        font-size: 0.9em;
        font-weight: 600;
      }

      .error-alert {
        background-color: rgba(239, 68, 68, 0.1);
        color: var(--danger-color);
        border: 1px solid rgba(239, 68, 68, 0.2);
      }
      .success-alert {
        background-color: rgba(16, 185, 129, 0.1);
        color: var(--success-color);
        border: 1px solid rgba(16, 185, 129, 0.2);
      }
    `,
  ],
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
