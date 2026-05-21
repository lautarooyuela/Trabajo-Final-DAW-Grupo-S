import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Proyecto } from '../../models/proyecto.model';
import { Cliente } from '../../models/cliente.model';
import { ProyectoService } from '../../services/proyecto.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-proyecto-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>{{ editando ? 'Editar' : 'Nuevo' }} Proyecto</h2>
    <form (ngSubmit)="guardar()">
      <label>
        Nombre:
        <input type="text" [(ngModel)]="proyecto.nombre" name="nombre" required />
      </label>
      @if (editando) {
        <label>
          Estado:
          <select [(ngModel)]="proyecto.estado" name="estado">
            <option value="Activo">Activo</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Baja">Baja</option>
          </select>
        </label>
      }
      <label>
        Cliente:
        <select [(ngModel)]="clienteSeleccionado" name="cliente">
          <option [value]="null">Interno</option>
          @for (c of clientesActivos(); track c.id) {
            <option [value]="c.id">{{ c.nombre }}</option>
          }
        </select>
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
    input, select { padding: 6px; width: 300px; }
    button { margin-right: 8px; }
    .error { color: red; }
  `]
})
export class ProyectoFormComponent implements OnInit {
  proyecto: Partial<Proyecto> = { nombre: '' };
  editando = false;
  id: number | null = null;
  clientesActivos = signal<Cliente[]>([]);
  clienteSeleccionado: number | null = null;
  error = signal('');

  constructor(
    private proyectoService: ProyectoService,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.clienteService.obtenerActivos().subscribe(data => this.clientesActivos.set(data));
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      this.editando = true;
      this.id = Number(param);
      this.proyectoService.obtenerPorId(this.id).subscribe(p => {
        this.proyecto = { nombre: p.nombre, estado: p.estado };
        this.clienteSeleccionado = p.cliente ? p.cliente.id : null;
      });
    }
  }

  guardar() {
    const dto: any = { nombre: this.proyecto.nombre, clienteId: this.clienteSeleccionado };
    if (this.editando) {
      dto.estado = this.proyecto.estado;
    }
    if (this.editando && this.id) {
      this.proyectoService.actualizar(this.id, dto).subscribe({
        next: () => this.router.navigate(['/proyectos']),
        error: (err) => this.error.set(err.error?.message || 'Error al actualizar')
      });
    } else {
      this.proyectoService.crear(dto).subscribe({
        next: () => this.router.navigate(['/proyectos']),
        error: (err) => this.error.set(err.error?.message || 'Error al crear')
      });
    }
  }

  volver() {
    this.router.navigate(['/proyectos']);
  }
}
