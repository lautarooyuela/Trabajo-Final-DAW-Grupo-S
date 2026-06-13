import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  Headers,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto, EditarUsuarioDto } from './dtos/usuarios.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

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
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  crear(
    @Body() dto: CrearUsuarioDto,
    @Req() req: { usuario: { nombre: string; sub: number } },
  ) {
    return this.usuariosService.crear(dto, req.usuario.nombre, req.usuario.sub);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  buscarTodos() {
    return this.usuariosService.buscarTodos();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Buscar un usuario por ID' })
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.buscarPorId(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Editar un usuario existente' })
  editar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditarUsuarioDto,
    @Req() req: { usuario: { nombre: string; sub: number } },
  ) {
    return this.usuariosService.editar(
      id,
      dto,
      req.usuario.nombre,
      req.usuario.sub,
    );
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
