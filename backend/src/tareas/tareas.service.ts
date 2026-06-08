import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarea, EstadoTarea } from './tareas.entity';
import { Proyecto } from '../proyectos/proyectos.entity';
import { CrearTareaDto, EditarTareaDto } from './dtos/tareas.dto';

@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private tareaRepo: Repository<Tarea>,
    @InjectRepository(Proyecto)
    private proyectoRepo: Repository<Proyecto>,
  ) {}

  async crear(dto: CrearTareaDto) {
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
    return this.tareaRepo.save(nueva);
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

  async editar(id: number, dto: EditarTareaDto) {
    const existe = await this.buscarPorId(id);
    if (existe) {
      await this.tareaRepo.update({ id }, dto as any);
      return this.buscarPorId(id);
    }
  }

  async darDeBaja(id: number) {
    const existe = await this.buscarPorId(id);
    if (existe) {
      await this.tareaRepo.delete(id);
      return { deleted: true };
    }
  }
}
