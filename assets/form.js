navbarAnimationMobile();
editData();

const map = loadLibMap();

var markerAdd = L.marker(
    [0, 0],
    {
        icon: L.icon({
            iconUrl: "marker-edit.png",
            iconSize: [30, 30]
        }),
        title: "Nova Marcação"
    }
);
markerAdd.addTo(map);

function editData() {
    if (sessionStorage.getItem("key") && sessionStorage.getItem("key") == sessionStorage.getItem("edit-key")) {
        const info = JSON.parse(sessionStorage.getItem("info"));

        document.querySelector('[name="title"]').value = info.a;
        document.querySelector('[name="subtitle"]').value = info.b;
        document.querySelector('[name="localization"]').value = info.c;
        document.querySelector('[name="address"]').value = info.d;
        document.querySelector('[name="description"]').value = info.e;
        document.querySelector('[name="youtube"]').value = info.f;
        document.querySelector('[name="instagram"]').value = info.g;
        document.querySelector('[name="facebook"]').value = info.h;
        document.querySelector('[name="sunday"]').value = info.i;
        document.querySelector('[name="monday"]').value = info.j;
        document.querySelector('[name="tuesday"]').value = info.k;
        document.querySelector('[name="wednesday"]').value = info.l;
        document.querySelector('[name="thursday"]').value = info.m;
        document.querySelector('[name="friday"]').value = info.n;
        document.querySelector('[name="saturday"]').value = info.o;
        document.querySelector('[name="extra"]').value = info.p;

        const filter = info.r;
        document.querySelector('[name="Libras"]').checked = filter.includes("Libras");
        document.querySelector('[name="Tridentino"]').checked = filter.includes("Tridentino");
        
        sessionStorage.clear();
    }
}

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

function loadLibMap() {
    let latitude = -3.732708;
    let longitude = -38.525963;
    let zoom = 12;

    const map = L.map('map').setView([latitude, longitude], zoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    map.on('click', showLocationPosition);

    map.invalidateSize();

    setLocationUser(map, latitude, longitude, zoom);

    loadDataMap(map);

    return map;
}

function setLocationUser(map, latitude, longitude, zoom) {
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
}

function loadDataMap(map) {
    const url = "https://script.google.com/macros/s/AKfycbwSOo-cuu659Ch0QYjQsmDiyfq5Te9Pba6SHWK9i8AM1wZlSOQ0tQxyvC_BX0TrsugH/exec";

    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    const requestBD = fetch(url, headers);

    requestBD.then(res => {
        return res.json();
        }).then(res => {
        const dataResponse = Object.values(res);
        // remove head
        dataResponse.shift();

        const compararObjetos = (obj1, obj2) => obj1.c === obj2.c;

        const data = dataResponse.reverse().reduce((acc, obj) => {
            // Check if the object already exists in the accumulator
            const encontrado = acc.findIndex(compararObjetos.bind(null, obj));

            // If not found, add it to the accumulator
            if (encontrado === -1) {
                // validate infos
                if (obj.c != "") {
                    acc.push(obj);
                }
            }

            return acc;
        }, []);

        for (const item of data) {
            const marker = L.marker(
                item.c.split(','),
                {
                    icon: L.icon({
                        iconUrl: "marker.png",
                        iconSize: [20, 20]
                    }),
                    title: item.a
                }
            );
            marker.info = item;

            marker.bindPopup(buildPopup(item));
            marker.addTo(map);
        }
    });
}

function buildPopup(data) {
    return '<h3>' + data.a + '</h3><p>' + data.b + '.</p>';
}

function showLocationPosition(e) {
    markerAdd.setLatLng([e.latlng.lat, e.latlng.lng]);
    map.setView([e.latlng.lat, e.latlng.lng], '15');

    document.querySelector('#localization').value = e.latlng.lat + ',' + e.latlng.lng;
}

function getDataNow() {
    const dataAtual = new Date();

    const dia = dataAtual.getDate();
    const mes = dataAtual.getMonth() + 1;
    const ano = dataAtual.getFullYear();

    const hora = dataAtual.getHours();
    const minuto = dataAtual.getMinutes();

    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

document.querySelector('#submit').addEventListener('click', function (event) {
    event.preventDefault();

    if (!document.getElementById('form').reportValidity()) {
        return false;
    }

    window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });

    const button = document.querySelector('#submit');

    button.getElementsByTagName('svg')[0].classList.remove('hidden');
    button.disabled = true;
    button.classList.remove("bg-transparent");
    button.classList.remove("hover:bg-blue-500");
    button.classList.remove("hover:text-white");
    button.classList.remove("hover:border-transparent");
    button.classList.add("bg-gray-400");

    const title = document.querySelector('[name="title"]').value;
    const subtitle = document.querySelector('[name="subtitle"]').value;
    const localization = document.querySelector('[name="localization"]').value;
    const address = document.querySelector('[name="address"]').value;
    const description = document.querySelector('[name="description"]').value;
    const youtube = document.querySelector('[name="youtube"]').value;
    const instagram = document.querySelector('[name="instagram"]').value;
    const facebook = document.querySelector('[name="facebook"]').value;
    const sunday = document.querySelector('[name="sunday"]').value;
    const monday = document.querySelector('[name="monday"]').value;
    const tuesday = document.querySelector('[name="tuesday"]').value;
    const wednesday = document.querySelector('[name="wednesday"]').value;
    const thursday = document.querySelector('[name="thursday"]').value;
    const friday = document.querySelector('[name="friday"]').value;
    const saturday = document.querySelector('[name="saturday"]').value;
    const extra = document.querySelector('[name="extra"]').value;

    let filter = '';

    if (document.querySelector('[name="Libras"]').checked) {
        filter += " Libras ";
    }

    if (document.querySelector('[name="Tridentino"]').checked) {
        filter += " Tridentino ";
    }

    const url = "https://script.google.com/macros/s/AKfycbwSOo-cuu659Ch0QYjQsmDiyfq5Te9Pba6SHWK9i8AM1wZlSOQ0tQxyvC_BX0TrsugH/exec";

    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    fetch(url, {
        mode: 'no-cors',
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            'a': title,
            'b': subtitle,
            'c': localization,
            'd': address,
            'e': description,
            'f': youtube,
            'g': instagram,
            'h': facebook,
            'i': sunday,
            'j': monday,
            'k': tuesday,
            'l': wednesday,
            'm': thursday,
            'n': friday,
            'o': saturday,
            'p': extra,
            'q': getDataNow(),
            'r': filter
        })
    }).then(res => {
        button.getElementsByTagName('svg')[0].classList.add('hidden');
        document.querySelector('#alert').classList.remove('hidden');
    });

    document.querySelector('#form').reset();
});

// Variável para armazenar o temporizador
let timeoutId;

// Função para lidar com o evento de entrada no campo de texto
document.getElementById('address').addEventListener('input', function() {
    // Cancelar o temporizador anterior, se houver
    clearTimeout(timeoutId);

    // Configurar um novo temporizador
    timeoutId = setTimeout(inputLatLonInMap, 500); // 500 milissegundos de atraso (ajuste conforme necessário)
});

function inputLatLonInMap() {
    const address = document.getElementById('address').value;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data && data.length > 0) {
            const { lat, lon } = data[0];

            const latitude = lat;
            const longitude = lon;

            markerAdd.setLatLng([latitude, longitude]);
            map.setView([latitude, longitude], '15');

            document.querySelector('#localization').value = lat + ',' + lon;
        } else {
            console.log('Endereço não encontrado');
        }
    })
    .catch(error => {
        console.error('Erro ao processar a solicitação:', error);
    });
}
