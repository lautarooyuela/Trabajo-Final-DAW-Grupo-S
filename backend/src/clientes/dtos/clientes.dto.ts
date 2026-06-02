import { IsString, IsEmail, Matches, MinLength, IsOptional } from 'class-validator';

export class CrearClienteDto {
  @IsString()
  @MinLength(1, { message: 'El nombre es requerido' })
  nombre: string;

  @IsEmail({}, { message: 'El email debe ser válido (ej: usuario@dominio.com)' })
  email: string;

  @Matches(/^\+\d{7,15}$/, { message: 'El teléfono debe estar en formato E.164 (ej: +34912345678)' })
  telefono: string;

  @IsOptional()
  @IsString()
  estado?: string;
}

export class EditarClienteDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'El nombre es requerido' })
  nombre?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El email debe ser válido (ej: usuario@dominio.com)' })
  email?: string;

  @IsOptional()
  @Matches(/^\+\d{7,15}$/, { message: 'El teléfono debe estar en formato E.164 (ej: +34912345678)' })
  telefono?: string;

  @IsOptional()
  @IsString()
  estado?: string;
}
