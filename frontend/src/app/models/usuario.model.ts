export type RolUsuario = 'ADMIN' | 'EDITOR' | 'LECTOR';

export interface Usuario {
  id: number;
  nombreUsuario: string;
  clave?: string;
  rol: RolUsuario;
  estado: string;
}
