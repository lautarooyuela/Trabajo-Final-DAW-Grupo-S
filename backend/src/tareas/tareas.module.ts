import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tarea } from './tareas.entity';
import { Proyecto } from '../proyectos/proyectos.entity';
import { TareasController } from './tareas.controller';
import { TareasService } from './tareas.service';
import { HistorialModule } from '../historial/historial.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tarea, Proyecto]), HistorialModule],
  controllers: [TareasController],
  providers: [TareasService],
})
export class TareasModule {}
