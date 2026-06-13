import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto, EstadoProyecto } from './proyectos.entity';
import { Cliente, EstadoCliente } from '../clientes/clientes.entity';
import { CrearProyectoDto, EditarProyectoDto } from './dtos/proyectos.dto';
import { HistorialService } from '../historial/historial.service';

@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private proyectoRepo: Repository<Proyecto>,
    @InjectRepository(Cliente)
    private clienteRepo: Repository<Cliente>,
    private historialService: HistorialService,
  ) {}

  async crear(dto: CrearProyectoDto, usuarioNombre: string, usuarioId: number) {
    const nuevo = this.proyectoRepo.create(dto as unknown as Proyecto);
    if (dto.clienteId) {
      const cliente = await this.clienteRepo.findOne({
        where: { id: dto.clienteId },
      });
      if (!cliente) {
        throw new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND);
      }
      if (cliente.estado !== EstadoCliente.ACTIVO) {
        throw new HttpException(
          'Solo se puede asignar un cliente en estado Activo',
          HttpStatus.BAD_REQUEST,
        );
      }
      nuevo.cliente = cliente;
    }
    const guardado = await this.proyectoRepo.save(nuevo);
    await this.historialService.registrar(
      'proyecto',
      guardado.id,
      usuarioNombre,
      usuarioId,
      'crear',
      `Se creó el proyecto "${guardado.nombre}"`,
    );
    return guardado;
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

  async editar(
    id: number,
    dto: EditarProyectoDto,
    usuarioNombre: string,
    usuarioId: number,
  ) {
    const existe = await this.buscarPorId(id);
    if (existe) {
      const { clienteId, ...campos } = dto;
      if (clienteId !== undefined) {
        if (clienteId === null) {
          await this.proyectoRepo.update({ id }, {
            ...campos,
            cliente: null,
          } as Partial<Proyecto>);
        } else {
          const cliente = await this.clienteRepo.findOne({
            where: { id: clienteId },
          });
          if (!cliente) {
            throw new HttpException(
              'Cliente no encontrado',
              HttpStatus.NOT_FOUND,
            );
          }
          if (cliente.estado !== EstadoCliente.ACTIVO) {
            throw new HttpException(
              'Solo se puede asignar un cliente en estado Activo',
              HttpStatus.BAD_REQUEST,
            );
          }
          await this.proyectoRepo.update({ id }, {
            ...campos,
            cliente,
          } as Partial<Proyecto>);
        }
      } else {
        await this.proyectoRepo.update({ id }, campos as Partial<Proyecto>);
      }
      await this.historialService.registrar(
        'proyecto',
        id,
        usuarioNombre,
        usuarioId,
        'editar',
        `Se editó el proyecto "${existe.nombre}"`,
      );
      return this.buscarPorId(id);
    }
  }

  async darDeBaja(id: number, usuarioNombre: string, usuarioId: number) {
    const existe = await this.buscarPorId(id);
    if (existe) {
      await this.proyectoRepo.update({ id }, { estado: EstadoProyecto.BAJA });
      await this.historialService.registrar(
        'proyecto',
        id,
        usuarioNombre,
        usuarioId,
        'darBaja',
        `Se dio de baja el proyecto "${existe.nombre}"`,
      );
      return this.buscarPorId(id);
    }
  }
}
