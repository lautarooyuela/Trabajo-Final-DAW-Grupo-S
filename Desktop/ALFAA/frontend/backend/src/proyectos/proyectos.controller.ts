import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ProyectosService } from './proyectos.service';
import { CrearProyectoDto, EditarProyectoDto } from './dtos/proyectos.dto';

@Controller('proyectos')
export class ProyectosController {
  constructor(private proyectosService: ProyectosService) {}

  @Post()
  crear(@Body() dto: CrearProyectoDto) {
    return this.proyectosService.crear(dto);
  }

  @Get()
  buscarTodos() {
    return this.proyectosService.buscarTodos();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.proyectosService.buscarPorId(id);
  }

  @Patch(':id')
  editar(@Param('id', ParseIntPipe) id: number, @Body() dto: EditarProyectoDto) {
    return this.proyectosService.editar(id, dto);
  }

  @Delete(':id')
  darDeBaja(@Param('id', ParseIntPipe) id: number) {
    return this.proyectosService.darDeBaja(id);
  }
}
