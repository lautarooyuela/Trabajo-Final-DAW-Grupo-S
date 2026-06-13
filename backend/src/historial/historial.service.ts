import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historial } from './historial.entity';

@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(Historial)
    private historialRepo: Repository<Historial>,
  ) {}

  async registrar(
    entidad: string,
    entidadId: number,
    usuarioNombre: string,
    usuarioId: number,
    accion: string,
    detalle?: string,
  ) {
    const registro = this.historialRepo.create({
      entidad,
      entidadId,
      usuarioNombre,
      usuarioId,
      accion,
      detalle: detalle || '',
    });
    return this.historialRepo.save(registro);
  }

  async buscarPorEntidad(entidad: string, entidadId: number) {
    return this.historialRepo.find({
      where: { entidad, entidadId },
      order: { fecha: 'DESC' },
    });
  }

  async buscarPorEntidadGeneral(entidad: string) {
    return this.historialRepo.find({
      where: { entidad },
      order: { fecha: 'DESC' },
    });
  }

  async buscarPorUsuario(usuarioId: number) {
    return this.historialRepo.find({
      where: { usuarioId },
      order: { fecha: 'DESC' },
    });
  }
}
