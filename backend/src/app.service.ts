import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, EstadoUsuario } from './usuarios/usuarios.entity';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  async onModuleInit() {
    const existe = await this.usuarioRepo.findOne({
      where: { nombreUsuario: 'admin' },
    });
    if (!existe) {
      const admin = this.usuarioRepo.create({
        nombreUsuario: 'admin',
        clave: 'admin',
        estado: EstadoUsuario.ACTIVO,
      });
      await this.usuarioRepo.save(admin);
      console.log('Usuario admin creado: admin / admin');
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
