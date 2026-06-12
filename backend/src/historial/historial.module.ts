import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Historial } from './historial.entity';
import { HistorialService } from './historial.service';
import { HistorialController } from './historial.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Historial])],
  providers: [HistorialService],
  controllers: [HistorialController],
  exports: [HistorialService],
})
export class HistorialModule {}