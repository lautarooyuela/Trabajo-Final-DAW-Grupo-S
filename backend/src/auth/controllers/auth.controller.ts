import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from '../dtos/input/login.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('')
  @ApiOperation({ summary: 'Iniciar sesión y obtener token JWT' })
  async login(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
    return await this.authService.login(dto);
  }
}
