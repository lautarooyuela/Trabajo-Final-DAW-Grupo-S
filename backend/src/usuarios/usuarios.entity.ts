import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  nombreUsuario: string;

  @Column({ nullable: false })
  clave: string;

  @Column({ nullable: false, default: 'Activo' })
  estado: string;
}
