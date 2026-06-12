import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Headers,
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
  crear(@Body() dto: CrearProyectoDto, @Headers('x-usuario') usuarioNombre: string) {
    return this.proyectosService.crear(dto, usuarioNombre);
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
  editar(@Param('id', ParseIntPipe) id: number, @Body() dto: EditarProyectoDto, @Headers('x-usuario') usuarioNombre: string) {
    return this.proyectosService.editar(id, dto, usuarioNombre);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Dar de baja lógica a un proyecto' })
  darDeBaja(@Param('id', ParseIntPipe) id: number, @Headers('x-usuario') usuarioNombre: string) {
    return this.proyectosService.darDeBaja(id, usuarioNombre);
  }
}