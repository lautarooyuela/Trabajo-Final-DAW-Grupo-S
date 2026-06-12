import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "../dtos/input/login.dto";
import { UsuariosService } from "../../usuarios/usuarios.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly usuariosService: UsuariosService,
        private jwtService: JwtService
    ) {}

    async login(dto: LoginDto): Promise<{ accessToken: string }> {
        const usuario = await this.usuariosService.buscarUsuarioActivoPorNombre(dto.nombre);

        if (!usuario) {
            throw new UnauthorizedException("Usuario no encontrado");
        }

        // Comparación de contraseña con bcrypt
        const esValida = await bcrypt.compare(dto.clave, usuario.clave);
        if (!esValida) {
            throw new UnauthorizedException("Credenciales inválidas");
        }

        const payload = { nombre: usuario.nombreUsuario, sub: usuario.id, rol: usuario.rol };

        return {
            accessToken: this.jwtService.sign(payload)
        };
    }
}
