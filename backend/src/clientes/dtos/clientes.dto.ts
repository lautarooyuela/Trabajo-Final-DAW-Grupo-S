import {
  IsString,
  IsEmail,
  Matches,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearClienteDto {
  @ApiProperty({ description: 'Nombre del cliente', example: 'Juan Pérez' })
  @IsString()
  @MinLength(1, { message: 'El nombre es requerido' })
  nombre: string;

  @ApiProperty({
    description: 'Email del cliente',
    example: 'juan@example.com',
  })
  @IsEmail(
    {},
    { message: 'El email debe ser válido (ej: usuario@dominio.com)' },
  )
  email: string;

  @ApiProperty({
    description: 'Teléfono del cliente en formato E.164',
    example: '+34912345678',
  })
  @Matches(/^\+\d{7,15}$/, {
    message: 'El teléfono debe estar en formato E.164 (ej: +34912345678)',
  })
  telefono: string;

  @ApiPropertyOptional({ description: 'Estado del cliente', example: 'ACTIVO' })
  @IsOptional()
  @IsString()
  estado?: string;
}

export class EditarClienteDto {
  @ApiPropertyOptional({
    description: 'Nombre del cliente',
    example: 'Juan Pérez',
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'El nombre es requerido' })
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Email del cliente',
    example: 'juan@example.com',
  })
  @IsOptional()
  @IsEmail(
    {},
    { message: 'El email debe ser válido (ej: usuario@dominio.com)' },
  )
  email?: string;

  @ApiPropertyOptional({
    description: 'Teléfono del cliente en formato E.164',
    example: '+34912345678',
  })
  @IsOptional()
  @Matches(/^\+\d{7,15}$/, {
    message: 'El teléfono debe estar en formato E.164 (ej: +34912345678)',
  })
  telefono?: string;

  @ApiPropertyOptional({ description: 'Estado del cliente', example: 'ACTIVO' })
  @IsOptional()
  @IsString()
  estado?: string;
}
