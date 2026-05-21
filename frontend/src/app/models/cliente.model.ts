import { Proyecto } from './proyecto.model';

export interface Cliente {
  id: number;
  nombre: string;
  estado: string;
  proyectos?: Proyecto[];
}
