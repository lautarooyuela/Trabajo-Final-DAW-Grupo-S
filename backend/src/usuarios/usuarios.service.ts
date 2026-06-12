import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, EstadoUsuario, RolUsuario } from './usuarios.entity';
import { CrearUsuarioDto, EditarUsuarioDto } from './dtos/usuarios.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  private sinClave(usuario: Usuario) {
    const { clave, ...resto } = usuario;
    return resto;
  }

  private sinClaveListado(usuarios: Usuario[]) {
    return usuarios.map((usuario) => this.sinClave(usuario));
  }

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

    const salt = await bcrypt.genSalt();
    const claveHasheada = await bcrypt.hash(dto.clave, salt);

    const nuevo = this.usuarioRepo.create({
      ...dto,
      clave: claveHasheada,
      rol: dto.rol ?? RolUsuario.LECTOR,
      estado: EstadoUsuario.ACTIVO,
    });
    const guardado = await this.usuarioRepo.save(nuevo);
    return this.sinClave(guardado);
  }

  async buscarTodos() {
    const usuarios = await this.usuarioRepo.find();
    return this.sinClaveListado(usuarios);
  }

  async buscarPorId(id: number) {
    const u = await this.usuarioRepo.findOne({ where: { id } });
    if (!u) {
      throw new HttpException(
        `Usuario con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );
    }
    return this.sinClave(u);
  }

  async buscarPorNombreUsuario(nombreUsuario: string) {
    return this.usuarioRepo.findOne({ where: { nombreUsuario } });
  }

  async buscarUsuarioActivoPorNombre(nombreUsuario: string) {
    return this.usuarioRepo.findOne({
      where: { nombreUsuario, estado: EstadoUsuario.ACTIVO },
    });
  }

  async editar(id: number, dto: EditarUsuarioDto) {
    const existe = await this.usuarioRepo.findOne({ where: { id } });
    if (!existe) {
      throw new HttpException(
        `Usuario con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (dto.clave) {
      const salt = await bcrypt.genSalt();
      dto.clave = await bcrypt.hash(dto.clave, salt);
    }

    await this.usuarioRepo.update({ id }, dto as any);
    return this.buscarPorId(id);
  }

  async login(nombreUsuario: string, clave: string) {
    const usuario = await this.usuarioRepo.findOne({
      where: { nombreUsuario },
    });

    if (!usuario) {
      throw new HttpException(
        'Credenciales inválidas',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const esValida = await bcrypt.compare(clave, usuario.clave);
    if (!esValida) {
      throw new HttpException(
        'Credenciales inválidas',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (usuario.estado !== EstadoUsuario.ACTIVO) {
      throw new HttpException('Usuario dado de baja', HttpStatus.FORBIDDEN);
    }

    return this.sinClave(usuario);
  }
}
