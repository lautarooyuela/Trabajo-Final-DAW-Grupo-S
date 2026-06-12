import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from './proyectos.entity';
import { Cliente } from '../clientes/clientes.entity';
import { ProyectosController } from './proyectos.controller';
import { ProyectosService } from './proyectos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto, Cliente])],
  controllers: [ProyectosController],
  providers: [ProyectosService],
})
export class ProyectosModule {}
