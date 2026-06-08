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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProyectosService } from './proyectos.service';
import { CrearProyectoDto, EditarProyectoDto } from './dtos/proyectos.dto';

@ApiTags('proyectos')
@ApiBearerAuth()
@Controller('proyectos')
export class ProyectosController {
  constructor(private proyectosService: ProyectosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proyecto' })
  crear(@Body() dto: CrearProyectoDto) {
    return this.proyectosService.crear(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los proyectos' })
  buscarTodos() {
    return this.proyectosService.buscarTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar un proyecto por ID' })
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.proyectosService.buscarPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar un proyecto existente' })
  editar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditarProyectoDto,
  ) {
    return this.proyectosService.editar(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Dar de baja lógica a un proyecto' })
  darDeBaja(@Param('id', ParseIntPipe) id: number) {
    return this.proyectosService.darDeBaja(id);
  }
}
