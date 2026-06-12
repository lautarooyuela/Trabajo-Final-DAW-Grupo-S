import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente, EstadoCliente } from './clientes.entity';
import { CrearClienteDto, EditarClienteDto } from './dtos/clientes.dto';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { HistorialService } from '../historial/historial.service';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepo: Repository<Cliente>,
    private historialService: HistorialService,
  ) {}

  private normalizarTelefono(telefono: string): string {
    if (!telefono) return telefono;
    
    try {
      const parsed = parsePhoneNumber(telefono);
      if (parsed && parsed.isValid()) {
        return parsed.format('E.164');
      }
    } catch (e) {
    }
    
    return telefono;
  }

  async crear(dto: CrearClienteDto, usuarioNombre: string) {
    const clienteNormalizado: Partial<Cliente> = {
      ...dto,
      telefono: this.normalizarTelefono(dto.telefono),
      estado: dto.estado
        ? (dto.estado as unknown as EstadoCliente)
        : EstadoCliente.ACTIVO,
    };
    const guardado = await this.clienteRepo.save(clienteNormalizado as Cliente);
    await this.historialService.registrar('cliente', guardado.id, usuarioNombre, 'crear', `Se creó el cliente "${guardado.nombre}"`);
    return guardado;
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
    return this.clienteRepo.find({ where: { estado: EstadoCliente.ACTIVO } });
  }

  async editar(id: number, dto: EditarClienteDto, usuarioNombre: string) {
    const existe = await this.buscarPorId(id);
    if (existe) {
      const dtoNormalizado: any = { ...dto };
      if (dto.estado) {
        dtoNormalizado.estado = dto.estado as unknown as EstadoCliente;
      }
      if (dto.telefono) {
        dtoNormalizado.telefono = this.normalizarTelefono(dto.telefono);
      }
      await this.clienteRepo.update({ id }, dtoNormalizado);
      await this.historialService.registrar('cliente', id, usuarioNombre, 'editar', `Se editó el cliente "${existe.nombre}"`);
      return this.buscarPorId(id);
    }
  }

  async darDeBaja(id: number, usuarioNombre: string) {
    const cliente = await this.buscarPorId(id);
    const tieneProyectos =
      cliente.proyectos &&
      cliente.proyectos.some((p) => p.estado !== (EstadoCliente.BAJA as any));
    if (tieneProyectos) {
      throw new HttpException(
        'No se puede dar de baja un cliente que está registrado en proyectos',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.clienteRepo.update({ id }, { estado: EstadoCliente.BAJA });
    await this.historialService.registrar('cliente', id, usuarioNombre, 'darBaja', `Se dio de baja el cliente "${cliente.nombre}"`);
    return this.buscarPorId(id);
  }
}