export interface Historial {
  id: number;
  entidad: string;
  entidadId: number;
  usuarioNombre: string;
  usuarioId?: number;
  accion: string;
  detalle: string;
  fecha: string;
}