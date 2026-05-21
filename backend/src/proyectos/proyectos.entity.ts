import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Cliente } from '../clientes/clientes.entity';
import { Tarea } from '../tareas/tareas.entity';

@Entity({ name: 'proyectos' })
export class Proyecto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nombre: string;

  @Column({ nullable: false, default: 'Activo' })
  estado: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.proyectos, { nullable: true })
  @JoinColumn()
  cliente: Cliente | null;

  @OneToMany(() => Tarea, (tarea) => tarea.proyecto)
  tareas: Tarea[];
}
