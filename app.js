
let latitude = -3.732708;
let longitude = -38.525963;
let zoom = 12;

const map = L.map('map').setView([latitude, longitude], zoom);
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var popup = L.popup();

const geolocation = navigator.geolocation;
geolocation.getCurrentPosition(function(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    zoom = 15;

    map.setView([latitude,longitude], zoom);
}, function(error) {
    if (error.code === error.PERMISSION_DENIED) {
        console.log("O usuário não concedeu permissão para acessar sua localização.");
    }
});

function onClickMarker(e) {
    console.log(e.latlng.lat + ' - ' + e.latlng.lng);
}

function onMapClick(e) {
    document.querySelector('#lat').value = e.latlng.lat + ',' + e.latlng.lng;

    popup.setLatLng(e.latlng)
        .setContent(`Clique no mapa: ${e.latlng.toString()}`)
        .openOn(map);
}

map.on('click', onMapClick);

const url = "https://script.google.com/macros/s/AKfycbw-rCem8tvgz89uy2OOWYnPRy5RN0Ql977cWR-rH2n96v-BCYXXgS3QuFbW0E_RP1o2/exec";

let headers = new Headers();

headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');
headers.append('Access-Control-Allow-Origin', '*');

const requestBD = fetch(url, headers);

requestBD.then(res => {
    return res.json();
}).then(res => {
    for (const [key, item] of Object.entries(res)) {
        const marker = L.marker(item.c.split(','))
            .addTo(map)
            .bindPopup('<h3>' + item.a + '</h3><p>' + item.b + '.</p>')
            .on('click', onClickMarker);
    }
});

document.querySelector('button[type="submit"]').addEventListener('click', function (event) {
    event.preventDefault();
    
    const nomeIgreja = document.querySelector('#nome-igreja').value;
    const paroquia = document.querySelector('#paroquia').value;
    const lat = document.querySelector('#lat').value;

    console.log(JSON.stringify({
        'a': nomeIgreja,
        'b': paroquia,
        'c': lat
    }));

    fetch(url, {
        mode:  'no-cors',
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            'a': nomeIgreja,
            'b': paroquia,
            'c': lat
        })
    }).then(res => {
        document.querySelector('#alert').innerHTML = nomeIgreja + " adicionada";
    })

    document.querySelector('#nome-igreja').value = '';
    document.querySelector('#paroquia').value = '';
    document.querySelector('#lat').value = '';
});
