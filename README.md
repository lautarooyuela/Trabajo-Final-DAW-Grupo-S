# Trabajo Final Integrador - Desarrollo de Aplicaciones Web

Sistema de gestión de proyectos desarrollado con NestJS (backend), Angular (frontend) y PostgreSQL.

## Integrantes
- Emiliano Benitez
- Anabella Broese
- Julio Humere
- Lautaro Oyuela
- Tamara Savoiardo

## Funcionalidades Implementadas
- Gestión de Proyectos: CRUD completo, estados dinámicos y asignación de clientes.

- Gestión de Clientes: CRUD completo con estados y baja lógica.

- Exportación de Datos: Funcionalidad de exportación a CSV (Tamara Savoiardo).

- Seguridad: Autenticación y rutas protegidas (Guards).

## Stack Tecnológico y Arquitectura
- **Frontend:** Angular.
- **Backend:** NestJS con TypeScript.
- Base de Datos: PostgreSQL.
- Infraestructura y Despliegue:
- PM2 (ecosystem.config.js): Gestión, monitoreo y persistencia de procesos del servidor.
- Nginx (nginx.conf): Configuración de proxy inverso para el manejo eficiente del tráfico y seguridad.

## Requisitos previos
- Node.js (v18 o superior)
- npm
- PostgreSQL instalado y corriendo.
 - Angular CLI y NestJS CLI.

### 1. Configuración de Base de Datos
1. Crea una base de datos vacía llamada `tpfinal` en tu instancia de PostgreSQL.
2. Verifica que las credenciales en `backend/src/app.module.ts` coincidan con tu configuración local de Postgres.

### 2. Inicialización de datos
En el **Query Tool** de pgAdmin, ejecuta los archivos en este orden:
1. `backend/init.sql` (para crear las tablas).
2. `scripts/datos_prueba_proyectos.sql` (para cargar tus datos de prueba).

## Levantar el proyecto

### 1. Backend
```bash
cd backend
npm install
npm run start:dev
```

El backend se levantará en `http://localhost:3000`.

Asegúrate de haber ejecutado los scripts de la sección 2. Inicialización de datos...
- **Usuario**: `admin`
- **Contraseña**: `admin`

### 2. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm start
```

El frontend se levantará en `http://localhost:4200`.

### 3. Acceder a la aplicación

Abrir el navegador en http://localhost:4200 e ingresar con:

- Usuario: admin

- Contraseña: admin

### 4. Despliegue con Nginx

Para el entorno de producción se utiliza Nginx como servidor web y proxy inverso.

#### Requisitos

- Nginx instalado en `C:\nginx-1.28.3\` (descargar de https://nginx.org/en/download.html y extraer en esa ruta).
- PM2 instalado globalmente: `npm install -g pm2`.
- OpenSSL o similar para generar certificados SSL autofirmados (opcional, solo si se requiere HTTPS).

#### Backend

```bash
cd backend
npm run deploy
```

Este comando compila el proyecto (`npm run build`) e inicia el proceso con PM2 usando `ecosystem.config.js`. El backend corre en `http://localhost:3000`.

#### Frontend

```bash
cd frontend
npm run deploy
```

Este comando compila el frontend, limpia `C:\nginx-1.28.3\html\` y copia los archivos compilados a esa carpeta para que Nginx los sirva.

#### Configuración de Nginx

Crear el archivo `C:\nginx-1.28.3\conf\nginx.conf` con el siguiente contenido:

```nginx
events {
    worker_connections 1024;
}

http {
    include mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name localhost;

        # Frontend - archivos estáticos
        root C:/nginx-1.28.3/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        # Backend - proxy inverso
        location /api/ {
            proxy_pass http://localhost:3000/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

> **Nota:** Si el backend usa un prefijo global como `/api`, ajustar el `location` y `proxy_pass` según corresponda.

#### SSL (HTTPS) - Opcional

Si se desea habilitar HTTPS, crear los certificados y agregar un bloque `server` con SSL:

```nginx
server {
    listen 443 ssl;
    server_name localhost;

    ssl_certificate C:/nginx-1.28.3/ssl/server.crt;
    ssl_certificate_key C:/nginx-1.28.3/ssl/server.key;

    root C:/nginx-1.28.3/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Los archivos SSL deben colocarse en `C:\nginx-1.28.3\ssl\`:
- `server.crt` — Certificado SSL (público).
- `server.key` — Clave privada del certificado.

Para generar certificados autofirmados de prueba con OpenSSL:

```bash
mkdir C:\nginx-1.28.3\ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 ^
  -keyout C:\nginx-1.28.3\ssl\server.key ^
  -out C:\nginx-1.28.3\ssl\server.crt ^
  -subj "/C=AR/ST=BuenosAires/L=BuenosAires/O=TPFinal/CN=localhost"
```

En producción usar certificados de una CA real (Let's Encrypt, etc.).

## Estructura del proyecto

```
tpfinal-desa-web/
├── backend/         # API REST con NestJS
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── usuarios/
│   │   ├── clientes/
│   │   ├── proyectos/
│   │   └── tareas/
│   └── ...
├── frontend/        # Aplicación SPA con Angular (Standalone)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   ├── guards/
│   │   │   └── app.routes.ts
│   └── ...
├── README.md
└── RESTANTE.md
```
