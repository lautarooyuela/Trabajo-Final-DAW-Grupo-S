import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TareasService } from './tareas.service';
import { CrearTareaDto, EditarTareaDto } from './dtos/tareas.dto';

@Controller('tareas')
export class TareasController {
  constructor(private tareasService: TareasService) {}

  @Post()
  crear(@Body() dto: CrearTareaDto) {
    return this.tareasService.crear(dto);
  }

  @Get('proyecto/:proyectoId')
  buscarPorProyecto(@Param('proyectoId', ParseIntPipe) proyectoId: number) {
    return this.tareasService.buscarPorProyecto(proyectoId);
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.tareasService.buscarPorId(id);
  }

  @Patch(':id')
  editar(@Param('id', ParseIntPipe) id: number, @Body() dto: EditarTareaDto) {
    return this.tareasService.editar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.tareasService.darDeBaja(id);
  }
}
