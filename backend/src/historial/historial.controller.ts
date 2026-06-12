import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { HistorialService } from './historial.service';

@Controller('historial')
export class HistorialController {
  constructor(private historialService: HistorialService) {}

  @Get(':entidad/:entidadId')
  buscarPorEntidad(
    @Param('entidad') entidad: string,
    @Param('entidadId', ParseIntPipe) entidadId: number,
  ) {
    return this.historialService.buscarPorEntidad(entidad, entidadId);
  }

  @Get(':entidad')
  buscarPorEntidadGeneral(@Param('entidad') entidad: string) {
    return this.historialService.buscarPorEntidadGeneral(entidad);
  }
}