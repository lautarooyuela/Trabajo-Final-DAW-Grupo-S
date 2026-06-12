CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO usuarios ("nombreUsuario", "clave", "estado")
VALUES ('admin', 'admin', 'Activo')
ON CONFLICT ("nombreUsuario") 
DO UPDATE SET 
    clave = EXCLUDED.clave, 
    estado = EXCLUDED.estado;