import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  template: `
    <div class="page">
      <div class="header-card card">
        <div class="header-info">
          <div class="title-row">
            <mat-icon class="admin-icon">admin_panel_settings</mat-icon>
            <h2>Administración de Usuarios</h2>
          </div>
          <p class="meta">Gestiona los permisos y el estado de acceso de los usuarios del sistema.</p>
        </div>
      </div>

      <div class="card-section card">
        <div class="section-title">
          <h3>Usuarios Registrados</h3>
          <span class="count-badge">{{ usuarios().length }} usuarios</span>
        </div>

        <div class="table-wrapper">
          <table class="users-table">
            <thead>
              <tr>
                <th (click)="ordenar('nombreUsuario')" class="sortable">
                  Usuario {{ sortField() === 'nombreUsuario' ? (sortAsc() ? '▲' : '▼') : '' }}
                </th>
                <th (click)="ordenar('rol')" class="sortable">
                  Rol {{ sortField() === 'rol' ? (sortAsc() ? '▲' : '▼') : '' }}
                </th>
                <th (click)="ordenar('estado')" class="sortable">
                  Estado {{ sortField() === 'estado' ? (sortAsc() ? '▲' : '▼') : '' }}
                </th>
              </tr>
            </thead>
            <tbody>
              @for (usuario of usuariosOrdenados(); track usuario.id) {
                <tr>
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar">{{ usuario.nombreUsuario.charAt(0).toUpperCase() }}</div>
                      <span class="user-name">{{ usuario.nombreUsuario }}</span>
                    </div>
                  </td>
                  <td>
                    <select class="role-select" [value]="usuario.rol" (change)="cambiarRol(usuario, $event)">
                      <option value="LECTOR">Lector</option>
                      <option value="EDITOR">Editor</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </td>
                  <td>
                    <select class="status-select" [value]="usuario.estado" (change)="cambiarEstado(usuario, $event)"
                            [class.status-activo]="usuario.estado === 'ACTIVO'"
                            [class.status-baja]="usuario.estado === 'BAJA'">
                      <option value="ACTIVO">Activo</option>
                      <option value="BAJA">Baja</option>
                    </select>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      padding: 32px;
      display: grid;
      gap: 32px;
      justify-items: center;
    }

    .card {
      width: 100%;
      max-width: 1000px;
      background: var(--bg-card) !important;
      border: 1px solid var(--border-color) !important;
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3);
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
    }

    .admin-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--primary-color);
    }

    h2 { margin: 0; font-size: 2em; color: var(--text-primary); }
    h3 { margin: 0; color: var(--text-primary); font-size: 1.3em; }

    .meta {
      color: var(--text-secondary);
      font-size: 0.95em;
      margin: 0;
    }

    .section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .count-badge {
      background: #0f172a;
      color: var(--text-secondary);
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 0.85em;
      font-weight: 600;
      border: 1px solid var(--border-color);
    }

    .table-wrapper {
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--border-color);
    }

    .users-table {
      margin-top: 0;
      border: none;
      background: var(--bg-card);
    }

    .users-table th {
      background-color: #1e293b !important;
      color: var(--text-secondary) !important;
    }

    .users-table td {
      border-bottom: 1px solid var(--border-color);
      color: var(--text-primary);
    }

    .user-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      background: var(--bg-main);
      color: var(--primary-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.8em;
      border: 1px solid var(--border-color);
    }

    .user-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .role-select, .status-select {
      background-color: #0f172a !important;
      border: 1px solid var(--border-color) !important;
      padding: 8px 12px !important;
      border-radius: 10px !important;
      font-size: 0.9em !important;
      font-weight: 600 !important;
      color: var(--text-primary) !important;
      width: 100%;
      max-width: 160px;
    }

    .status-activo { color: #34d399 !important; border-color: rgba(52, 211, 153, 0.3) !important; }
    .status-baja { color: #f87171 !important; border-color: rgba(248, 113, 113, 0.3) !important; }

    .sortable { cursor: pointer; user-select: none; }
    .sortable:hover { color: var(--text-primary) !important; }
  `]
})
export class UsuariosAdminComponent implements OnInit {
  usuarios = signal<Usuario[]>([]);
  sortField = signal<string>('nombreUsuario');
  sortAsc = signal<boolean>(true);

  usuariosOrdenados = computed(() => {
    const data = [...this.usuarios()];
    const field = this.sortField();
    const asc = this.sortAsc();

    return data.sort((a, b) => {
      let valA = (a as any)[field];
      let valB = (b as any)[field];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA === undefined || valA === null) return asc ? 1 : -1;
      if (valB === undefined || valB === null) return asc ? -1 : 1;

      if (valA < valB) return asc ? -1 : 1;
      if (valA > valB) return asc ? 1 : -1;
      return 0;
    });
  });

  constructor(
    private usuarioService: UsuarioService,
  ) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.usuarioService.obtenerTodos().subscribe((usuarios) => this.usuarios.set(usuarios));
  }

  ordenar(campo: string) {
    if (this.sortField() === campo) {
      this.sortAsc.update(asc => !asc);
    } else {
      this.sortField.set(campo);
      this.sortAsc.set(true);
    }
  }

  cambiarRol(usuario: Usuario, event: Event) {
    const select = event.target as HTMLSelectElement;
    this.usuarioService.actualizar(usuario.id, { rol: select.value as Usuario['rol'] }).subscribe(() => this.cargar());
  }

  cambiarEstado(usuario: Usuario, event: Event) {
    const select = event.target as HTMLSelectElement;
    this.usuarioService.actualizar(usuario.id, { estado: select.value }).subscribe(() => this.cargar());
  }
}
