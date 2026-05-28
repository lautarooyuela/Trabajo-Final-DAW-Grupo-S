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
    
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Estado</th>
          <th>Cliente</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        @for (p of proyectos(); track p.id) {
          <tr>
            <td>{{ p.id }}</td>
            <td>{{ p.nombre }}</td>
            <td>
              <select class="status-select" (change)="cambiarEstado(p.id, $event)">
                <option value="Activo" [selected]="p.estado === 'Activo'">Activo</option>
                <option value="Finalizado" [selected]="p.estado === 'Finalizado'">Finalizado</option>
                <option value="Baja" [selected]="p.estado === 'Baja'">Baja</option>
              </select>
            </td>
            <td>{{ p.cliente?.nombre || 'Interno' }}</td>
            <td>
              <button class="btn-ver" [routerLink]="['/proyectos', p.id]">Ver</button>
              <button class="btn-editar" [routerLink]="['/proyectos', p.id, 'editar']">Editar</button>
            </td>
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
    
    .actions-bar { margin-bottom: 20px; display: flex; gap: 10px; }
    
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
  `]
})
export class ProyectoListComponent implements OnInit {
  proyectos = signal<Proyecto[]>([]);

  constructor(private proyectoService: ProyectoService, private router: Router) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.proyectoService.obtenerTodos().subscribe(data => this.proyectos.set(data));
  }

  cambiarEstado(id: number, event: Event) {
    const select = event.target as HTMLSelectElement;
    this.proyectoService.actualizar(id, { estado: select.value }).subscribe(() => this.cargar());
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