import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Proyecto } from '../proyectos/proyectos.entity';

@Entity({ name: 'clientes' })
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nombre: string;

  @Column({ nullable: false, default: 'Activo' })
  estado: string;

  @OneToMany(() => Proyecto, (proyecto) => proyecto.cliente)
  proyectos: Proyecto[];
}
