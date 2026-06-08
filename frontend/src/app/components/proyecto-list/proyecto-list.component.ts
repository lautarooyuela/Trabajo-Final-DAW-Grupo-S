import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Proyecto } from '../../models/proyecto.model';
import { ProyectoService } from '../../services/proyecto.service';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-proyecto-list',
  standalone: true,
  imports: [RouterLink, FormsModule, MatIconModule],
  template: `
    <div class="header-card card">
      <div class="header-info">
        <div class="title-row">
          <mat-icon class="header-icon">folder</mat-icon>
          <h2>Proyectos</h2>
        </div>
        <p class="meta">Gestiona y supervisa todos los proyectos activos del sistema.</p>
      </div>
      <div class="actions-bar">
        @if (authService.puedeCrear()) {
          <button class="success-btn" [routerLink]="['/proyectos/nuevo']">
            <mat-icon>add</mat-icon> Nuevo Proyecto
          </button>
        }
        <button class="export-btn" (click)="exportarCSV()">
          <mat-icon>download</mat-icon> Exportar CSV
        </button>
      </div>
    </div>

    <div class="card filters-card">
      <div class="filtros-bar">
        <mat-icon>search</mat-icon>
        <input
          type="text"
          class="input-busqueda"
          placeholder="Buscar proyectos por nombre..."
          [(ngModel)]="busqueda"
        />
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
            <th (click)="ordenar('estado')" class="sortable">
              Estado {{ sortField() === 'estado' ? (sortAsc() ? '▲' : '▼') : '' }}
            </th>
            <th (click)="ordenar('cliente')" class="sortable">
              Cliente {{ sortField() === 'cliente' ? (sortAsc() ? '▲' : '▼') : '' }}
            </th>
            <th (click)="ordenar('tareas')" class="sortable">
              Tareas {{ sortField() === 'tareas' ? (sortAsc() ? '▲' : '▼') : '' }}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (p of proyectosFiltrados; track p.id) {
            <tr>
              <td><span class="id-text">#{{ p.id }}</span></td>
              <td><span class="name-text">{{ p.nombre }}</span></td>
              <td>
                <select
                  class="status-select"
                  [value]="p.estado"
                  (change)="cambiarEstado(p, $event)"
                  [disabled]="!authService.puedeEditar()"
                  [class.status-activo]="p.estado === 'ACTIVO'"
                  [class.status-baja]="p.estado === 'BAJA'"
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="FINALIZADO">Finalizado</option>
                  <option value="BAJA">Baja</option>
                </select>
              </td>
              <td>{{ p.cliente?.nombre || 'Interno' }}</td>
              <td>
                <a [routerLink]="['/proyectos', p.id]" class="tasks-link">
                  <span class="badge-tareas">{{ contarTareas(p) }}</span>
                </a>
              </td>
              <td class="actions-cell">
                <button class="btn-ver" [routerLink]="['/proyectos', p.id]" title="Ver detalles">
                  <mat-icon>visibility</mat-icon>
                </button>
                @if (authService.puedeEditar()) {
                  <button class="btn-editar" [routerLink]="['/proyectos', p.id, 'editar']" title="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                }
              </td>
            </tr>
          }
          @if (proyectosFiltrados.length === 0) {
            <tr>
              <td colspan="6" class="sin-resultados">
                <mat-icon>inventory_2</mat-icon>
                <p>No se encontraron proyectos que coincidan con tu búsqueda.</p>
              </td>
            </tr>
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

    .filters-card {
      padding: 12px 20px;
    }

    .filtros-bar {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .filtros-bar mat-icon {
      color: var(--text-secondary);
    }

    .input-busqueda {
      background: transparent !important;
      border: none !important;
      padding: 8px 0 !important;
      width: 100%;
      font-size: 1em;
      color: var(--text-primary) !important;
    }

    .input-busqueda:focus {
      box-shadow: none !important;
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

    .status-select {
      background-color: #0f172a !important;
      border-radius: 8px !important;
      padding: 6px 12px !important;
      font-size: 0.85em !important;
      font-weight: 600 !important;
      border: 1px solid var(--border-color) !important;
      color: var(--text-primary) !important;
    }

    .status-activo { color: #34d399 !important; border-color: rgba(52, 211, 153, 0.3) !important; }
    .status-baja { color: #f87171 !important; border-color: rgba(248, 113, 113, 0.3) !important; }

    .tasks-link {
      text-decoration: none;
    }

    .actions-cell {
      display: flex;
      gap: 8px;
    }

    .btn-ver, .btn-editar {
      width: 36px;
      height: 36px;
      padding: 0 !important;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px !important;
    }

    .btn-ver mat-icon, .btn-editar mat-icon {
      margin: 0 !important;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .sin-resultados {
      text-align: center;
      padding: 60px !important;
      color: var(--text-secondary);
    }

    .sin-resultados mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .sin-resultados p {
      margin: 0;
      font-size: 1.1em;
    }
  `],
})
export class ProyectoListComponent implements OnInit {
  proyectos = signal<Proyecto[]>([]);
  busqueda = '';
  sortField = signal<string>('id');
  sortAsc = signal<boolean>(true);

  get proyectosFiltrados(): Proyecto[] {
    const termino = this.busqueda.trim().toLowerCase();
    let res = this.proyectos();

    if (termino) {
      res = res.filter((p) => p.nombre.toLowerCase().includes(termino));
    }

    const field = this.sortField();
    const asc = this.sortAsc();

    return [...res].sort((a, b) => {
      let valA: any;
      let valB: any;

      if (field === 'cliente') {
        valA = a.cliente?.nombre || 'Interno';
        valB = b.cliente?.nombre || 'Interno';
      } else if (field === 'tareas') {
        valA = a.tareas?.length || 0;
        valB = b.tareas?.length || 0;
      } else {
        valA = (a as any)[field];
        valB = (b as any)[field];
      }

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
  }

  constructor(
    private proyectoService: ProyectoService,
    private router: Router,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.proyectoService.obtenerTodos().subscribe((data) => this.proyectos.set(data));
  }

  contarTareas(proyecto: Proyecto): string {
    const total = proyecto.tareas?.length ?? 0;
    return total === 1 ? '1 tarea' : `${total} tareas`;
  }

  ordenar(campo: string) {
    if (this.sortField() === campo) {
      this.sortAsc.update((asc) => !asc);
    } else {
      this.sortField.set(campo);
      this.sortAsc.set(true);
    }
  }

  cambiarEstado(proyecto: Proyecto, event: Event) {
    if (!this.authService.puedeEditar()) {
      return;
    }

    const select = event.target as HTMLSelectElement;
    const nuevoEstado = select.value;

    const confirmar = confirm(`¿Cambiar el estado de "${proyecto.nombre}" a "${nuevoEstado}"?`);
    if (!confirmar) {
      // Revertir el select visualmente
      select.value = proyecto.estado;
      return;
    }

    this.proyectoService
      .actualizar(proyecto.id, { estado: nuevoEstado })
      .subscribe(() => this.cargar());
  }

  exportarCSV() {
    const datos = this.proyectosFiltrados;
    if (datos.length === 0) return;

    const cabeceras = ['ID', 'Nombre', 'Estado', 'Cliente'];
    const filas = datos.map((p) =>
      [p.id, p.nombre, p.estado, p.cliente?.nombre || 'Interno'].join(','),
    );
    const csvContent = [cabeceras.join(','), ...filas].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proyectos.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
