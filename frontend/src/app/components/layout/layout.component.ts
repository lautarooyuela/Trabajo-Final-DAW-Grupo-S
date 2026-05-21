import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/proyectos">Proyectos</a>
      <a routerLink="/clientes">Clientes</a>
      <button (click)="logout()">Cerrar Sesión</button>
    </nav>
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    nav { background: #eee; padding: 10px; display: flex; gap: 16px; align-items: center; }
    a { text-decoration: none; color: #333; font-weight: bold; }
    button { margin-left: auto; }
    main { padding: 16px; }
  `]
})
export class LayoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
