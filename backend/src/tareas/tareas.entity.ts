import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Proyecto } from '../proyectos/proyectos.entity';

@Entity({ name: 'tareas' })
export class Tarea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  descripcion: string;

  @Column({ nullable: false, default: 'Pendiente' })
  estado: string;

  @ManyToOne(() => Proyecto, (proyecto) => proyecto.tareas)
  @JoinColumn()
  proyecto: Proyecto;
}
