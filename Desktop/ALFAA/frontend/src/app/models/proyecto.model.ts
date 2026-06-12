import { Cliente } from './cliente.model';
import { Tarea } from './tarea.model';

export interface Proyecto {
  id: number;
  nombre: string;
  estado: string;
  cliente: Cliente | null;
  tareas?: Tarea[];
}
