import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Proyecto } from '../../models/proyecto.model';
import { ProyectoService } from '../../services/proyecto.service';

@Component({
  selector: 'app-proyecto-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>Proyectos</h2>
    <button [routerLink]="['/proyectos/nuevo']">Nuevo Proyecto</button>
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
              <select (change)="cambiarEstado(p.id, $event)">
                <option value="Activo" [selected]="p.estado === 'Activo'">Activo</option>
                <option value="Finalizado" [selected]="p.estado === 'Finalizado'">Finalizado</option>
                <option value="Baja" [selected]="p.estado === 'Baja'">Baja</option>
              </select>
            </td>
            <td>{{ p.cliente?.nombre || 'Interno' }}</td>
            <td>
              <button [routerLink]="['/proyectos', p.id]">Ver</button>
              <button [routerLink]="['/proyectos', p.id, 'editar']">Editar</button>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: [`
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    button { margin-right: 6px; }
  `]
})
export class ProyectoListComponent implements OnInit {
  proyectos = signal<Proyecto[]>([]);

  constructor(private proyectoService: ProyectoService, private router: Router) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.proyectoService.obtenerTodos().subscribe(data => this.proyectos.set(data));
  }

  cambiarEstado(id: number, event: Event) {
    const select = event.target as HTMLSelectElement;
    const nuevoEstado = select.value;
    this.proyectoService.actualizar(id, { estado: nuevoEstado }).subscribe(() => this.cargar());
  }
}
