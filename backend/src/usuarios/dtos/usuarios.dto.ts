import { EstadoUsuario, RolUsuario } from '../usuarios.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearUsuarioDto {
  @ApiProperty({ example: 'nuevo_usuario' })
  nombreUsuario!: string;
  @ApiProperty({ example: 'password123' })
  clave!: string;
  @ApiPropertyOptional({ enum: RolUsuario, default: RolUsuario.LECTOR })
  rol?: RolUsuario;
  @ApiPropertyOptional({ enum: EstadoUsuario, default: EstadoUsuario.ACTIVO })
  estado?: EstadoUsuario;
}

export class EditarUsuarioDto {
  @ApiPropertyOptional({ example: 'usuario_editado' })
  nombreUsuario?: string;
  @ApiPropertyOptional({ example: 'nueva_password' })
  clave?: string;
  @ApiPropertyOptional({ enum: RolUsuario })
  rol?: RolUsuario;
  @ApiPropertyOptional({ enum: EstadoUsuario })
  estado?: EstadoUsuario;
}
