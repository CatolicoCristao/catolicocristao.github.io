navbarAnimationMobile();


// var locateControl = new L.Control.Locate();

// map.addControl(locateControl);

// locateControl.locate();

// // Verifica se a localização do usuário está dentro de um buffer de 100 metros de um ponto
// var isUserWithinBuffer = locateControl.isWithinBuffer(point, 100);


function navbarAnimationMobile() {
    const button = document.querySelector('[aria-controls="mobile-menu"]');
    if (button) {
        const menu = document.getElementById('mobile-menu');

        button.addEventListener('click', () => {
            if (button.getAttribute('aria-expanded') === 'false') {
                button.setAttribute('aria-expanded', 'true');
                menu.classList.remove('hidden');

            } else {
                button.setAttribute('aria-expanded', 'false');
                menu.classList.add('hidden');
            }
        });
    }

}


let latitude = -3.732708;
let longitude = -38.525963;
let zoom = 12;

const map = L.map('map').setView([latitude, longitude], zoom);
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
map.on('click', showLocationPosition);

map.invalidateSize();

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
    document.querySelector('#makerData').innerHTML = "";
    
    const nomeIgreja = e.target.info.a;
    const nomeParoquia = e.target.info.b;

    const div = document.createElement("div");
    div.className = "dataMakerShow";
    const span = document.createElement("span");
    span.className = "close";
    span.innerHTML = "✕";
    span.addEventListener("click", function() {
        document.querySelector('#makerData').innerHTML = "";
    });
    div.appendChild(span);

    const h1 = document.createElement("h1");
    h1.classList.add("classe-h1", "outra-classe-h1");
    h1.innerHTML = nomeIgreja
    div.appendChild(h1);
    const h2 = document.createElement("h2");
    h2.classList.add("classe-h2", "outra-classe-h2");
    h2.innerHTML = nomeParoquia
    div.appendChild(h2);

    document.querySelector('#makerData').appendChild(div);
}

function showLocationPosition(e) {
    document.querySelector('#lat').value = e.latlng.lat + ',' + e.latlng.lng;

    popup.setLatLng(e.latlng)
        .setContent(`Clique no mapa: ${e.latlng.toString()}`)
        .openOn(map);
}