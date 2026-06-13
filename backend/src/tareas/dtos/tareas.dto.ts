import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearTareaDto {
  @ApiProperty({
    description: 'Descripción de la tarea',
    example: 'Diseñar base de datos',
  })
  descripcion: string;

  @ApiPropertyOptional({
    description: 'Estado de la tarea',
    example: 'PENDIENTE',
  })
  estado?: string;

  @ApiProperty({ description: 'ID del proyecto asociado', example: 1 })
  proyectoId: number;
}

export class EditarTareaDto {
  @ApiPropertyOptional({
    description: 'Descripción de la tarea',
    example: 'Diseñar base de datos',
  })
  descripcion?: string;

  @ApiPropertyOptional({
    description: 'Estado de la tarea',
    example: 'COMPLETADA',
  })
  estado?: string;
}
