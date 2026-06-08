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
import { ClientesService } from './clientes.service';
import { CrearClienteDto, EditarClienteDto } from './dtos/clientes.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private clientesService: ClientesService) {}

  @Post()
  crear(@Body() dto: CrearClienteDto) {
    return this.clientesService.crear(dto);
  }

  @Get()
  buscarTodos() {
    return this.clientesService.buscarTodos();
  }

  @Get('activos')
  buscarActivos() {
    return this.clientesService.buscarActivos();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.buscarPorId(id);
  }

  @Patch(':id')
  editar(@Param('id', ParseIntPipe) id: number, @Body() dto: EditarClienteDto) {
    return this.clientesService.editar(id, dto);
  }

  @Delete(':id')
  darDeBaja(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.darDeBaja(id);
  }
}
