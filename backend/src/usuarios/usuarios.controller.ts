import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto, EditarUsuarioDto } from './dtos/usuarios.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Post()
  crear(@Body() dto: CrearUsuarioDto) {
    return this.usuariosService.crear(dto);
  }

  @Get()
  buscarTodos() {
    return this.usuariosService.buscarTodos();
  }

  @Get(':id')
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.buscarPorId(id);
  }

  @Patch(':id')
  editar(@Param('id', ParseIntPipe) id: number, @Body() dto: EditarUsuarioDto) {
    return this.usuariosService.editar(id, dto);
  }

  @Post('login')
  async login(@Body() body: { nombreUsuario: string; clave: string }) {
    const usuario = await this.usuariosService.login(
      body.nombreUsuario,
      body.clave,
    );
    return usuario;
  }
}
