import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'historial' })
export class Historial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  entidad: string;

  @Column({ nullable: false })
  entidadId: number;

  @Column({ nullable: false })
  usuarioNombre: string;

  @Column({ nullable: false })
  accion: string;

  @Column({ nullable: true, default: '' })
  detalle: string;

  @CreateDateColumn()
  fecha: Date;
}