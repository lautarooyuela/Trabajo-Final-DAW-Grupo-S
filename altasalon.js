export const salonesIniciales = [
  { id: 1, nombre: "Alegría, fiestas infantiles", direccion: "Monroe 902 - CABA", mapa: "https://www.google.com/maps/search/?api=1&query=Monroe+902+CABA", descripcion: "Espacio colorido, seguro y alegre para celebrar cumpleaños y eventos infantiles.", imagen: "img/SALONalegria.jpg", valor: 145000, estado: "Disponible" },
  { id: 2, nombre: "Spa de princesas", direccion: "Av. Alvarez Thomas 1615 - CABA", mapa: "https://www.google.com/maps/search/?api=1&query=Av.AlvarezThomas+1615+CABA", descripcion: "Un mundo mágico de belleza y diversión para las pequeñas princesas.", imagen: "img/spa.jpg", valor: 155000, estado: "Disponible" },
  { id: 3, nombre: "Pijamadas de ensueño", direccion: "Av. Varela 1301 - CABA", mapa: "https://www.google.com/maps/search/?api=1&query=Av.Varela+1301+CABA", descripcion: "Decoración mágica con luces y carpas tipi para una experiencia inolvidable.", imagen: "img/pijamadas.jpeg", valor: 130000, estado: "Disponible" },
  { id: 4, nombre: "Festejos de gol", direccion: "Av.Tte.Gral Perón 4190 - CABA", mapa: "https://www.google.com/maps/search/?api=1&query=Av.TteGralJuanDomingoPeron+4190+CABA", descripcion: "Cancha techada con césped sintético para cumpleaños deportivos.", imagen: "img/canchafiestas.jpg", valor: 160000, estado: "Reservado" },
  { id: 5, nombre: "En un cuento, salón de fiestas", direccion: "Av. Pueyrredón 1640 - CABA", mapa: "https://www.google.com/maps/search/?api=1&query=Av.Pueyrredon+1640+CABA", descripcion: "Inflables temáticos, colores y diversión garantizada.", imagen: "img/inflables.jpg", valor: 152000, estado: "Disponible" },
  { id: 6, nombre: "Aventuras de la selva", direccion: "Av. Belgrano 2975 - CABA", mapa: "https://www.google.com/maps/search/?api=1&query=Av.Belgrano+2975+CABA", descripcion: "Ambientación selvática para que los niños se conviertan en exploradores.", imagen: "img/selva.png", valor: 148000, estado: "Disponible" },
  { id: 7, nombre: "Mundo jurásico", direccion: "Pi Margall 750 - CABA", mapa: "https://www.google.com/maps/search/?api=1&query=PiMargall+750+CABA", descripcion: "Viaje prehistórico con dinosaurios gigantes y escenarios mágicos.", imagen: "img/dinos.jpg", valor: 165000, estado: "Disponible" },
  { id: 8, nombre: "Adrenalina", direccion: "Av. Cerviño 3356 - CABA", mapa: "https://www.google.com/maps/search/?api=1&query=Av.Cerviño+3356+CABA", descripcion: "Espacio lleno de juegos y desafíos que despiertan la adrenalina y la diversión en cada niño a partir de los 6 años.", imagen: "img/Adrenalina.jpg", valor: 170000, estado: "Reservado" },
  { id: 9, nombre: "¡Festejá en la selva!", direccion: "Gral. Urquiza 609 - CABA", mapa: "https://www.google.com/maps/search/?api=1&query=Gral.Urquiza+609+CABA", descripcion: "¡Viví una experiencia salvajemente divertida! Sumergite en una aventura llena de colores, lianas y animales de la jungla.", imagen: "img/festejosSelva.jpg", valor: 158000, estado: "Disponible" },
  { 
    id: 10,
    nombre: "Sala de video juegos",
    direccion: "Av. Corrientes 3450 - CABA",
    mapa: "https://www.google.com/maps/search/?api=1&query=Monroe+902+CABA0",
    descripcion: "Consolas de última generación, simuladores de carrera y los mejores juegos arcade. ¡El paraíso para todo gamer!",
    imagen: "https://www.dondeir.com/wp-content/uploads/2017/12/arena-la-nueva-sala-videojuegos-en-cdmx-en-salas-cine-05.jpg",
    valor: 175000,
    estado: "Disponible"
  },
  { 
    id: 11,
    nombre: "Estudio Fotográfico Infantil",
    direccion: "Honduras 4802 - CABA",
    mapa: "https://www.google.com/maps/search/?api=1&query=Monroe+902+CABA1",
    descripcion: "Un set fotográfico profesional para capturar los mejores momentos de la fiesta. ¡Recuerdos para toda la vida!",
    imagen: "https://www.blogdelfotografo.com/wp-content/uploads/2020/11/nin%CC%83o-fotografo.jpg",
    valor: 140000,
    estado: "Disponible"
  }
];

export function obtenerSalones() {
    if (!localStorage.getItem("salones")) {
        localStorage.setItem("salones", JSON.stringify(salonesIniciales));
    }
    return JSON.parse(localStorage.getItem("salones")) || [];
}

export function guardarSalones(salones) {
    localStorage.setItem("salones", JSON.stringify(salones));
}