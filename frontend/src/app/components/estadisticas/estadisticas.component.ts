import { Component, OnInit, signal, computed } from '@angular/core';
import { Proyecto } from '../../models/proyecto.model';
import { Cliente } from '../../models/cliente.model';
import { ProyectoService } from '../../services/proyecto.service';
import { ClienteService } from '../../services/cliente.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  template: `
    <div class="page">
      <h2>Estadisticas</h2>

      @if (cargando()) {
        <p class="cargando">Cargando...</p>
      } @else {
        <div class="grid-cards">
          <div class="card card-azul">
            <span class="card-numero">{{ totalProyectos() }}</span>
            <span class="card-label">Proyectos totales</span>
          </div>
          <div class="card card-verde">
            <span class="card-numero">{{ proyectosActivos() }}</span>
            <span class="card-label">Proyectos activos</span>
          </div>
          <div class="card card-gris">
            <span class="card-numero">{{ proyectosFinalizados() }}</span>
            <span class="card-label">Proyectos finalizados</span>
          </div>
          <div class="card card-rojo">
            <span class="card-numero">{{ proyectosBaja() }}</span>
            <span class="card-label">Proyectos de baja</span>
          </div>
          <div class="card card-naranja">
            <span class="card-numero">{{ tareasPendientes() }}</span>
            <span class="card-label">Tareas pendientes</span>
          </div>
          <div class="card card-verde">
            <span class="card-numero">{{ tareasFinalizadas() }}</span>
            <span class="card-label">Tareas finalizadas</span>
          </div>
        </div>

        <div class="grid-tablas">
          <div class="seccion">
            <h3>Proyectos por cliente</h3>
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Cantidad</th>
                  <th>Barra</th>
                </tr>
              </thead>
              <tbody>
                @for (fila of proyectosPorCliente(); track fila.nombre) {
                  <tr>
                    <td>{{ fila.nombre }}</td>
                    <td class="td-numero">{{ fila.cantidad }}</td>
                    <td class="td-barra">
                      <div class="barra-fondo">
                        <div
                          class="barra-relleno"
                          [style.width.%]="(fila.cantidad / maxProyectosPorCliente()) * 100"
                        ></div>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="seccion">
            <h3>Tareas por proyecto (top 5)</h3>
            <table>
              <thead>
                <tr>
                  <th>Proyecto</th>
                  <th>Pendientes</th>
                  <th>Finalizadas</th>
                  <th>Baja</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                @for (fila of topProyectosPorTareas(); track fila.nombre) {
                  <tr>
                    <td>{{ fila.nombre }}</td>
                    <td class="td-numero">{{ fila.pendientes }}</td>
                    <td class="td-numero">{{ fila.finalizadas }}</td>
                    <td class="td-numero">{{ fila.baja }}</td>
                    <td class="td-numero td-bold">{{ fila.total }}</td>
                  </tr>
                }
                @if (topProyectosPorTareas().length === 0) {
                  <tr>
                    <td colspan="5" class="sin-datos">No hay tareas cargadas.</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { padding: 24px; }
    h2 { margin: 0 0 24px; color: #222; }
    h3 { margin: 0 0 14px; color: #333; font-size: 1em; }

    .cargando { color: #888; }

    .grid-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .card {
      border-radius: 8px;
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      border: 1px solid #e0e0e0;
    }

    .card-numero { font-size: 2.2em; font-weight: bold; line-height: 1; }
    .card-label { font-size: 0.82em; text-align: center; color: #555; }

    .card-azul { background: #e3f2fd; }
    .card-azul .card-numero { color: #1565c0; }
    .card-verde { background: #e8f5e9; }
    .card-verde .card-numero { color: #2e7d32; }
    .card-gris { background: #f5f5f5; }
    .card-gris .card-numero { color: #444; }
    .card-rojo { background: #ffebee; }
    .card-rojo .card-numero { color: #c62828; }
    .card-naranja { background: #fff3e0; }
    .card-naranja .card-numero { color: #e65100; }

    .grid-tablas {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .seccion {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
    }

    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #e0e0e0; padding: 10px 12px; text-align: left; font-size: 0.92em; }
    th { background: #f8f9fa; font-weight: 600; }
    tbody tr:hover { background: #f9f9f9; }

    .td-numero { text-align: center; width: 60px; }
    .td-bold { font-weight: bold; }
    .td-barra { width: 120px; }

    .barra-fondo { background: #e0e0e0; border-radius: 4px; height: 10px; width: 100%; }
    .barra-relleno { background: #1976d2; border-radius: 4px; height: 10px; }

    .sin-datos { text-align: center; color: #888; }

    @media (max-width: 700px) {
      .grid-tablas { grid-template-columns: 1fr; }
    }
  `]
})

//creo la clase de estadisticas (funcionalidad nueva)
export class EstadisticasComponent implements OnInit {
  proyectos = signal<Proyecto[]>([]);
  clientes = signal<Cliente[]>([]);
  cargando = signal(true);
  //total de proyectos
  totalProyectos = computed(() => this.proyectos().length);
  proyectosActivos = computed(() => this.proyectos().filter(p => p.estado === 'ACTIVO').length);
  proyectosFinalizados = computed(() => this.proyectos().filter(p => p.estado === 'FINALIZADO').length);
  proyectosBaja = computed(() => this.proyectos().filter(p => p.estado === 'BAJA').length);

  tareasPendientes = computed(() =>
    this.proyectos().reduce((acc, p) => acc + (p.tareas?.filter(t => t.estado === 'PENDIENTE').length ?? 0), 0)
  );

  tareasFinalizadas = computed(() =>
    this.proyectos().reduce((acc, p) => acc + (p.tareas?.filter(t => t.estado === 'FINALIZADA').length ?? 0), 0)
  );

  proyectosPorCliente = computed(() => {
    const mapa = new Map<string, number>();
    for (const p of this.proyectos()) {
      const nombre = p.cliente?.nombre ?? 'Interno';
      mapa.set(nombre, (mapa.get(nombre) ?? 0) + 1);
    }
    return Array.from(mapa.entries())
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);
  });

  maxProyectosPorCliente = computed(() =>
    Math.max(1, ...this.proyectosPorCliente().map(f => f.cantidad))
  );

  topProyectosPorTareas = computed(() =>
    this.proyectos()
      .map(p => ({
        nombre: p.nombre,
        pendientes: p.tareas?.filter(t => t.estado === 'PENDIENTE').length ?? 0,
        finalizadas: p.tareas?.filter(t => t.estado === 'FINALIZADA').length ?? 0,
        baja: p.tareas?.filter(t => t.estado === 'BAJA').length ?? 0,
        total: p.tareas?.length ?? 0,
      }))
      .filter(f => f.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  );

  constructor(
    private proyectoService: ProyectoService,
    private clienteService: ClienteService,
  ) {}

  ngOnInit() {
    forkJoin({
      proyectos: this.proyectoService.obtenerTodos(),
      clientes: this.clienteService.obtenerTodos(),
    }).subscribe(({ proyectos, clientes }) => {
      this.proyectos.set(proyectos);
      this.clientes.set(clientes);
      this.cargando.set(false);
    });
  }
}