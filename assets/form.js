navbarAnimationMobile();
loadLibMap();

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
    const url = "https://script.google.com/macros/s/AKfycbw-rCem8tvgz89uy2OOWYnPRy5RN0Ql977cWR-rH2n96v-BCYXXgS3QuFbW0E_RP1o2/exec";

    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    const requestBD = fetch(url, headers);

    requestBD.then(res => {
        return res.json();
    }).then(res => {
        const data = Object.values(res);

        for (const item of data) {
            const maker = L.marker(
                item.c.split(','),
                {
                    icon: L.icon({
                        iconUrl: "maker.png",
                        iconSize: [20, 20]
                    }),
                    title: item.a
                }
            );
            maker.info = item;

            maker.bindPopup(buildPopup(item));
            maker.addTo(map);
        }
    });
}

function buildPopup(data) {
    return '<h3>' + data.a + '</h3><p>' + data.b + '.</p>';
}

function showLocationPosition(e) {
    document.querySelector('#localization').value = e.latlng.lat + ',' + e.latlng.lng;
}

document.querySelector('button[type="submit"]').addEventListener('click', function (event) {
    event.preventDefault();

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

    const url = "https://script.google.com/macros/s/AKfycbw-rCem8tvgz89uy2OOWYnPRy5RN0Ql977cWR-rH2n96v-BCYXXgS3QuFbW0E_RP1o2/exec";

    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    
    fetch(url, {
        mode: 'no-cors',
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            'a' : title,
            'b' : subtitle,
            'c' : localization,
            'd' : address,
            'e' : description,
            'i' : sunday,
            'j' : monday,
            'k' : tuesday,
            'l' : wednesday,
            'm' : thursday,
            'n' : friday,
            'o' : saturday,
            'p' : extra,
            'f' : youtube,
            'g' : instagram,
            'h' : facebook,
        })
    }).then(res => {
        document.querySelector('#alert').classList.remove('hidden');
    });

    document.querySelector('#form').reset();
});
