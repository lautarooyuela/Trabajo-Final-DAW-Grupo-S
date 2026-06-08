import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page">
      <div class="header-card">
        <div>
          <h2>Administración de Usuarios</h2>
          <p class="meta">Gestiona roles y estado de usuarios.</p>
        </div>
      </div>

      <div class="card-section">
        <div class="section-title">
          <h3>Usuarios</h3>
          <span>{{ usuarios().length }} total</span>
        </div>

        <table class="users-table">
          <thead>
            <tr>
              <th (click)="ordenar('nombreUsuario')" style="cursor: pointer; user-select: none;">
                Usuario {{ sortField() === 'nombreUsuario' ? (sortAsc() ? '▲' : '▼') : '' }}
              </th>
              <th (click)="ordenar('rol')" style="cursor: pointer; user-select: none;">
                Rol {{ sortField() === 'rol' ? (sortAsc() ? '▲' : '▼') : '' }}
              </th>
              <th (click)="ordenar('estado')" style="cursor: pointer; user-select: none;">
                Estado {{ sortField() === 'estado' ? (sortAsc() ? '▲' : '▼') : '' }}
              </th>
            </tr>
          </thead>
          <tbody>
            @for (usuario of usuariosOrdenados(); track usuario.id) {
              <tr>
                <td>{{ usuario.nombreUsuario }}</td>
                <td>
                  <select [value]="usuario.rol" (change)="cambiarRol(usuario, $event)">
                    <option value="LECTOR">LECTOR</option>
                    <option value="EDITOR">EDITOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>
                  <select [value]="usuario.estado" (change)="cambiarEstado(usuario, $event)">
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="BAJA">BAJA</option>
                  </select>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px; display: grid; gap: 20px; }
    .header-card, .card-section { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
    h2, h3 { margin: 0; color: #222; }
    .meta { margin: 6px 0 0; color: #666; }
    .section-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; color: #666; }
    .users-table select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font: inherit; }
    .users-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    .users-table th, .users-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .users-table th { background-color: #f8f9fa; font-weight: bold; }
    .users-table tbody tr:hover { background-color: #f9f9f9; transition: 0.2s; }
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
