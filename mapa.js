let latitude = -3.732708;
let longitude = -38.525963;
let zoom = 12;

const map = L.map('map').setView([latitude, longitude], zoom);
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var popup = L.popup();


// const marker = L.marker([-3.707286, -38.580422]).addTo(map)
//     .bindPopup('<b>Comunidade São Francisco</b><br />paróquia São Pedro.').on('click', onClickMarker);

var latlngs = [
    [-3.730131, -38.58893], // general alipio
    [-3.728589, -38.585543], // independencia
    [-3.729272, -38.583169], // eredites alencar
    [-3.730987, -38.583445], // tenente lisboa
    [-3.730506, -38.582335], // rio araquaia
    [-3.729609, -38.582474], // rio araquaia
    [-3.719655, -38.581578], // rua aberlardo ferreira
    [-3.719518, -38.582981], // alberto ferreira
    [-3.724012, -38.583394], // major assis
    [-3.723555, -38.588348], // major assis
    [-3.723579, -38.589228], // major assis
    [-3.723172, -38.590502], // padre teodoro
    [-3.726686, -38.591535], // independencia
];
// Creating a poly line
L.polyline(latlngs, {color: 'blue'}).addTo(map);

latlngs = [
    [-3.726686, -38.591535], // independencia
    [-3.723667, -38.601837], // santa maria gorete
    [-3.724882, -38.60218], // rua 2
    [-3.725407, -38.600354], // rua salamita portela
    [-3.730899, -38.601907], // dona lucia pinheiro
    [-3.731044, -38.601346], // pescadores
    [-3.732374, -38.601746], // jangadinha
    [-3.732577, -38.600973], // mangueira
    [-3.731263, -38.600611], // dona lucia pinheiro
    [-3.7316, -38.599361], // monzart lucena
    [-3.731472, -38.599356], // monzart lucena
    [-3.727055, -38.598125], // claudia guimarães
    [-3.727203, -38.597543], // rua 26
    [-3.72689, -38.597436], // quartoze
    [-3.727519, -38.595242], // emilia
    [-3.730273, -38.594027], // neapolis
    [-3.730915, -38.595427], // xxix
    [-3.731491, -38.595164], // xx
    [-3.730859, -38.593772], // emilia
    [-3.733426, -38.592621], // matozo filho
    [-3.730428, -38.585942], // raimundo rocha de menezes
    [-3.729058, -38.586532] // general alipio
];
// Creating a poly line
L.polyline(latlngs, {color: 'red'}).addTo(map);

// var icon = L.icon({
//     iconUrl: 'seta.png',
//     iconSize: [25, 41],
//     iconAnchor: [12, 41]
// });

// L.marker([-3.730131, -38.58893], {icon: icon})
// .addTo(map)
// .setRotationAngle(0);

function onClickMarker(e) {
    console.log(e.latlng.lat + ' - ' + e.latlng.lng);
}

function onMapClick(e) {
    popup.setLatLng(e.latlng)
        .setContent(`Clique no mapa: ${e.latlng.toString()}`)
        .openOn(map);
}

map.on('click', onMapClick);
