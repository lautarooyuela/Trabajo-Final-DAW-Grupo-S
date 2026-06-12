# Sistema de Gestión de Proyectos - Backend

## Descripción

Backend desarrollado para el Trabajo Final Integrador de la asignatura Desarrollo de Aplicaciones Web 2026.

La aplicación proporciona una API REST para la gestión de proyectos, clientes, tareas y usuarios, permitiendo administrar la información necesaria para el funcionamiento del sistema.

## Tecnologías Utilizadas

* NestJS
* TypeScript
* TypeORM
* PostgreSQL
* PM2
* Nginx

## Funcionalidades

### Gestión de Usuarios

* Autenticación mediante usuario y contraseña.
* Validación del estado de los usuarios.
* Control de acceso al sistema.

### Gestión de Proyectos

* Alta de proyectos.
* Modificación de proyectos.
* Consulta de proyectos.
* Asociación de proyectos con clientes.
* Gestión de estados (Activo, Finalizado y Baja).

### Gestión de Clientes

* Alta de clientes.
* Modificación de clientes.
* Consulta de clientes.
* Gestión de estados (Activo y Baja).
* Validación de proyectos asociados antes de permitir la baja.

### Gestión de Tareas

* Alta de tareas.
* Modificación de tareas.
* Eliminación de tareas.
* Consulta de tareas por proyecto.
* Gestión de estados (Pendiente, Finalizado y Baja).

## Modelo de Datos

El sistema se encuentra organizado a partir de las siguientes entidades principales:

* Usuario
* Proyecto
* Cliente
* Tarea

Las relaciones entre entidades permiten asociar clientes a proyectos y tareas a proyectos específicos.

## Requisitos

* Node.js
* PostgreSQL
* NPM

## Instalación

1. Clonar el repositorio.
2. Instalar las dependencias del proyecto.
3. Configurar las variables de entorno.
4. Crear la base de datos PostgreSQL.
5. Ejecutar las migraciones correspondientes.
6. Iniciar la aplicación.

## Arquitectura

La aplicación se encuentra desarrollada siguiendo una arquitectura modular basada en NestJS, separando responsabilidades mediante módulos, controladores, servicios y entidades.

## Trabajo Final Integrador

Tecnicatura Universitaria en Desarrollo Web Desarrollo de Aplicaciones Web - 2026