import { Component, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Proyecto } from '../../models/proyecto.model';
import { Tarea } from '../../models/tarea.model';
import { ProyectoService } from '../../services/proyecto.service';
import { TareaService } from '../../services/tarea.service';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-proyecto-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, MatIconModule],
  template: `
    <div class="page">
      <div class="header-card card">
        <div class="header-info">
          <div class="title-row">
            <mat-icon class="header-icon">folder</mat-icon>
            <h2>{{ proyecto()?.nombre }}</h2>
          </div>
          <p class="meta">
            <span class="meta-item"><mat-icon>info</mat-icon> {{ proyecto()?.estado }}</span>
            <span class="meta-divider">·</span>
            <span class="meta-item"><mat-icon>business</mat-icon> {{ proyecto()?.cliente?.nombre || 'Interno' }}</span>
          </p>
        </div>

        <button class="btn-secondary" routerLink="/proyectos">
          <mat-icon>arrow_back</mat-icon> Volver
        </button>
      </div>

      <div class="card-section card">
        <div class="section-title">
          <h3>Tareas del Proyecto</h3>
          <span class="count-badge">{{ tareas().length }} tareas</span>
        </div>

        @if (authService.puedeCrear()) {
          <form class="task-form" (ngSubmit)="agregarTarea()">
            <input
              type="text"
              [(ngModel)]="nuevaTarea.descripcion"
              name="descripcion"
              placeholder="Escribe una nueva tarea..."
            />
            <button type="submit" class="btn-primary" [disabled]="!nuevaTarea.descripcion?.trim()">
              <mat-icon>add</mat-icon> Agregar
            </button>
          </form>
        } @else {
          <div class="note-alert">
            <mat-icon>lock</mat-icon> Solo EDITOR o ADMIN pueden gestionar tareas.
          </div>
        }

        <div class="table-wrapper">
          <table class="tasks-table">
            <thead>
              <tr>
                <th (click)="ordenar('descripcion')" class="sortable">
                  Descripción {{ sortField() === 'descripcion' ? (sortAsc() ? '▲' : '▼') : '' }}
                </th>
                <th (click)="ordenar('estado')" class="sortable">
                  Estado {{ sortField() === 'estado' ? (sortAsc() ? '▲' : '▼') : '' }}
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (t of tareasOrdenadas(); track t.id) {
                <tr>
                  <td>
                    @if (editandoTareaId === t.id) {
                      <input
                        type="text"
                        class="inline-input"
                        [(ngModel)]="tareaEdit.descripcion"
                        [ngModelOptions]="{ standalone: true }"
                      />
                    } @else {
                      <span class="task-desc">{{ t.descripcion }}</span>
                    }
                  </td>
                    <td>
                      @if (authService.puedeEditar()) {
                        <select class="status-select" [value]="t.estado" (change)="cambiarEstadoTarea(t.id, $event)">
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="FINALIZADA">Finalizada</option>
                          <option value="BAJA">Baja</option>
                        </select>
                      } @else {
                        <span class="estado-text">{{ t.estado }}</span>
                      }
                    </td>
                  <td class="actions-cell">
                      @if (authService.puedeEditar() && editandoTareaId === t.id) {
                        <button type="button" class="btn-small btn-guardar" (click)="guardarEdicion(t.id)">
                          <mat-icon>check</mat-icon>
                        </button>
                        <button type="button" class="btn-small btn-cancelar" (click)="cancelarEdicion()">
                          <mat-icon>close</mat-icon>
                        </button>
                      } @else if (authService.puedeEditar()) {
                        <button type="button" class="btn-small btn-editar" (click)="iniciarEdicion(t)">
                          <mat-icon>edit</mat-icon>
                        </button>
                        @if (authService.puedeEliminar()) {
                          <button class="btn-small btn-eliminar" type="button" (click)="eliminarTarea(t.id)">
                            <mat-icon>delete</mat-icon>
                          </button>
                        }
                      } @else {
                        <span class="empty-actions">-</span>
                      }
                  </td>
                </tr>
              }
              @if (tareasOrdenadas().length === 0) {
                <tr>
                  <td colspan="3" class="empty-state">
                    <mat-icon>task_alt</mat-icon>
                    <p>No hay tareas pendientes en este proyecto.</p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      padding: 32px;
      display: grid;
      gap: 32px;
      justify-items: center;
    }

    .card {
      width: 100%;
      max-width: 1000px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3);
    }

    .header-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
    }

    .header-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--primary-color);
    }

    h2 { margin: 0; font-size: 2.2em; color: var(--text-primary); }
    h3 { margin: 0; color: var(--text-primary); font-size: 1.4em; }

    .meta {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--text-secondary);
      font-size: 0.95em;
      margin: 0;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .meta-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .count-badge {
      background: #0f172a;
      color: var(--text-secondary);
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 0.85em;
      font-weight: 600;
      border: 1px solid var(--border-color);
    }

    .task-form {
      display: flex;
      gap: 12px;
      margin-bottom: 32px;
    }

    .task-form input { flex: 1; }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px !important;
      background-color: var(--primary-color) !important;
      border: none !important;
      border-radius: 12px !important;
      color: white !important;
      font-weight: 700 !important;
    }

    .btn-secondary {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .table-wrapper {
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--border-color);
    }

    .tasks-table {
      margin-top: 0;
      border: none;
      background: var(--bg-card);
    }

    .task-desc {
      font-weight: 500;
      color: var(--text-primary);
    }

    .actions-cell {
      display: flex;
      gap: 8px;
    }

    .btn-small {
      width: 36px;
      height: 36px;
      padding: 0 !important;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px !important;
    }

    .btn-guardar { background-color: var(--success-color) !important; color: white !important; border: none !important; }
    .btn-cancelar { background-color: var(--bg-main) !important; color: var(--text-secondary) !important; }
    .btn-eliminar:hover { background-color: rgba(239, 68, 68, 0.1) !important; color: var(--danger-color) !important; }

    .status-select {
      background-color: #0f172a !important;
      border: 1px solid var(--border-color) !important;
      padding: 6px 12px !important;
      font-size: 0.85em !important;
      font-weight: 600 !important;
      color: var(--text-primary) !important;
    }

    .note-alert {
      background: rgba(59, 130, 246, 0.05);
      color: var(--text-secondary);
      padding: 16px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      border: 1px solid rgba(59, 130, 246, 0.1);
    }

    .empty-state {
      text-align: center;
      padding: 60px !important;
      color: var(--text-secondary);
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.3;
    }
  `]
})
export class ProyectoDetailComponent implements OnInit {
  proyecto = signal<Proyecto | null>(null);
  tareas = signal<Tarea[]>([]);
  nuevaTarea: Partial<Tarea> = { descripcion: '' };
  editandoTareaId: number | null = null;
  tareaEdit: Partial<Tarea> = {};
  sortField = signal<string>('descripcion');
  sortAsc = signal<boolean>(true);

  tareasOrdenadas = computed(() => {
    const data = [...this.tareas()];
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

  constructor(
    private proyectoService: ProyectoService,
    private tareaService: TareaService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarProyecto(id);
    this.cargarTareas(id);
  }

  cargarProyecto(id: number) {
    this.proyectoService.obtenerPorId(id).subscribe(p => this.proyecto.set(p));
  }

  cargarTareas(proyectoId: number) {
    this.tareaService.obtenerPorProyecto(proyectoId).subscribe(data => this.tareas.set(data));
  }

  ordenar(campo: string) {
    if (this.sortField() === campo) {
      this.sortAsc.update(asc => !asc);
    } else {
      this.sortField.set(campo);
      this.sortAsc.set(true);
    }
  }

  agregarTarea() {
    if (!this.authService.puedeCrear()) {
      return;
    }

    if (!this.nuevaTarea.descripcion?.trim()) {
      return;
    }

    const proyectoId = Number(this.route.snapshot.paramMap.get('id'));
    this.tareaService.crear({ ...this.nuevaTarea, proyectoId } as any).subscribe(() => {
      this.nuevaTarea = { descripcion: '' };
      this.cargarTareas(proyectoId);
    });
  }

  iniciarEdicion(t: Tarea) {
    this.editandoTareaId = t.id;
    this.tareaEdit = { descripcion: t.descripcion };
  }

  cancelarEdicion() {
    this.editandoTareaId = null;
    this.tareaEdit = {};
  }

  guardarEdicion(id: number) {
    if (!this.authService.puedeEditar()) {
      return;
    }

    this.tareaService.actualizar(id, this.tareaEdit).subscribe(() => {
      this.cancelarEdicion();
      const proyectoId = Number(this.route.snapshot.paramMap.get('id'));
      this.cargarTareas(proyectoId);
    });
  }

  cambiarEstadoTarea(id: number, event: Event) {
    if (!this.authService.puedeEditar()) {
      return;
    }

    const select = event.target as HTMLSelectElement;
    this.tareaService.actualizar(id, { estado: select.value as any }).subscribe(() => {
      const proyectoId = Number(this.route.snapshot.paramMap.get('id'));
      this.cargarTareas(proyectoId);
    });
  }

  eliminarTarea(id: number) {
    if (!this.authService.puedeEliminar()) {
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar esta tarea permanentemente?')) {
      this.tareaService.eliminar(id).subscribe(() => {
        const proyectoId = Number(this.route.snapshot.paramMap.get('id'));
        this.cargarTareas(proyectoId);
      });
    }
  }

  volver() {
    this.router.navigate(['/proyectos']);
  }
}
