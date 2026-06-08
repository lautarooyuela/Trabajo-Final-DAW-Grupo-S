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
      <h2 class="titulo-seccion">Estadísticas</h2>

      @if (cargando()) {
        <div class="cargando-container">
          <p class="cargando">Cargando datos del sistema...</p>
        </div>
      } @else {
        <div class="grid-cards">
          <div class="card">
            <span class="card-numero azul">{{ totalProyectos() }}</span>
            <span class="card-label">Proyectos totales</span>
          </div>
          <div class="card">
            <span class="card-numero verde">{{ proyectosActivos() }}</span>
            <span class="card-label">Proyectos activos</span>
          </div>
          <div class="card">
            <span class="card-numero gris">{{ proyectosFinalizados() }}</span>
            <span class="card-label">Proyectos finalizados</span>
          </div>
          <div class="card">
            <span class="card-numero rojo">{{ proyectosBaja() }}</span>
            <span class="card-label">Proyectos de baja</span>
          </div>
          <div class="card">
            <span class="card-numero naranja">{{ tareasPendientes() }}</span>
            <span class="card-label">Tareas pendientes</span>
          </div>
          <div class="card">
            <span class="card-numero verde-claro">{{ tareasFinalizadas() }}</span>
            <span class="card-label">Tareas finalizadas</span>
          </div>
        </div>

        <div class="grid-tablas">
          <div class="seccion">
            <h3 class="subtitulo">Proyectos por cliente</h3>
            <div class="tabla-container">
              <table>
                <thead>
                  <tr>
                    <th>CLIENTE</th>
                    <th class="td-numero">CANTIDAD</th>
                    <th>BARRA</th>
                  </tr>
                </thead>
                <tbody>
                  @for (fila of proyectosPorCliente(); track fila.nombre) {
                    <tr>
                      <td class="td-nombre">{{ fila.nombre }}</td>
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
          </div>

          <div class="seccion">
            <h3 class="subtitulo">Tareas por proyecto (top 5)</h3>
            <div class="tabla-container">
              <table>
                <thead>
                  <tr>
                    <th>PROYECTO</th>
                    <th class="td-numero">PENDIENTES</th>
                    <th class="td-numero">FINALIZADAS</th>
                    <th class="td-numero">BAJA</th>
                    <th class="td-numero">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  @for (fila of topProyectosPorTareas(); track fila.nombre) {
                    <tr>
                      <td class="td-nombre">{{ fila.nombre }}</td>
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
        </div>
      }
    </div>
  `,
  styles: [`
    .page { padding: 32px; max-width: 1200px; margin: 0 auto; }
    
    .titulo-seccion { 
      margin: 0 0 32px; 
      color: var(--text-secondary); 
      font-size: 1.4em; 
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .subtitulo { 
      margin: 0 0 20px; 
      color: var(--text-primary); 
      font-size: 0.9em; 
      font-weight: 700;
      text-transform: none;
    }

    .cargando-container {
      display: flex;
      justify-content: center;
      padding: 100px 0;
    }
    .cargando { color: var(--text-secondary); font-weight: 500; }

    .grid-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 40px;
    }

    .card {
      background: var(--bg-card);
      border-radius: 12px;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border: 1px solid var(--border-color);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: transform 0.2s;
    }
    .card:hover { transform: translateY(-2px); }

    .card-numero { font-size: 2.5em; font-weight: 800; line-height: 1; }
    .card-label { font-size: 0.75em; text-align: center; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em; }

    .azul { color: #60a5fa; }
    .verde { color: #34d399; }
    .verde-claro { color: #a7f3d0; }
    .gris { color: #94a3b8; }
    .rojo { color: #f87171; }
    .naranja { color: #fb923c; }

    .grid-tablas {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      align-items: start;
    }

    .seccion {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    }

    .tabla-container { overflow-x: auto; }

    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-top: 0; 
      border: none; 
      background: transparent;
      box-shadow: none;
    }
    
    th { 
      background-color: #1e293b !important; 
      color: var(--text-secondary) !important; 
      font-weight: 700 !important;
      font-size: 0.7em !important;
      padding: 12px 16px !important;
      border-bottom: 1px solid var(--border-color) !important;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    td { 
      padding: 14px 16px !important; 
      border-bottom: 1px solid var(--border-color) !important;
      color: var(--text-primary);
      font-size: 0.85em;
    }

    tr:last-child td { border-bottom: none; }
    tbody tr:hover { background-color: rgba(255, 255, 255, 0.03) !important; }

    .td-nombre { font-weight: 500; color: var(--text-primary); }
    .td-numero { text-align: center; color: var(--text-secondary); }
    .td-bold { font-weight: 700; color: var(--text-primary); }
    .td-barra { width: 140px; }

    .barra-fondo { 
      background: rgba(255, 255, 255, 0.05); 
      border-radius: 99px; 
      height: 8px; 
      width: 100%; 
      overflow: hidden;
    }
    .barra-relleno { 
      background: linear-gradient(90deg, #3b82f6, #60a5fa); 
      border-radius: 99px; 
      height: 100%; 
      transition: width 0.5s ease-out;
    }

    .sin-datos { text-align: center; color: var(--text-secondary); padding: 20px !important; font-style: italic; }

    @media (max-width: 900px) {
      .grid-tablas { grid-template-columns: 1fr; }
      .page { padding: 16px; }
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