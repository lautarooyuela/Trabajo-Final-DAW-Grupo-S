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
import { TareasService } from './tareas.service';
import { CrearTareaDto, EditarTareaDto } from './dtos/tareas.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('tareas')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('tareas')
export class TareasController {
  constructor(private tareasService: TareasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  crear(
    @Body() dto: CrearTareaDto,
    @Req() req: { usuario: { nombre: string; sub: number } },
  ) {
    return this.tareasService.crear(dto, req.usuario.nombre, req.usuario.sub);
  }

  @Get('proyecto/:proyectoId')
  @ApiOperation({ summary: 'Obtener tareas de un proyecto específico' })
  buscarPorProyecto(@Param('proyectoId', ParseIntPipe) proyectoId: number) {
    return this.tareasService.buscarPorProyecto(proyectoId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar una tarea por ID' })
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.tareasService.buscarPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar una tarea existente' })
  editar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditarTareaDto,
    @Req() req: { usuario: { nombre: string; sub: number } },
  ) {
    return this.tareasService.editar(
      id,
      dto,
      req.usuario.nombre,
      req.usuario.sub,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Dar de baja lógica a una tarea' })
  darDeBaja(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { usuario: { nombre: string; sub: number } },
  ) {
    return this.tareasService.darDeBaja(
      id,
      req.usuario.nombre,
      req.usuario.sub,
    );
  }
}
