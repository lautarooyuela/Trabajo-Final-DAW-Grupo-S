import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Proyecto } from '../../models/proyecto.model';
import { Cliente } from '../../models/cliente.model';
import { ProyectoService } from '../../services/proyecto.service';
import { ClienteService } from '../../services/cliente.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-proyecto-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="form-container">
      <div class="card">
        <h2>{{ editando ? 'Editar' : 'Nuevo' }} Proyecto</h2>
        <form (ngSubmit)="guardar()">
          <label>Nombre:</label>
          <input type="text" [(ngModel)]="proyecto.nombre" name="nombre" required />
          
          @if (editando) {
            <label>Estado:</label>
            <select [(ngModel)]="proyecto.estado" name="estado">
              <option value="ACTIVO">Activo</option>
              <option value="FINALIZADO">Finalizado</option>
              <option value="BAJA">Baja</option>
            </select>
          }
          
          <label>Cliente:</label>
          <select [(ngModel)]="clienteSeleccionado" name="cliente">
            <option [value]="null">Interno</option>
            @for (c of clientesActivos(); track c.id) {
              <option [value]="c.id">{{ c.nombre }}</option>
            }
          </select>
          
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
    input, select { width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .actions { display: flex; gap: 10px; }
    button { padding: 10px 20px; border-radius: 4px; border: none; cursor: pointer; font-weight: bold; }
    .btn-guardar { background-color: #2e7d32; color: white; flex: 1; }
    .btn-cancelar { background-color: #f5f5f5; color: #555; border: 1px solid #ddd; flex: 1; }
    .error { color: #d32f2f; margin-top: 15px; text-align: center; }
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
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.authService.puedeCrear()) {
      this.router.navigate(['/proyectos']);
      return;
    }

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