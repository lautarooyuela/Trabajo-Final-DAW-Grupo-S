import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea, EstadoTarea } from './tareas.entity';
import { Proyecto } from '../proyectos/proyectos.entity';
import { CrearTareaDto, EditarTareaDto } from './dtos/tareas.dto';
import { HistorialService } from '../historial/historial.service';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private tareaRepo: Repository<Tarea>,
    @InjectRepository(Proyecto)
    private proyectoRepo: Repository<Proyecto>,
    private historialService: HistorialService,
  ) {}

  async crear(dto: CrearTareaDto, usuarioNombre: string, usuarioId: number) {
    const proyecto = await this.proyectoRepo.findOne({
      where: { id: dto.proyectoId },
    });
    if (!proyecto) {
      throw new HttpException('Proyecto no encontrado', HttpStatus.NOT_FOUND);
    }
    const nueva = this.tareaRepo.create({
      ...dto,
      proyecto,
      estado: EstadoTarea.PENDIENTE,
    });
    const guardada = await this.tareaRepo.save(nueva);
    await this.historialService.registrar(
      'tarea',
      guardada.id,
      usuarioNombre,
      usuarioId,
      'crear',
      `Se creó la tarea "${guardada.descripcion}"`,
    );
    return guardada;
  }

  async buscarPorProyecto(proyectoId: number) {
    return this.tareaRepo.find({
      where: { proyecto: { id: proyectoId } },
      relations: { proyecto: true },
    });
  }

  async buscarPorId(id: number) {
    const t = await this.tareaRepo.findOne({
      where: { id },
      relations: { proyecto: true },
    });
    if (!t) {
      throw new HttpException(
        `Tarea con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );
    }
    return t;
  }

  async editar(
    id: number,
    dto: EditarTareaDto,
    usuarioNombre: string,
    usuarioId: number,
  ) {
    const existe = await this.buscarPorId(id);
    if (existe) {
      await this.tareaRepo.update({ id }, dto as Partial<Tarea>);
      await this.historialService.registrar(
        'tarea',
        id,
        usuarioNombre,
        usuarioId,
        'editar',
        `Se editó la tarea "${existe.descripcion}"`,
      );
      return this.buscarPorId(id);
    }
  }

  async darDeBaja(id: number, usuarioNombre: string, usuarioId: number) {
    const existe = await this.buscarPorId(id);
    if (existe) {
      await this.tareaRepo.update({ id }, { estado: EstadoTarea.BAJA });
      await this.historialService.registrar(
        'tarea',
        id,
        usuarioNombre,
        usuarioId,
        'darBaja',
        `Se dio de baja la tarea "${existe.descripcion}"`,
      );
      return this.buscarPorId(id);
    }
  }
}
