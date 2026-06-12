import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Proyecto } from '../../models/proyecto.model';
import { ProyectoService } from '../../services/proyecto.service';

@Component({
  selector: 'app-proyecto-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <h2>Proyectos</h2>
    <div class="actions-bar">
      <button class="success-btn" [routerLink]="['/proyectos/nuevo']">Nuevo Proyecto</button>
      <button class="export-btn" (click)="exportarCSV()">Exportar CSV</button>
    </div>

    <div class="filtros-bar">
      <input
        type="text"
        class="input-busqueda"
        placeholder="Buscar por nombre..."
        [(ngModel)]="busqueda"
      />
    </div>
    
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Estado</th>
          <th>Cliente</th>
          <th>Tareas</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        @for (p of proyectosFiltrados; track p.id) {
          <tr>
            <td>{{ p.id }}</td>
            <td>{{ p.nombre }}</td>
            <td>
              <select class="status-select" [value]="p.estado" (change)="cambiarEstado(p, $event)">
                <option value="Activo">Activo</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Baja">Baja</option>
              </select>
            </td>
            <td>{{ p.cliente?.nombre || 'Interno' }}</td>
            <td>
              <span class="badge-tareas">{{ contarTareas(p) }}</span>
            </td>
            <td>
              <button class="btn-ver" [routerLink]="['/proyectos', p.id]">Ver</button>
              <button class="btn-editar" [routerLink]="['/proyectos', p.id, 'editar']">Editar</button>
            </td>
          </tr>
        }
        @if (proyectosFiltrados.length === 0) {
          <tr>
            <td colspan="6" class="sin-resultados">No se encontraron proyectos.</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: [`
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #f8f9fa; font-weight: bold; }
    tbody tr:hover { background-color: #f9f9f9; transition: 0.2s; }
    
    .actions-bar { margin-bottom: 12px; display: flex; gap: 10px; }
    .filtros-bar { margin-bottom: 16px; }

    .input-busqueda {
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 0.95em;
      width: 280px;
    }

    .success-btn {
      background-color: #2e7d32;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
    }
    
    .export-btn {
      background-color: #1976d2;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
    }
    
    .status-select { padding: 4px; border-radius: 4px; border: 1px solid #ccc; cursor: pointer; }
    .btn-ver { background-color: #e3f2fd; color: #1976d2; border: 1px solid #bbdefb; border-radius: 4px; padding: 4px 10px; margin-right: 6px; cursor: pointer; }
    .btn-editar { background-color: #f5f5f5; color: #555; border: 1px solid #ddd; border-radius: 4px; padding: 4px 10px; cursor: pointer; }
    .btn-ver:hover { background-color: #bbdefb; }
    .btn-editar:hover { background-color: #e0e0e0; }

    .badge-tareas {
      background-color: #e8eaf6;
      color: #3949ab;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 0.85em;
      font-weight: bold;
    }

    .sin-resultados {
      text-align: center;
      color: #888;
      font-style: italic;
      padding: 20px;
    }
  `]
})
export class ProyectoListComponent implements OnInit {
  proyectos = signal<Proyecto[]>([]);
  busqueda = '';

  get proyectosFiltrados(): Proyecto[] {
    const termino = this.busqueda.trim().toLowerCase();
    if (!termino) return this.proyectos();
    return this.proyectos().filter(p => p.nombre.toLowerCase().includes(termino));
  }

  constructor(private proyectoService: ProyectoService, private router: Router) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.proyectoService.obtenerTodos().subscribe(data => this.proyectos.set(data));
  }

  contarTareas(proyecto: Proyecto): string {
    const total = proyecto.tareas?.length ?? 0;
    return total === 1 ? '1 tarea' : `${total} tareas`;
  }

  cambiarEstado(proyecto: Proyecto, event: Event) {
    const select = event.target as HTMLSelectElement;
    const nuevoEstado = select.value;

    const confirmar = confirm(`¿Cambiar el estado de "${proyecto.nombre}" a "${nuevoEstado}"?`);
    if (!confirmar) {
      // Revertir el select visualmente
      select.value = proyecto.estado;
      return;
    }

    this.proyectoService.actualizar(proyecto.id, { estado: nuevoEstado }).subscribe(() => this.cargar());
  }

  exportarCSV() {
    const datos = this.proyectos();
    if (datos.length === 0) return;

    const cabeceras = ['ID', 'Nombre', 'Estado', 'Cliente'];
    const filas = datos.map(p => [p.id, p.nombre, p.estado, p.cliente?.nombre || 'Interno'].join(','));
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