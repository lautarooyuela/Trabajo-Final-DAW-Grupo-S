import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum EstadoUsuario {
  ACTIVO = 'ACTIVO',
  BAJA = 'BAJA',
}

export enum RolUsuario {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  LECTOR = 'LECTOR',
}

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, nullable: false })
  nombreUsuario!: string;

  @Column({ nullable: false })
  clave!: string;

  @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.LECTOR,
  })
  rol!: RolUsuario;

  @Column({
    type: 'enum',
    enum: EstadoUsuario,
    default: EstadoUsuario.ACTIVO,
  })
  estado!: EstadoUsuario;
}
