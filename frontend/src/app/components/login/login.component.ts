import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Iniciar Sesión</h2>
        <form (ngSubmit)="onSubmit()">
          <input type="text" [(ngModel)]="nombreUsuario" name="usuario" placeholder="Usuario" required />
          <input type="password" [(ngModel)]="clave" name="clave" placeholder="Contraseña" required />
          <button type="submit" class="login-btn">Ingresar</button>
        </form>
        @if (error()) {
          <p class="error">{{ error() }}</p>
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

    .error {
      color: #d32f2f;
      margin-top: 15px;
      font-size: 0.9em;
    }
  `]
})
export class LoginComponent {
  nombreUsuario = '';
  clave = '';
  error = signal('');

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
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
}