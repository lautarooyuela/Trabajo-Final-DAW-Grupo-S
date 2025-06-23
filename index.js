console.log("VERSION FINAL DEL SCRIPT CARGADA - 23/06");
import { obtenerSalones } from './altasalon.js';
import { obtenerServicios } from './servicios.js';

const catalogoSalones = document.getElementById('catalogo-salones');
const catalogoServicios = document.getElementById('catalogo-servicios');
const resumenPresupuesto = document.getElementById('resumen-presupuesto');
const valorTotalEl = document.getElementById('valor-total');
const contadorCarrito = document.getElementById('carrito-contador');
const btnConfirmar = document.getElementById('btn-confirmar');
const btnFinalizarSolicitud = document.getElementById('btn-finalizar-solicitud');
const modalEl = document.getElementById('modalConfirmar');
const modalConfirmar = new bootstrap.Modal(modalEl);

const currencyFormatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

let presupuesto = {
    salon: null,
    servicios: []
};

function renderizarSalones() {
    const salones = obtenerSalones();
    catalogoSalones.innerHTML = '';
    salones.forEach(salon => {
        if (salon.estado !== 'Disponible') return;
        const col = document.createElement('div');
        col.classList.add('col');
        col.innerHTML = `
            <div class="card h-100">
                <img src="${salon.imagen}" class="card-img-top" alt="${salon.nombre}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${salon.nombre}</h5>
                    <p class="card-text">${salon.descripcion}</p>
                    <p class="card-text fw-bold fs-5 text-primary">${currencyFormatter.format(salon.valor)}</p>
                    <div class="mt-auto text-center">
                        <button class="btn btn-primary w-100" onclick="seleccionarSalon(${salon.id})">Agregar al carrito</button>
                        <a href="#catalogo-servicios" class="btn btn-link w-100 mt-2">Ver servicios adicionales</a>
                    </div>
                </div>
            </div>
        `;
        catalogoSalones.appendChild(col);
    });
}

function renderizarServicios() {
    const servicios = obtenerServicios();
    catalogoServicios.innerHTML = '';
    servicios.forEach(servicio => {
        const col = document.createElement('div');
        col.classList.add('col');
        col.innerHTML = `
            <div class="card h-100">
                <div class="card-body d-flex flex-column text-center">
                    <h5 class="card-title">${servicio.nombre}</h5>
                    <p class="card-text text-primary fw-bold fs-5 my-3">${currencyFormatter.format(servicio.valor)}</p>
                    <div class="mt-auto">
                         <button class="btn btn-outline-success w-100" id="btn-servicio-${servicio.id}" onclick="toggleServicio(${servicio.id})">Agregar</button>
                    </div>
                </div>
            </div>
        `;
        catalogoServicios.appendChild(col);
    });
}

function renderizarPresupuesto() {
    resumenPresupuesto.innerHTML = '';
    let total = 0;

    if (!presupuesto.salon && presupuesto.servicios.length === 0) {
        resumenPresupuesto.innerHTML = '<p class="text-muted text-center mt-3">Aún no has seleccionado nada.</p>';
        valorTotalEl.innerText = currencyFormatter.format(0);
        contadorCarrito.innerText = '0';
        contadorCarrito.style.display = 'none';
        btnConfirmar.disabled = true;
        return;
    }

    btnConfirmar.disabled = false;

    if (presupuesto.salon) {
        total += presupuesto.salon.valor;
        resumenPresupuesto.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div><strong class="d-block">Salón:</strong><span>${presupuesto.salon.nombre}</span></div>
                <strong>${currencyFormatter.format(presupuesto.salon.valor)}</strong>
            </div>`;
    }

    if (presupuesto.servicios.length > 0) {
        const serviciosHtml = presupuesto.servicios.map(s => {
            total += s.valor;
            return `<div class="d-flex justify-content-between"><span>${s.nombre}</span><span>${currencyFormatter.format(s.valor)}</span></div>`;
        }).join('');
        resumenPresupuesto.innerHTML += `<hr><p class="mb-1"><strong>Servicios Adicionales:</strong></p>${serviciosHtml}`;
    }

    valorTotalEl.innerText = currencyFormatter.format(total);
    const totalItems = (presupuesto.salon ? 1 : 0) + presupuesto.servicios.length;
    contadorCarrito.innerText = totalItems.toString();
    contadorCarrito.style.display = 'block';
}

window.seleccionarSalon = (id) => {
    const salonSeleccionado = obtenerSalones().find(s => s.id === id);
    if (presupuesto.salon && presupuesto.salon.id === id) {
        presupuesto.salon = null;
    } else {
        presupuesto.salon = salonSeleccionado;
    }
    renderizarPresupuesto();
    actualizarBotonesSalones();
};

window.toggleServicio = (id) => {
    const servicio = obtenerServicios().find(s => s.id === id);
    const index = presupuesto.servicios.findIndex(s => s.id === id);
    const boton = document.getElementById(`btn-servicio-${id}`);

    if (index === -1) {
        presupuesto.servicios.push(servicio);
        boton.textContent = 'Quitar';
        boton.classList.replace('btn-outline-success', 'btn-danger');
    } else {
        presupuesto.servicios.splice(index, 1);
        boton.textContent = 'Agregar';
        boton.classList.replace('btn-danger', 'btn-outline-success');
    }
    renderizarPresupuesto();
};

function actualizarBotonesSalones() {
    document.querySelectorAll('#catalogo-salones .btn-primary, #catalogo-salones .btn-warning').forEach(boton => {
        boton.textContent = 'Agregar al carrito';
        boton.classList.replace('btn-warning', 'btn-primary');
    });

    if (presupuesto.salon) {
        const botonSeleccionado = document.querySelector(`[onclick="seleccionarSalon(${presupuesto.salon.id})"]`);
        if (botonSeleccionado) {
            botonSeleccionado.textContent = 'Quitar del carrito';
            botonSeleccionado.classList.replace('btn-primary', 'btn-warning');
        }
    }
}

btnFinalizarSolicitud.addEventListener('click', () => {
    const nombreCompleto = document.getElementById('nombreCompleto').value;
    const fechaEvento = document.getElementById('fechaEvento').value;

    if (!nombreCompleto || !fechaEvento) {
        alert('Por favor, completa todos los datos del formulario.');
        return;
    }

    const total = (presupuesto.salon ? presupuesto.salon.valor : 0) + presupuesto.servicios.reduce((sum, s) => sum + s.valor, 0);

    modalConfirmar.hide();

    alert(`¡Gracias, ${nombreCompleto}!\n\nHemos recibido tu solicitud de presupuesto por un total de ${currencyFormatter.format(total)} para la fecha ${fechaEvento}.\n\nNos pondremos en contacto a la brevedad.`);
    
    presupuesto = { salon: null, servicios: [] };
    renderizarPresupuesto();
    actualizarBotonesSalones();
    document.querySelectorAll('#catalogo-servicios .btn-danger').forEach(boton => {
        boton.textContent = 'Agregar';
        boton.classList.replace('btn-danger', 'btn-outline-success');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    renderizarSalones();
    renderizarServicios();
    renderizarPresupuesto();
});