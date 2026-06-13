import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearProyectoDto {
  @ApiProperty({
    description: 'Nombre del proyecto',
    example: 'Web Corporativa',
  })
  nombre: string;

  @ApiPropertyOptional({
    description: 'Estado del proyecto',
    example: 'PLANIFICACION',
  })
  estado?: string;

  @ApiPropertyOptional({ description: 'ID del cliente asociado', example: 1 })
  clienteId?: number | null;
}

export class EditarProyectoDto {
  @ApiPropertyOptional({
    description: 'Nombre del proyecto',
    example: 'Web Corporativa',
  })
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Estado del proyecto',
    example: 'EN_PROGRESO',
  })
  estado?: string;

  @ApiPropertyOptional({ description: 'ID del cliente asociado', example: 1 })
  clienteId?: number | null;
}
