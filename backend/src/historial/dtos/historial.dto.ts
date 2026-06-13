import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CrearHistorialDto {
  @IsString()
  entidad: string;

  @IsNumber()
  entidadId: number;

  @IsString()
  usuarioNombre: string;

  @IsString()
  accion: string;

  @IsOptional()
  @IsString()
  detalle?: string;
}
