export class CrearUsuarioDto {
  nombreUsuario: string;
  clave: string;
  estado?: string;
}

export class EditarUsuarioDto {
  nombreUsuario?: string;
  clave?: string;
  estado?: string;
}
