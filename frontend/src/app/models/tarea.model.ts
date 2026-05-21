import { Proyecto } from './proyecto.model';

export interface Tarea {
  id: number;
  descripcion: string;
  estado: string;
  proyecto: Proyecto;
}
