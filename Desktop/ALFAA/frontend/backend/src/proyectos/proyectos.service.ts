import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from './proyectos.entity';
import { Cliente } from '../clientes/clientes.entity';
import { CrearProyectoDto, EditarProyectoDto } from './dtos/proyectos.dto';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private proyectoRepo: Repository<Proyecto>,
    @InjectRepository(Cliente)
    private clienteRepo: Repository<Cliente>,
  ) {}

  async crear(dto: CrearProyectoDto) {
    const nuevo = this.proyectoRepo.create(dto);
    if (dto.clienteId) {
      const cliente = await this.clienteRepo.findOne({
        where: { id: dto.clienteId },
      });
      if (!cliente) {
        throw new HttpException(
          'Cliente no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }
      if (cliente.estado !== 'Activo') {
        throw new HttpException(
          'Solo se puede asignar un cliente en estado Activo',
          HttpStatus.BAD_REQUEST,
        );
      }
      nuevo.cliente = cliente;
    }
    return this.proyectoRepo.save(nuevo);
  }

  async buscarTodos() {
    return this.proyectoRepo.find({
      relations: { cliente: true, tareas: true },
    });
  }

  async buscarPorId(id: number) {
    const p = await this.proyectoRepo.findOne({
      where: { id },
      relations: { cliente: true, tareas: true },
    });
    if (!p) {
      throw new HttpException(
        `Proyecto con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );
    }
    return p;
  }

  async editar(id: number, dto: EditarProyectoDto) {
    const existe = await this.buscarPorId(id);
    if (existe) {
      const updateData: any = { ...dto };
      if (dto.clienteId !== undefined) {
        if (dto.clienteId === null) {
          updateData.cliente = null;
        } else {
          const cliente = await this.clienteRepo.findOne({
            where: { id: dto.clienteId },
          });
          if (!cliente) {
            throw new HttpException(
              'Cliente no encontrado',
              HttpStatus.NOT_FOUND,
            );
          }
          if (cliente.estado !== 'Activo') {
            throw new HttpException(
              'Solo se puede asignar un cliente en estado Activo',
              HttpStatus.BAD_REQUEST,
            );
          }
          updateData.cliente = cliente;
        }
        delete updateData.clienteId;
      }
      await this.proyectoRepo.update({ id }, updateData);
      return this.buscarPorId(id);
    }
  }

  async darDeBaja(id: number) {
    const existe = await this.buscarPorId(id);
    if (existe) {
      await this.proyectoRepo.update({ id }, { estado: 'Baja' });
      return this.buscarPorId(id);
    }
  }
}
