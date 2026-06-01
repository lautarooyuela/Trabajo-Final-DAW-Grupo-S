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
