import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './clientes.entity';
import { CrearClienteDto, EditarClienteDto } from './dtos/clientes.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepo: Repository<Cliente>,
  ) {}

  async crear(dto: CrearClienteDto) {
    const nuevo = this.clienteRepo.create(dto);
    return this.clienteRepo.save(nuevo);
  }

  async buscarTodos() {
    return this.clienteRepo.find({ relations: { proyectos: true } });
  }

  async buscarPorId(id: number) {
    const c = await this.clienteRepo.findOne({
      where: { id },
      relations: { proyectos: true },
    });
    if (!c) {
      throw new HttpException(
        `Cliente con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );
    }
    return c;
  }

  async buscarActivos() {
    return this.clienteRepo.find({ where: { estado: 'Activo' } });
  }

  async editar(id: number, dto: EditarClienteDto) {
    const existe = await this.buscarPorId(id);
    if (existe) {
      await this.clienteRepo.update({ id }, dto);
      return this.buscarPorId(id);
    }
  }

  async darDeBaja(id: number) {
    const cliente = await this.buscarPorId(id);
    const tieneProyectos = cliente.proyectos && cliente.proyectos.some(
      (p) => p.estado !== 'Baja',
    );
    if (tieneProyectos) {
      throw new HttpException(
        'No se puede dar de baja un cliente que está registrado en proyectos',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.clienteRepo.update({ id }, { estado: 'Baja' });
    return this.buscarPorId(id);
  }
}
