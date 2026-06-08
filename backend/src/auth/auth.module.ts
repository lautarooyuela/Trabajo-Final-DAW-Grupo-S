import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsuariosModule } from "../usuarios/usuarios.module";
import { AuthService } from "./services/auth.service";
import { AuthGuard } from "./guards/auth.guard";

@Module({
    controllers: [AuthController],
    providers: [AuthService, AuthGuard],
    imports: [
        UsuariosModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            global: true,
            useFactory: (configService: ConfigService) => {
                return {
                    secret: configService.get<string>('JWT_SECRET'),
                    signOptions: { expiresIn: '8h' },
                }
            },
        })
    ],
    exports: [AuthGuard, AuthService]
})
export class AuthModule {}
