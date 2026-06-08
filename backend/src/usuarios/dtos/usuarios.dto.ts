import { EstadoUsuario, RolUsuario } from '../usuarios.entity';

export class CrearUsuarioDto {
  nombreUsuario!: string;
  clave!: string;
  rol?: RolUsuario;
  estado?: EstadoUsuario;
}

export class EditarUsuarioDto {
  nombreUsuario?: string;
  clave?: string;
  rol?: RolUsuario;
  estado?: EstadoUsuario;
}
