import { Component, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Proyecto } from '../../models/proyecto.model';
import { Tarea } from '../../models/tarea.model';
import { ProyectoService } from '../../services/proyecto.service';
import { TareaService } from '../../services/tarea.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-proyecto-detail',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="header-card">
        <div>
          <h2>{{ proyecto()?.nombre }}</h2>
          <p class="meta">Estado: {{ proyecto()?.estado }} · Cliente: {{ proyecto()?.cliente?.nombre || 'Interno' }}</p>
        </div>

        <button class="btn-secondary" routerLink="/proyectos">Volver</button>
      </div>

      <div class="card-section">
        <div class="section-title">
          <h3>Tareas</h3>
          <span>{{ tareas().length }} total</span>
        </div>

        @if (authService.puedeCrear()) {
          <form class="task-form" (ngSubmit)="agregarTarea()">
            <input
              type="text"
              [(ngModel)]="nuevaTarea.descripcion"
              name="descripcion"
              placeholder="Nueva tarea"
            />
            <button type="submit" class="btn-primary" [disabled]="!nuevaTarea.descripcion?.trim()">Agregar</button>
          </form>
        } @else {
          <p class="note">Solo los usuarios con rol EDITOR o ADMIN pueden crear tareas.</p>
        }

        <table class="tasks-table">
          <thead>
            <tr>
              <th (click)="ordenar('descripcion')" style="cursor: pointer; user-select: none;">
                Descripción {{ sortField() === 'descripcion' ? (sortAsc() ? '▲' : '▼') : '' }}
              </th>
              <th (click)="ordenar('estado')" style="cursor: pointer; user-select: none;">
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
                    {{ t.descripcion }}
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
                      <span class="estado-texto">{{ t.estado }}</span>
                    }
                  </td>
                <td>
                    @if (authService.puedeEditar() && editandoTareaId === t.id) {
                      <button type="button" class="btn-small btn-guardar" (click)="guardarEdicion(t.id)">Guardar</button>
                      <button type="button" class="btn-small btn-cancelar" (click)="cancelarEdicion()">Cancelar</button>
                    } @else if (authService.puedeEditar()) {
                      <button type="button" class="btn-small btn-editar" (click)="iniciarEdicion(t)">Editar</button>
                      @if (authService.puedeEliminar()) {
                        <button class="btn-small btn-eliminar" type="button" (click)="eliminarTarea(t.id)">Eliminar</button>
                      }
                    } @else {
                      <span class="empty-actions">Sin acciones</span>
                    }
                </td>
              </tr>
            }
            @if (tareasOrdenadas().length === 0) {
              <tr>
                <td colspan="3" class="empty-state">No hay tareas creadas para este proyecto.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page {
      padding: 24px;
      display: grid;
      gap: 20px;
      justify-items: center;
    }

    .header-card,
    .card-section {
      width: 50%;
      align-self: center;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
    }

    .header-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    h2,
    h3 {
      margin: 0;
      color: #222;
    }

    .meta {
      margin: 6px 0 0;
      color: #666;
    }

    .section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      color: #666;
    }

    .task-form {
      display: flex;
      gap: 10px;
      margin-bottom: 16px;
    }

    .task-form input,
    .inline-input,
    .status-select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
      font: inherit;
      background: #fff;
    }

    .task-form input {
      flex: 1;
    }

    .tasks-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }

    .tasks-table th,
    .tasks-table td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }

    .tasks-table th {
      background-color: #f8f9fa;
      font-weight: bold;
    }

    .tasks-table tbody tr:hover {
      background-color: #f9f9f9;
      transition: 0.2s;
    }

    .btn-primary,
    .btn-secondary,
    .btn-small {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 8px 14px;
      cursor: pointer;
      background: #f5f5f5;
      color: #444;
    }

    .btn-primary {
      background: #2e7d32;
      color: #fff;
      border-color: #2e7d32;
    }

    .btn-secondary {
      min-width: 110px;
    }

    .btn-editar {
      background-color: #f5f5f5;
      color: #555;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 4px 10px;
      margin-right: 6px;
      cursor: pointer;
    }

    .btn-editar:hover {
      background-color: #e0e0e0;
    }

    .btn-eliminar {
      color: #d32f2f;
      font-weight: 600;
      background: none;
      border: 1px solid #d32f2f;
      border-radius: 4px;
      padding: 4px 10px;
      cursor: pointer;
    }

        .danger-btn { color: #d32f2f; font-weight: 600; background: none; border: 1px solid #d32f2f; border-radius: 4px; padding: 4px 10px; cursor: pointer; }


    .btn-eliminar:hover {
      background-color: #ffebee;
    }


    .btn-guardar {
      background: #2e7d32;
      color: #fff;
      border-color: #2e7d32;
      margin-right: 6px;
    }

    .btn-cancelar {
      background: #f5f5f5;
      color: #555;
    }


    .empty-state {
      text-align: center;
      color: #888;
      font-style: italic;
      padding: 24px !important;
    }

    .note {
      margin: 0 0 16px;
      color: #666;
    }

    .estado-texto {
      color: #555;
      font-weight: 500;
    }

    .empty-actions {
      color: #888;
      font-size: 0.9em;
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