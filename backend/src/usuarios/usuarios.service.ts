import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuarios.entity';
import { CrearUsuarioDto, EditarUsuarioDto } from './dtos/usuarios.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  async crear(dto: CrearUsuarioDto) {
    const existe = await this.usuarioRepo.findOne({
      where: { nombreUsuario: dto.nombreUsuario },
    });
    if (existe) {
      throw new HttpException(
        `El nombre de usuario ${dto.nombreUsuario} ya existe`,
        HttpStatus.CONFLICT,
      );
    }
    const nuevo = this.usuarioRepo.create(dto);
    return this.usuarioRepo.save(nuevo);
  }

  async buscarTodos() {
    return this.usuarioRepo.find();
  }

  async buscarPorId(id: number) {
    const u = await this.usuarioRepo.findOne({ where: { id } });
    if (!u) {
      throw new HttpException(
        `Usuario con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );
    }
    return u;
  }

  async buscarPorNombreUsuario(nombreUsuario: string) {
    return this.usuarioRepo.findOne({ where: { nombreUsuario } });
  }

  async editar(id: number, dto: EditarUsuarioDto) {
    const existe = await this.buscarPorId(id);
    if (existe) {
      await this.usuarioRepo.update({ id }, dto);
      return this.buscarPorId(id);
    }
  }

  async login(nombreUsuario: string, clave: string) {
    const usuario = await this.usuarioRepo.findOne({
      where: { nombreUsuario, clave },
    });
    if (!usuario) {
      throw new HttpException(
        'Credenciales inválidas',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (usuario.estado !== 'Activo') {
      throw new HttpException(
        'Usuario dado de baja',
        HttpStatus.FORBIDDEN,
      );
    }
    return usuario;
  }
}
