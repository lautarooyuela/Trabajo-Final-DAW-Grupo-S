import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>{{ registrando() ? 'Crear usuario' : 'Iniciar Sesión' }}</h2>

        @if (!registrando()) {
          <form (ngSubmit)="onSubmit()">
            <input type="text" [(ngModel)]="nombreUsuario" name="usuario" placeholder="Usuario" required />
            <input type="password" [(ngModel)]="clave" name="clave" placeholder="Contraseña" required />
            <button type="submit" class="login-btn">Ingresar</button>
          </form>
        } @else {
          <form (ngSubmit)="crearUsuario()">
            <input type="text" [(ngModel)]="nuevoUsuario.nombreUsuario" name="nuevoUsuario" placeholder="Usuario" required />
            <input type="password" [(ngModel)]="nuevoUsuario.clave" name="nuevaClave" placeholder="Contraseña" required />
            <button type="submit" class="login-btn">Crear cuenta</button>
          </form>
        }

        <button type="button" class="link-btn" (click)="toggleRegistro()">
          {{ registrando() ? 'Volver al login' : 'Crear usuario' }}
        </button>

        @if (error()) {
          <p class="error">{{ error() }}</p>
        }
        @if (mensaje()) {
          <p class="success">{{ mensaje() }}</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }

    .login-card {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      width: 300px;
      text-align: center;
    }

    h2 { margin-bottom: 20px; color: #333; }

    input {
      width: 100%;
      padding: 12px;
      margin-bottom: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }

    .login-btn {
      width: 100%;
      padding: 12px;
      background-color: #3f51b5;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }

    .login-btn:hover {
      background-color: #303f9f;
    }

    .link-btn {
      margin-top: 12px;
      background: none;
      border: none;
      color: #3f51b5;
      cursor: pointer;
      font-weight: 600;
    }

    .error {
      color: #d32f2f;
      margin-top: 15px;
      font-size: 0.9em;
    }

    .success {
      color: #2e7d32;
      margin-top: 15px;
      font-size: 0.9em;
    }
  `]
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

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}

  toggleRegistro() {
    this.error.set('');
    this.mensaje.set('');
    this.registrando.set(!this.registrando());
  }

  onSubmit() {
    this.error.set('');
    this.authService.login(this.nombreUsuario, this.clave).subscribe({
      next: (usuario) => {
        this.authService.setUsuario(usuario);
        this.router.navigate(['/proyectos']);
      },
      error: () => {
        this.error.set('Credenciales inválidas');
      }
    });
  }

  crearUsuario() {
    this.error.set('');
    this.mensaje.set('');

    if (!this.nuevoUsuario.nombreUsuario.trim() || !this.nuevoUsuario.clave.trim()) {
      this.error.set('Completa usuario y contraseña');
      return;
    }

    this.usuarioService.crear({
      nombreUsuario: this.nuevoUsuario.nombreUsuario,
      clave: this.nuevoUsuario.clave,
    }).subscribe({
      next: () => {
        this.mensaje.set('Usuario creado. Ya puedes iniciar sesión.');
        this.nombreUsuario = this.nuevoUsuario.nombreUsuario;
        this.clave = this.nuevoUsuario.clave;
        this.nuevoUsuario = { nombreUsuario: '', clave: '' };
        this.registrando.set(false);
      },
      error: () => {
        this.error.set('No se pudo crear el usuario');
      }
    });
  }
}