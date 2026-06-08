import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Proyecto } from '../proyectos/proyectos.entity';

export enum EstadoCliente {
  ACTIVO = 'ACTIVO',
  BAJA = 'BAJA',
}

@Entity({ name: 'clientes' })
export class Cliente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, nullable: false })
  nombre!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  telefono!: string;

  @Column({
    type: 'enum',
    enum: EstadoCliente,
    default: EstadoCliente.ACTIVO,
  })
  estado!: EstadoCliente;

  @OneToMany(() => Proyecto, (proyecto) => proyecto.cliente)
  proyectos!: Proyecto[];
}
