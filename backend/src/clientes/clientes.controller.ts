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
import { ClientesService } from './clientes.service';
import { CrearClienteDto, EditarClienteDto } from './dtos/clientes.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('clientes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private clientesService: ClientesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  crear(
    @Body() dto: CrearClienteDto,
    @Req() req: { usuario: { nombre: string; sub: number } },
  ) {
    return this.clientesService.crear(dto, req.usuario.nombre, req.usuario.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los clientes' })
  buscarTodos() {
    return this.clientesService.buscarTodos();
  }

  @Get('activos')
  @ApiOperation({ summary: 'Obtener clientes con estado activo' })
  buscarActivos() {
    return this.clientesService.buscarActivos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar un cliente por ID' })
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.buscarPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar un cliente existente' })
  editar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditarClienteDto,
    @Req() req: { usuario: { nombre: string; sub: number } },
  ) {
    return this.clientesService.editar(
      id,
      dto,
      req.usuario.nombre,
      req.usuario.sub,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Dar de baja lógica a un cliente' })
  darDeBaja(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { usuario: { nombre: string; sub: number } },
  ) {
    return this.clientesService.darDeBaja(
      id,
      req.usuario.nombre,
      req.usuario.sub,
    );
  }
}
