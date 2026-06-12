import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto, EditarUsuarioDto } from './dtos/usuarios.dto';

class LoginLegacyDto {
  @ApiProperty({ example: 'admin' })
  nombreUsuario!: string;
  @ApiProperty({ example: 'admin' })
  clave!: string;
}

@ApiTags('usuarios')
@ApiBearerAuth()
@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  crear(@Body() dto: CrearUsuarioDto) {
    return this.usuariosService.crear(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  buscarTodos() {
    return this.usuariosService.buscarTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar un usuario por ID' })
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.buscarPorId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar un usuario existente' })
  editar(@Param('id', ParseIntPipe) id: number, @Body() dto: EditarUsuarioDto) {
    return this.usuariosService.editar(id, dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login legacy (sin JWT)' })
  async login(@Body() body: LoginLegacyDto) {
    const usuario = await this.usuariosService.login(
      body.nombreUsuario,
      body.clave,
    );
    return usuario;
  }
}
