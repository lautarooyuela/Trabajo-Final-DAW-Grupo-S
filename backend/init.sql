CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO usuarios ("nombreUsuario", "clave", "rol", "estado")
VALUES ('admin', 'admin', 'ADMIN', 'ACTIVO')
ON CONFLICT ("nombreUsuario") 
DO UPDATE SET 
    clave = EXCLUDED.clave, 
    rol = EXCLUDED.rol,
    estado = EXCLUDED.estado;