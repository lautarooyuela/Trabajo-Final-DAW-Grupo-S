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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProyectosService } from './proyectos.service';
import { CrearProyectoDto, EditarProyectoDto } from './dtos/proyectos.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('proyectos')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('proyectos')
export class ProyectosController {
  constructor(private proyectosService: ProyectosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo proyecto' })
  crear(
    @Body() dto: CrearProyectoDto,
    @Req() req: { usuario: { nombre: string; sub: number } },
  ) {
    return this.proyectosService.crear(
      dto,
      req.usuario.nombre,
      req.usuario.sub,
    );
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
    @Req() req: { usuario: { nombre: string; sub: number } },
  ) {
    return this.proyectosService.editar(
      id,
      dto,
      req.usuario.nombre,
      req.usuario.sub,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Dar de baja lógica a un proyecto' })
  darDeBaja(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { usuario: { nombre: string; sub: number } },
  ) {
    return this.proyectosService.darDeBaja(
      id,
      req.usuario.nombre,
      req.usuario.sub,
    );
  }
}
