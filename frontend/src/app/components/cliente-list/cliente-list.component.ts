import { Component, signal, OnInit, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { Historial } from '../../models/historial.model';
import { ClienteService } from '../../services/cliente.service';
import { AuthService } from '../../services/auth.service';
import { HistorialService } from '../../services/historial.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="header-card card">
      <div class="header-info">
        <div class="title-row">
          <mat-icon class="header-icon">groups</mat-icon>
          <h2>Clientes</h2>
        </div>
        <p class="meta">Administra la base de datos de clientes y su información de contacto.</p>
      </div>
      <div class="actions-bar">
        @if (authService.puedeGestionarClientes()) {
          <button class="success-btn" [routerLink]="['/clientes/nuevo']">
            <mat-icon>person_add</mat-icon> Nuevo Cliente
          </button>
        }
        <button class="export-btn" (click)="exportarCSV()">
          <mat-icon>download</mat-icon> Exportar CSV
        </button>
      </div>
    </div>

    <div class="table-container card">
      <table>
        <thead>
          <tr>
            <th (click)="ordenar('id')" class="sortable">
              ID {{ sortField() === 'id' ? (sortAsc() ? '▲' : '▼') : '' }}
            </th>
            <th (click)="ordenar('nombre')" class="sortable">
              Nombre {{ sortField() === 'nombre' ? (sortAsc() ? '▲' : '▼') : '' }}
            </th>
            <th (click)="ordenar('email')" class="sortable">
              Email {{ sortField() === 'email' ? (sortAsc() ? '▲' : '▼') : '' }}
            </th>
            <th (click)="ordenar('telefono')" class="sortable">
              Teléfono {{ sortField() === 'telefono' ? (sortAsc() ? '▲' : '▼') : '' }}
            </th>
            <th (click)="ordenar('estado')" class="sortable">
              Estado {{ sortField() === 'estado' ? (sortAsc() ? '▲' : '▼') : '' }}
            </th>
            @if (authService.puedeGestionarClientes()) {
              <th>Acciones</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (c of clientesOrdenados(); track c.id) {
            <tr>
              <td><span class="id-text">#{{ c.id }}</span></td>
              <td><span class="name-text">{{ c.nombre }}</span></td>
              <td>{{ c.email }}</td>
              <td>{{ c.telefono }}</td>
              <td>
                <span [class]="c.estado === 'ACTIVO' ? 'badge-activo' : 'badge-baja'">
                  {{ c.estado }}
                </span>
              </td>
              @if (authService.puedeGestionarClientes()) {
                <td class="actions-cell">
                  <button class="btn-editar" [routerLink]="['/clientes', c.id, 'editar']" title="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button class="btn-historial" (click)="toggleHistorial(c.id)" title="Historial">
                    <mat-icon>history</mat-icon>
                  </button>
                  @if (c.estado !== 'BAJA') {
                    <button class="btn-eliminar" (click)="baja(c.id)" title="Dar de baja">
                      <mat-icon>person_off</mat-icon>
                    </button>
                  }
                </td>
              }
            </tr>
            @if (historialVisible() === c.id) {
              <tr>
                <td colspan="6" class="historial-cell">
                  <div class="historial-box">
                    <h4>Historial de cambios</h4>
                    @if (historialCliente().length === 0) {
                      <p class="sin-historial">No hay registros de historial.</p>
                    } @else {
                      <table class="historial-table">
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Usuario</th>
                            <th>Acción</th>
                            <th>Detalle</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (h of historialCliente(); track h.id) {
                            <tr>
                              <td>{{ formatearFecha(h.fecha) }}</td>
                              <td>{{ h.usuarioNombre }}</td>
                              <td>
                                <span [class]="claseAccion(h.accion)">{{ {crear: 'Crear', editar: 'Editar', darBaja: 'Dar de baja'}[h.accion] || h.accion }}</span>
                              </td>
                              <td>{{ h.detalle }}</td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    }
                  </div>
                </td>
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .header-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
    }

    .header-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--primary-color);
    }

    h2 { margin: 0; font-size: 2em; color: var(--text-primary); }

    .meta {
      color: var(--text-secondary);
      font-size: 0.95em;
      margin: 0;
    }

    .actions-bar {
      display: flex;
      gap: 12px;
    }

    .success-btn, .export-btn {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3);
      margin-bottom: 24px;
    }

    .table-container {
      padding: 0;
      overflow: hidden;
    }

    table {
      margin-top: 0;
      border: none;
      box-shadow: none;
      background: var(--bg-card);
    }

    .sortable {
      cursor: pointer;
      user-select: none;
      transition: color 0.2s;
    }

    .sortable:hover {
      color: var(--text-primary) !important;
    }

    .id-text {
      color: var(--text-secondary);
      font-family: monospace;
      font-weight: 600;
    }

    .name-text {
      font-weight: 600;
      color: var(--text-primary);
    }

    .actions-cell {
      display: flex;
      gap: 8px;
    }

    .btn-editar, .btn-eliminar, .btn-historial {
      width: 36px;
      height: 36px;
      padding: 0 !important;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px !important;
    }

    .btn-eliminar {
      color: var(--text-secondary) !important;
      background: transparent !important;
      border: 1px solid var(--border-color) !important;
    }

    .btn-eliminar:hover {
      color: var(--danger-color) !important;
      background: rgba(239, 68, 68, 0.1) !important;
      border-color: rgba(239, 68, 68, 0.2) !important;
    }

    .btn-historial {
      color: var(--text-secondary) !important;
      background: transparent !important;
      border: 1px solid var(--border-color) !important;
    }

    .btn-historial:hover {
      color: var(--primary-color) !important;
      background: rgba(59, 130, 246, 0.1) !important;
      border-color: rgba(59, 130, 246, 0.2) !important;
    }

    .badge-activo { background-color: rgba(34, 197, 94, 0.15); color: #22c55e; padding: 4px 12px; border-radius: 9999px; font-size: 0.85em; font-weight: 600; }
    .badge-baja { background-color: rgba(239, 68, 68, 0.15); color: #ef4444; padding: 4px 12px; border-radius: 9999px; font-size: 0.85em; font-weight: 600; }

    mat-icon {
      margin: 0 !important;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .historial-cell { background-color: rgba(15, 23, 42, 0.5); }
    .historial-box { padding: 12px; }
    .historial-box h4 { margin: 0 0 10px 0; color: var(--text-primary); }

    .historial-table { width: 100%; border-collapse: collapse; font-size: 0.85em; }
    .historial-table th { color: var(--text-secondary); padding: 8px; text-align: left; }
    .historial-table td { padding: 8px; border-bottom: 1px solid var(--border-color); color: var(--text-secondary); }

    .sin-historial { color: var(--text-secondary); font-style: italic; }

    .accion-crear { background-color: rgba(34, 197, 94, 0.15); color: #22c55e; padding: 2px 8px; border-radius: 10px; font-size: 0.85em; }
    .accion-editar { background-color: rgba(59, 130, 246, 0.15); color: #3b82f6; padding: 2px 8px; border-radius: 10px; font-size: 0.85em; }
    .accion-darBaja { background-color: rgba(239, 68, 68, 0.15); color: #ef4444; padding: 2px 8px; border-radius: 10px; font-size: 0.85em; }
  `]
})
export class ClienteListComponent implements OnInit {
  clientes = signal<Cliente[]>([]);
  sortField = signal<string>('id');
  sortAsc = signal<boolean>(true);
  historialVisible = signal<number | null>(null);
  historialCliente = signal<Historial[]>([]);

  clientesOrdenados = computed(() => {
    const data = [...this.clientes()];
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
    private clienteService: ClienteService,
    private historialService: HistorialService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.clienteService.obtenerTodos().subscribe(data => this.clientes.set(data));
  }

  ordenar(campo: string) {
    if (this.sortField() === campo) {
      this.sortAsc.update(asc => !asc);
    } else {
      this.sortField.set(campo);
      this.sortAsc.set(true);
    }
  }

  toggleHistorial(clienteId: number) {
    if (this.historialVisible() === clienteId) {
      this.historialVisible.set(null);
      this.historialCliente.set([]);
    } else {
      this.historialVisible.set(clienteId);
      this.historialService.obtenerPorEntidad('cliente', clienteId).subscribe(data => this.historialCliente.set(data));
    }
  }

  baja(id: number) {
    if (!this.authService.puedeGestionarClientes()) {
      return;
    }

    if (confirm('¿Dar de baja este cliente?')) {
      this.clienteService.darDeBaja(id).subscribe(() => this.cargar());
    }
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-AR');
  }

  claseAccion(accion: string): string {
    if (accion === 'crear') return 'accion-crear';
    if (accion === 'editar') return 'accion-editar';
    if (accion === 'darBaja') return 'accion-darBaja';
    return '';
  }

  exportarCSV() {
    const datos = this.clientesOrdenados();
    if (datos.length === 0) return;

    const cabeceras = ['ID', 'Nombre', 'Email', 'Teléfono', 'Estado'];
    const filas = datos.map(c => [c.id, c.nombre, c.email, c.telefono, c.estado].join(','));
    const csvContent = [cabeceras.join(','), ...filas].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientes.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}