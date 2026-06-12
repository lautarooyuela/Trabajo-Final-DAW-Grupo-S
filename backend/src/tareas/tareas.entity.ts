import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Proyecto } from '../proyectos/proyectos.entity';

export enum EstadoTarea {
  PENDIENTE = 'PENDIENTE',
  FINALIZADA = 'FINALIZADA',
  BAJA = 'BAJA',
}

@Entity({ name: 'tareas' })
export class Tarea {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  descripcion!: string;

  @Column({
    type: 'enum',
    enum: EstadoTarea,
    default: EstadoTarea.PENDIENTE,
  })
  estado!: EstadoTarea;

  @Column({ name: 'id_proyecto' })
  idProyecto!: number;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.tareas)
  @JoinColumn({ name: 'id_proyecto' })
  proyecto!: Proyecto;
}
