import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './clientes.entity';
import { CrearClienteDto, EditarClienteDto } from './dtos/clientes.dto';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepo: Repository<Cliente>,
  ) {}

  private normalizarTelefono(telefono: string): string {
    if (!telefono) return telefono;
    
    try {
      // Detectar automáticamente el país del teléfono E.164
      const parsed = parsePhoneNumber(telefono);
      if (parsed && parsed.isValid()) {
        // Retornar en formato E.164: +34912345678
        return parsed.format('E.164');
      }
    } catch (e) {
      // Si no se puede parsear, retornar tal cual (la validación en DTO fallará)
    }
    
    return telefono;
  }

  async crear(dto: CrearClienteDto) {
    // Normalizar teléfono a E.164
    const clienteNormalizado = {
      ...dto,
      telefono: this.normalizarTelefono(dto.telefono),
    };
    const nuevo = this.clienteRepo.create(clienteNormalizado);
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
      // Normalizar teléfono si viene en el DTO
      const dtoNormalizado = { ...dto };
      if (dto.telefono) {
        dtoNormalizado.telefono = this.normalizarTelefono(dto.telefono);
      }
      await this.clienteRepo.update({ id }, dtoNormalizado);
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
