// altasalon.js

export const salonesIniciales = [
  {
    id: 1,
    nombre: "Alegría, fiestas infantiles",
    direccion: "Monroe 902 - CABA",
    mapa: "https://www.google.com/maps/search/?api=1&query=Monroe+902+CABA",
    descripcion: "Espacio colorido, seguro y alegre para celebrar cumpleaños y eventos infantiles.",
    imagen: "img/SALONalegria.jpg"
  },
  {
    id: 2,
    nombre: "Spa de princesas",
    direccion: "Av. Alvarez Thomas 1615 - CABA",
    mapa: "https://www.google.com/maps/search/?api=1&query=Av.AlvarezThomas+1615+CABA",
    descripcion: "Un mundo mágico de belleza y diversión para las pequeñas princesas.",
    imagen: "img/spa.jpg"
  },
  { 
    id:3,
    nombre:"Pijamadas de ensueño",
    direccion:"Av. Varela 1301 - CABA",
    mapa:"https://www.google.com/maps/search/?api=1&query=Av.Varela+1301+CABA",
    descripcion:"Decoración mágica con luces y carpas tipi para una experiencia inolvidable.",
    imagen:"img/pijamadas.jpeg"
  },
  { 
    id:4,
    nombre:"Festejos de gol",
    direccion:"Av.Tte.Gral Perón 4190 - CABA",
    mapa:"https://www.google.com/maps/search/?api=1&query=Av.TteGralJuanDomingoPeron+4190+CABA",
    descripcion:"Cancha techada con césped sintético para cumpleaños deportivos.",
    imagen:"img/canchafiestas.jpg"
  },
  { 
    id:5,
    nombre:"En un cuento, salón de fiestas",
    direccion:"Av. Pueyrredón 1640 - CABA",
    mapa:"https://www.google.com/maps/search/?api=1&query=Av.Pueyrredon+1640+CABA",
    descripcion:"Inflables temáticos, colores y diversión garantizada.",
    imagen:"img/inflables.jpg"
  },
  { 
    id:6,
    nombre:"Aventuras de la selva",
    direccion:"Av. Belgrano 2975 - CABA",
    mapa:"https://www.google.com/maps/search/?api=1&query=Av.Belgrano+2975+CABA",
    descripcion:"Ambientación selvática para que los niños se conviertan en exploradores.",
    imagen:"img/selva.png"
  },
  { 
    id:7,
    nombre:"Mundo jurásico",
    direccion:"Pi Margall 750 - CABA",
    mapa:"https://www.google.com/maps/search/?api=1&query=PiMargall+750+CABA",
    descripcion:"Viaje prehistórico con dinosaurios gigantes y escenarios mágicos.",
    imagen:"img/dinos.jpg"
  },
  { 
    id:8,
    nombre:"Adrenalina",
    direccion:"Av. Cerviño 3356 - CABA",
    mapa:"https://www.google.com/maps/search/?api=1&query=Av.Cerviño+3356+CABA",
    descripcion:"Espacio lleno de juegos y desafíos que despiertan la adrenalina y la diversión en cada niño a partir de los 6 años.",
    imagen:"img/Adrenalina.jpg"
  },
  { 
    id:9,
    nombre:"¡Festejá en la selva!",
    direccion:"Gral. Urquiza 609 - CABA",
    mapa:"https://www.google.com/maps/search/?api=1&query=Gral.Urquiza+609+CABA" ,
    descripcion:"¡Viví una experiencia salvajemente divertida! Sumergite en una aventura llena de colores, lianas y animales de la jungla.",
    imagen:"img/festejosSelva.jpg"
  }
];

export function inicializarLocalStorage() {
  if (!localStorage.getItem("salones")) {
    localStorage.setItem("salones", JSON.stringify(salonesIniciales));
  }
}
