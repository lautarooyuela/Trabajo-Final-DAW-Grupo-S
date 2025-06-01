// accionessalon.js

export function obtenerSalones() {
    return JSON.parse(localStorage.getItem("salones")) || [];
}

export function guardarSalones(salones) {
    localStorage.setItem("salones", JSON.stringify(salones));
}

export function agregarSalon(salon) {
    const salones = obtenerSalones();
    salon.id = Date.now();
    salones.push(salon);
    guardarSalones(salones);
}

export function eliminarSalon(id) {
    let salones = obtenerSalones();
    salones = salones.filter(s => s.id !== id);
    guardarSalones(salones);
    window.location.reload(); 
}

export function editarSalon(id) {
    window.location.href = 'editar_salon.html?id=' + id;
}

export function renderizarSalones() {
    const tabla = document.getElementById("tablaSalones");
    if (tabla) {
        const body = tabla.querySelector("tbody");
        const salones = obtenerSalones();

        body.innerHTML = "";

        salones.forEach(salon => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td><img src="${salon.imagen}" width="100"></td>
                <td>${salon.nombre}</td>
                <td><a href="${salon.mapa}" target="_blank">${salon.direccion}</a></td>
                <td>${salon.descripcion}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarSalon(${salon.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarSalon(${salon.id})">Eliminar</button>
                </td>
            `;
            body.appendChild(fila);
        });
    }
}

window.eliminarSalon = eliminarSalon;
window.editarSalon = editarSalon;


import { inicializarLocalStorage } from './altasalon.js';
inicializarLocalStorage();

