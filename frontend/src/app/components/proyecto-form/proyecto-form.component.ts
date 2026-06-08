import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Proyecto } from '../../models/proyecto.model';
import { Cliente } from '../../models/cliente.model';
import { ProyectoService } from '../../services/proyecto.service';
import { ClienteService } from '../../services/cliente.service';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-proyecto-form',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  template: `
    <div class="form-container">
      <div class="card">
        <div class="form-header">
          <mat-icon class="header-icon">{{ editando ? 'edit_note' : 'create_new_folder' }}</mat-icon>
          <h2>{{ editando ? 'Editar' : 'Nuevo' }} Proyecto</h2>
        </div>
        
        <form (ngSubmit)="guardar()">
          <div class="field">
            <label>Nombre del Proyecto</label>
            <input type="text" [(ngModel)]="proyecto.nombre" name="nombre" placeholder="Ej: Rediseño Web 2024" required />
          </div>
          
          @if (editando) {
            <div class="field">
              <label>Estado Actual</label>
              <select [(ngModel)]="proyecto.estado" name="estado">
                <option value="ACTIVO">Activo</option>
                <option value="FINALIZADO">Finalizado</option>
                <option value="BAJA">Baja</option>
              </select>
            </div>
          }
          
          <div class="field">
            <label>Cliente Asignado</label>
            <select [(ngModel)]="clienteSeleccionado" name="cliente">
              <option [value]="null">Interno (Sin cliente externo)</option>
              @for (c of clientesActivos(); track c.id) {
                <option [value]="c.id">{{ c.nombre }}</option>
              }
            </select>
          </div>
          
          <div class="actions">
            <button type="submit" class="btn-guardar">
              <mat-icon>save</mat-icon> Guardar Proyecto
            </button>
            <button type="button" class="btn-cancelar" (click)="volver()">
              Cancelar
            </button>
          </div>
        </form>
        @if (error()) {
          <div class="alert error-alert">
            <mat-icon>error</mat-icon> {{ error() }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .form-container { 
      display: flex; 
      justify-content: center; 
      padding: 60px 24px; 
      background-color: var(--bg-main); 
      min-height: 100vh; 
    }

    .card { 
      background: var(--bg-card); 
      padding: 48px; 
      border-radius: 24px; 
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); 
      width: 100%; 
      max-width: 500px; 
      height: fit-content;
      border: 1px solid var(--border-color);
    }

    .form-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
    }

    .header-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--primary-color);
    }

    h2 { margin: 0; color: var(--text-primary); font-weight: 800; font-size: 1.8em; }

    .field { margin-bottom: 24px; }

    label { 
      display: block; 
      margin-bottom: 10px; 
      font-weight: 600; 
      color: var(--text-secondary); 
      font-size: 0.85em;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    input, select { 
      width: 100%; 
      padding: 14px 18px; 
      background-color: #0f172a !important;
      border: 1px solid var(--border-color) !important; 
      border-radius: 12px !important; 
      box-sizing: border-box; 
      font-family: inherit;
      color: var(--text-primary) !important;
      font-size: 1em;
      transition: all 0.2s;
    }

    input:focus, select:focus {
      outline: none;
      border-color: var(--primary-color) !important;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15) !important;
    }

    .actions { display: flex; gap: 16px; margin-top: 40px; }

    button { 
      padding: 14px 28px; 
      border-radius: 12px; 
      border: none; 
      cursor: pointer; 
      font-weight: 700; 
      transition: all 0.2s;
      font-size: 1em;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-guardar { 
      background-color: var(--primary-color) !important; 
      color: white !important; 
      flex: 2; 
    }
    .btn-guardar:hover { filter: brightness(1.1); transform: translateY(-1px); }

    .btn-cancelar { 
      background-color: transparent !important; 
      color: var(--text-secondary) !important; 
      border: 1px solid var(--border-color) !important; 
      flex: 1; 
    }
    .btn-cancelar:hover { background-color: rgba(255, 255, 255, 0.05) !important; color: var(--text-primary) !important; }

    .alert {
      margin-top: 32px;
      padding: 16px;
      border-radius: 12px;
      font-size: 0.95em;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .error-alert { background-color: rgba(239, 68, 68, 0.1); color: var(--danger-color); border: 1px solid rgba(239, 68, 68, 0.2); }
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
