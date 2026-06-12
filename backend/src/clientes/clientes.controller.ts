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
import { ClientesService } from './clientes.service';
import { CrearClienteDto, EditarClienteDto } from './dtos/clientes.dto';

@ApiTags('clientes')
@ApiBearerAuth()
@Controller('clientes')
export class ClientesController {
  constructor(private clientesService: ClientesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  crear(@Body() dto: CrearClienteDto, @Headers('x-usuario') usuarioNombre: string) {
    return this.clientesService.crear(dto, usuarioNombre);
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
  editar(@Param('id', ParseIntPipe) id: number, @Body() dto: EditarClienteDto, @Headers('x-usuario') usuarioNombre: string) {
    return this.clientesService.editar(id, dto, usuarioNombre);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Dar de baja lógica a un cliente' })
  darDeBaja(@Param('id', ParseIntPipe) id: number, @Headers('x-usuario') usuarioNombre: string) {
    return this.clientesService.darDeBaja(id, usuarioNombre);
  }
}