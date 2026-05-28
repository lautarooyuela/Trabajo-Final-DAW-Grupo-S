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
    <div class="form-container">
      <div class="card">
        <h2>{{ editando ? 'Editar' : 'Nuevo' }} Cliente</h2>
        <form (ngSubmit)="guardar()">
          <label>Nombre:</label>
          <input type="text" [(ngModel)]="cliente.nombre" name="nombre" required />
          
          <div class="actions">
            <button type="submit" class="btn-guardar">Guardar</button>
            <button type="button" class="btn-cancelar" (click)="volver()">Cancelar</button>
          </div>
        </form>
        @if (error()) {
          <p class="error">{{ error() }}</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .form-container { display: flex; justify-content: center; padding: 40px; background-color: #f5f5f5; height: 100vh; }
    .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 400px; height: fit-content; }
    label { display: block; margin-bottom: 8px; font-weight: bold; color: #555; }
    input { width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .actions { display: flex; gap: 10px; }
    button { padding: 10px 20px; border-radius: 4px; border: none; cursor: pointer; font-weight: bold; }
    .btn-guardar { background-color: #2e7d32; color: white; flex: 1; }
    .btn-cancelar { background-color: #f5f5f5; color: #555; border: 1px solid #ddd; flex: 1; }
    .error { color: #d32f2f; margin-top: 15px; text-align: center; }
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