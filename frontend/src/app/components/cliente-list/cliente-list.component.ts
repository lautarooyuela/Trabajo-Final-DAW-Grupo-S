import { Component, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>Clientes</h2>
    <button [routerLink]="['/clientes/nuevo']">Nuevo Cliente</button>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        @for (c of clientes(); track c.id) {
          <tr>
            <td>{{ c.id }}</td>
            <td>{{ c.nombre }}</td>
            <td>{{ c.estado }}</td>
            <td>
              <button [routerLink]="['/clientes', c.id, 'editar']">Editar</button>
              @if (c.estado !== 'Baja') {
                <button (click)="baja(c.id)">Dar de baja</button>
              }
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
export class ClienteListComponent implements OnInit {
  clientes = signal<Cliente[]>([]);

  constructor(private clienteService: ClienteService, private router: Router) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.clienteService.obtenerTodos().subscribe(data => this.clientes.set(data));
  }

  baja(id: number) {
    if (confirm('¿Dar de baja este cliente?')) {
      this.clienteService.darDeBaja(id).subscribe(() => this.cargar());
    }
  }
}
