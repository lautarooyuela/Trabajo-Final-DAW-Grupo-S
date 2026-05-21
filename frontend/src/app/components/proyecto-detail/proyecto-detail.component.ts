import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Proyecto } from '../../models/proyecto.model';
import { Tarea } from '../../models/tarea.model';
import { ProyectoService } from '../../services/proyecto.service';
import { TareaService } from '../../services/tarea.service';

@Component({
  selector: 'app-proyecto-detail',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>Proyecto: {{ proyecto()?.nombre }}</h2>
    <p>Estado: {{ proyecto()?.estado }}</p>
    <p>Cliente: {{ proyecto()?.cliente?.nombre || 'Interno' }}</p>

    <h3>Tareas</h3>
    <div class="tarea-form">
      <input type="text" [(ngModel)]="nuevaTarea.descripcion" name="desc" placeholder="Nueva tarea" />
      <button (click)="agregarTarea()">Agregar</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        @for (t of tareas(); track t.id) {
          <tr>
            <td>{{ t.id }}</td>
            <td>
              @if (editandoTareaId === t.id) {
                <input type="text" [(ngModel)]="tareaEdit.descripcion" />
              } @else {
                {{ t.descripcion }}
              }
            </td>
            <td>
              <select (change)="cambiarEstadoTarea(t.id, $event)">
                <option value="Pendiente" [selected]="t.estado === 'Pendiente'">Pendiente</option>
                <option value="Finalizado" [selected]="t.estado === 'Finalizado'">Finalizado</option>
                <option value="Baja" [selected]="t.estado === 'Baja'">Baja</option>
              </select>
            </td>
            <td>
              @if (editandoTareaId === t.id) {
                <button (click)="guardarEdicion(t.id)">Guardar</button>
                <button (click)="cancelarEdicion()">Cancelar</button>
              } @else {
                <button (click)="iniciarEdicion(t)">Editar descripción</button>
              }
            </td>
          </tr>
        }
      </tbody>
    </table>

    <button (click)="volver()">Volver</button>
  `,
  styles: [`
    .tarea-form { display: flex; gap: 8px; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    button { margin-right: 6px; }
  `]
})
export class ProyectoDetailComponent implements OnInit {
  proyecto = signal<Proyecto | null>(null);
  tareas = signal<Tarea[]>([]);
  nuevaTarea: Partial<Tarea> = { descripcion: '' };
  editandoTareaId: number | null = null;
  tareaEdit: Partial<Tarea> = {};

  constructor(
    private proyectoService: ProyectoService,
    private tareaService: TareaService,
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

  agregarTarea() {
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
    this.tareaService.actualizar(id, this.tareaEdit).subscribe(() => {
      this.cancelarEdicion();
      const proyectoId = Number(this.route.snapshot.paramMap.get('id'));
      this.cargarTareas(proyectoId);
    });
  }

  cambiarEstadoTarea(id: number, event: Event) {
    const select = event.target as HTMLSelectElement;
    const nuevoEstado = select.value;
    this.tareaService.actualizar(id, { estado: nuevoEstado }).subscribe(() => {
      const proyectoId = Number(this.route.snapshot.paramMap.get('id'));
      this.cargarTareas(proyectoId);
    });
  }

  volver() {
    this.router.navigate(['/proyectos']);
  }
}
