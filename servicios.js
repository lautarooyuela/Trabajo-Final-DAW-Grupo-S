export const serviciosIniciales = [
  { id: 101, nombre: "Show de Magia", valor: 40000 },
  { id: 102, nombre: "Catering Infantil (20 niños)", valor: 55000 },
  { id: 103, nombre: "Maquillaje Artístico", valor: 45000 },
  { id: 104, nombre: "Show de Títeres", valor: 45000 },
  { id: 105, nombre: "Alquiler de Inflable", valor: 55000 }
];

export function obtenerServicios() {
    if (!localStorage.getItem("servicios")) {
        localStorage.setItem("servicios", JSON.stringify(serviciosIniciales));
    }
    return JSON.parse(localStorage.getItem("servicios")) || [];
}

export function guardarServicios(servicios) {
    localStorage.setItem("servicios", JSON.stringify(servicios));
}