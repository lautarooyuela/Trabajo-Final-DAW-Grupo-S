import { Proyecto } from './proyecto.model';

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  estado: string;
  proyectos?: Proyecto[];
}
