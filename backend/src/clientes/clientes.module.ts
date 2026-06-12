import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './clientes.entity';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { HistorialModule } from '../historial/historial.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente]), HistorialModule],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule {}
