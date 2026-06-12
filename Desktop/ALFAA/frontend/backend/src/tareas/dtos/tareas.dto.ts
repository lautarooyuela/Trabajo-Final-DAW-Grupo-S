export class CrearTareaDto {
  descripcion: string;
  estado?: string;
  proyectoId: number;
}

export class EditarTareaDto {
  descripcion?: string;
  estado?: string;
}
