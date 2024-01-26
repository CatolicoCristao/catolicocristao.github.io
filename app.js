// Load Map Lib
let latitude = -3.732708;
let longitude = -38.525963;
let zoom = 12;

const map = L.map('map').setView([latitude, longitude], zoom);
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
map.on('click', showLocationPosition);

const popup = L.popup();

// Set Location User
if (navigator?.userAgentData?.mobile) {
    const geolocation = navigator.geolocation;
    geolocation.getCurrentPosition(function (position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        zoom = 15;

        map.setView([latitude, longitude], zoom);
    }, function (error) {
        if (error.code === error.PERMISSION_DENIED) {
            console.log("O usuário não concedeu permissão para acessar sua localização.");
        }
    });
}

// Load Data Map
const url = "https://script.google.com/macros/s/AKfycbw-rCem8tvgz89uy2OOWYnPRy5RN0Ql977cWR-rH2n96v-BCYXXgS3QuFbW0E_RP1o2/exec";

let headers = new Headers();

headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');
headers.append('Access-Control-Allow-Origin', '*');

const requestBD = fetch(url, headers);

requestBD.then(res => {
    return res.json();
}).then(res => {
    for (const item of Object.values(res)) {
        const maker = L.marker(
            item.c.split(','),
            {
                icon: L.icon({
                    iconUrl: "maker.png",
                }),
                title: item.a
            }
        );
        maker.info = item;

        maker.bindPopup(buildPopup(item))
        maker.on('click', findDataMarker);
        maker.addTo(map);
    }
});

function buildPopup(data) {
    return '<h3>' + data.a + '</h3><p>' + data.b + '.</p>';
}

function findDataMarker(e) {
    const nomeIgreja = e.target.info.a;
    const nomeParoquia = e.target.info.b;

    let htmlBuild = "<h1>" + nomeIgreja + "</h1><h2>" + nomeParoquia + "</h2>"

    document.querySelector('#makerData').innerHTML = htmlBuild;

    document.querySelector('#formContent').style.display = "none";
    document.querySelector('#makerDataContent').style.display = "block";
}

function showLocationPosition(e) {
    document.querySelector('#lat').value = e.latlng.lat + ',' + e.latlng.lng;

    popup.setLatLng(e.latlng)
        .setContent(`Clique no mapa: ${e.latlng.toString()}`)
        .openOn(map);
}

// Form Create Maker
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
        mode: 'no-cors',
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            'a': nomeIgreja,
            'b': paroquia,
            'c': lat
        })
    }).then(res => {
        document.querySelector('#alert').innerHTML = nomeIgreja + " adicionada";
    });

    document.querySelector('#nome-igreja').value = '';
    document.querySelector('#paroquia').value = '';
    document.querySelector('#lat').value = '';
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".collapser-button").forEach(function (button) {
        button.addEventListener("click", function () {
            const content = this.nextElementSibling; // Referencia o conteúdo colapsado
            content.style.display = content.style.display === "none" ? "block" : "none";
        });
    });
});
