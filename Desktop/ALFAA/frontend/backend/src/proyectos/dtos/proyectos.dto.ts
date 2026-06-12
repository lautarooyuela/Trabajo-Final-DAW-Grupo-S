export class CrearProyectoDto {
  nombre: string;
  estado?: string;
  clienteId?: number | null;
}

export class EditarProyectoDto {
  nombre?: string;
  estado?: string;
  clienteId?: number | null;
}
