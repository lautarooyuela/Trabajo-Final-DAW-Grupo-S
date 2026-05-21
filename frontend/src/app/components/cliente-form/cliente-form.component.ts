import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>{{ editando ? 'Editar' : 'Nuevo' }} Cliente</h2>
    <form (ngSubmit)="guardar()">
      <label>
        Nombre:
        <input type="text" [(ngModel)]="cliente.nombre" name="nombre" required />
      </label>
      <button type="submit">Guardar</button>
      <button type="button" (click)="volver()">Cancelar</button>
    </form>
    @if (error()) {
      <p class="error">{{ error() }}</p>
    }
  `,
  styles: [`
    label { display: block; margin-bottom: 12px; }
    input { padding: 6px; width: 300px; }
    button { margin-right: 8px; }
    .error { color: red; }
  `]
})
export class ClienteFormComponent implements OnInit {
  cliente: Partial<Cliente> = { nombre: '' };
  editando = false;
  id: number | null = null;
  error = signal('');

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      this.editando = true;
      this.id = Number(param);
      this.clienteService.obtenerPorId(this.id).subscribe(c => {
        this.cliente = { nombre: c.nombre };
      });
    }
  }

  guardar() {
    if (this.editando && this.id) {
      this.clienteService.actualizar(this.id, this.cliente).subscribe({
        next: () => this.router.navigate(['/clientes']),
        error: (err) => this.error.set(err.error?.message || 'Error al actualizar')
      });
    } else {
      this.clienteService.crear(this.cliente).subscribe({
        next: () => this.router.navigate(['/clientes']),
        error: (err) => this.error.set(err.error?.message || 'Error al crear')
      });
    }
  }

  volver() {
    this.router.navigate(['/clientes']);
  }
}
