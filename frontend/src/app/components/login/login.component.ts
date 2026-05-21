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
      <h2>Iniciar Sesión</h2>
      <form (ngSubmit)="onSubmit()">
        <label>
          Usuario:
          <input type="text" [(ngModel)]="nombreUsuario" name="usuario" required />
        </label>
        <label>
          Contraseña:
          <input type="password" [(ngModel)]="clave" name="clave" required />
        </label>
        <button type="submit">Ingresar</button>
      </form>
      @if (error()) {
        <p class="error">{{ error() }}</p>
      }
    </div>
  `,
  styles: [`
    .login-container { max-width: 300px; margin: 80px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
    label { display: block; margin-bottom: 12px; }
    input { width: 100%; padding: 6px; box-sizing: border-box; }
    button { width: 100%; padding: 8px; }
    .error { color: red; }
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
