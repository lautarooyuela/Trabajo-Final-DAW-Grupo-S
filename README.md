# Trabajo Final Integrador - Desarrollo de Aplicaciones Web

Sistema de gestión de proyectos desarrollado con NestJS (backend), Angular (frontend) y PostgreSQL.

## Integrantes
- Emiliano Benitez
- Anabella Broese
- Julio Humere
- Lautaro Oyuela
- Tamara Savoiardo


## Funcionalidades Implementadas
- **Gestión de Proyectos:** CRUD completo, estados dinámicos y asignación de clientes.
- **Gestión de Clientes:** CRUD completo con estados y baja lógica.
- **Exportación de Datos:** Funcionalidad de exportación a **CSV** integrada en los listados de Proyectos y Clientes.
- **Seguridad:** Implementación de autenticación y rutas protegidas (Guards).

## Requisitos previos

- Node.js (v18 o superior)
- npm
- NestJS CLI: `npm i -g @nestjs/cli`
- Angular CLI: `npm i -g @angular/cli`



> Si querés usar **PostgreSQL**, editá `backend/src/app.module.ts` y reemplazá l## Configuración de la base de datos

El backend está configurado por defecto con **SQLite** (`backend/tpfinal.sqlite`) para que funcione inmediatamente sin necesidad de instalar ni configurar PostgreSQL localmente.a configuración de TypeORM por:
>
> ```ts
> TypeOrmModule.forRoot({
>   type: 'postgres',
>   host: 'localhost',
>   port: 5432,
>   username: 'postgres',
>   password: 'postgres',
>   database: 'tpfinal',
>   entities: [__dirname + '/**/*.entity{.ts,.js}'],
>   synchronize: true,
> }),
> ```
>
> Luego ejecutá `npm install pg` en la carpeta `backend/` (y desinstalá `better-sqlite3` si no lo necesitás).

## Levantar el proyecto

### 1. Backend

```bash
cd backend
npm install
npm run start:dev
```

El backend se levantará en `http://localhost:3000`.

La primera vez que se ejecute, creará la base de datos SQLite y precargará un usuario de prueba:
- **Usuario**: `admin`
- **Contraseña**: `admin`

### 2. Frontend

En otra terminal:

```bash
cd frontend
npm install
ng serve
```

El frontend se levantará en `http://localhost:4200`.

### 3. Acceder a la aplicación

Abrir el navegador en `http://localhost:4200`.

Ingresá con:
- **Usuario**: `admin`
- **Contraseña**: `admin`

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
