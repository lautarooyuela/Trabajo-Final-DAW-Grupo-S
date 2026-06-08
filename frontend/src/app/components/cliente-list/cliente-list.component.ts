import { Component, signal, OnInit, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>Clientes</h2>
    <div class="actions-bar">
      @if (authService.puedeGestionarClientes()) {
        <button class="success-btn" [routerLink]="['/clientes/nuevo']">Nuevo Cliente</button>
      }
      <button class="export-btn" (click)="exportarCSV()">Exportar CSV</button>
    </div>

    <table>
      <thead>
        <tr>
          <th (click)="ordenar('id')" style="cursor: pointer; user-select: none;">
            ID {{ sortField() === 'id' ? (sortAsc() ? '▲' : '▼') : '' }}
          </th>
          <th (click)="ordenar('nombre')" style="cursor: pointer; user-select: none;">
            Nombre {{ sortField() === 'nombre' ? (sortAsc() ? '▲' : '▼') : '' }}
          </th>
          <th (click)="ordenar('email')" style="cursor: pointer; user-select: none;">
            Email {{ sortField() === 'email' ? (sortAsc() ? '▲' : '▼') : '' }}
          </th>
          <th (click)="ordenar('telefono')" style="cursor: pointer; user-select: none;">
            Teléfono {{ sortField() === 'telefono' ? (sortAsc() ? '▲' : '▼') : '' }}
          </th>
          <th (click)="ordenar('estado')" style="cursor: pointer; user-select: none;">
            Estado {{ sortField() === 'estado' ? (sortAsc() ? '▲' : '▼') : '' }}
          </th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        @for (c of clientesOrdenados(); track c.id) {
          <tr>
            <td>{{ c.id }}</td>
            <td>{{ c.nombre }}</td>
            <td>{{ c.email }}</td>
            <td>{{ c.telefono }}</td>
            <td>
              <span [class]="c.estado === 'ACTIVO' ? 'badge-activo' : 'badge-baja'">
                {{ c.estado }}
              </span>
            </td>
            <td>
              @if (authService.puedeGestionarClientes()) {
                <button class="btn-editar" [routerLink]="['/clientes', c.id, 'editar']">Editar</button>
                @if (c.estado !== 'BAJA') {
                  <button class="danger-btn" (click)="baja(c.id)">Dar de baja</button>
                }
              }
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: [`
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #ccc; padding: 12px; text-align: left; }
    th { background-color: #f8f9fa; }
    
    .actions-bar { margin-bottom: 20px; display: flex; gap: 10px; }
    
    .success-btn { background-color: #2e7d32; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: 500; cursor: pointer; }
    .export-btn { background-color: #1976d2; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: 500; cursor: pointer; }
    
    .btn-editar { background-color: #f5f5f5; color: #555; border: 1px solid #ddd; border-radius: 4px; padding: 4px 10px; margin-right: 6px; cursor: pointer; }
    .danger-btn { color: #d32f2f; font-weight: 600; background: none; border: 1px solid #d32f2f; border-radius: 4px; padding: 4px 10px; cursor: pointer; }
    
    .badge-activo { background-color: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 12px; font-size: 0.85em; font-weight: bold; }
    .badge-baja { background-color: #ffebee; color: #c62828; padding: 4px 8px; border-radius: 12px; font-size: 0.85em; font-weight: bold; }
    
    tbody tr:hover { background-color: #f9f9f9; }
  `]
})
export class ClienteListComponent implements OnInit {
  clientes = signal<Cliente[]>([]);
  sortField = signal<string>('id');
  sortAsc = signal<boolean>(true);

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

  constructor(private clienteService: ClienteService, private router: Router, public authService: AuthService) {}

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

  baja(id: number) {
    if (!this.authService.puedeGestionarClientes()) {
      return;
    }

    if (confirm('¿Dar de baja este cliente?')) {
      this.clienteService.darDeBaja(id).subscribe(() => this.cargar());
    }
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