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
        showDataNumber(data.length);

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

            maker.bindPopup(buildPopup(item))
            maker.on('click', findDataMarker);
            maker.addTo(map);
        }
    });
}

function buildPopup(data) {
    return '<h3>' + data.a + '</h3><p>' + data.b + '.</p>';
}

function findDataMarker(e) {
    const title = e.target.info.a;
    const subtitle = e.target.info.b;
    const localization = e.target.info.c;
    const address = e.target.info.d;
    const description = e.target.info.e;
    const youtube = e.target.info.f;
    const instagram = e.target.info.g;
    const facebook = e.target.info.h;
    const sunday = e.target.info.i;
    const monday = e.target.info.j;
    const tuesday = e.target.info.k;
    const wednesday = e.target.info.l;
    const thursday = e.target.info.m;
    const friday = e.target.info.n;
    const saturday = e.target.info.o;
    const extra = e.target.info.p;

    document.querySelector('#data-marker').classList.remove('hidden');

    document.querySelector('#title').innerHTML = title;
    document.querySelector('#subtitle').innerHTML = subtitle;
    document.querySelector('#address').innerHTML = address;
    document.querySelector('#description').innerHTML = description;

    if (youtube) {
        document.querySelector('#youtube').classList.remove('hidden');
        document.querySelector('#youtube').getElementsByTagName('span')[0].innerHTML = youtube;
    } else {
        document.querySelector('#youtube').classList.add('hidden');
    }

    if (instagram) {
        document.querySelector('#instagram').classList.remove('hidden');
        document.querySelector('#instagram').getElementsByTagName('span')[0].innerHTML = instagram;
    } else {
        document.querySelector('#instagram').classList.add('hidden');
    }

    if (facebook) {
        document.querySelector('#facebook').classList.remove('hidden');
        document.querySelector('#facebook').getElementsByTagName('span')[0].innerHTML = facebook;
    } else {
        document.querySelector('#facebook').classList.add('hidden');
    }

    const weekDay = {
        'sunday': sunday,
        'monday': monday,
        'tuesday': tuesday,
        'wednesday': wednesday,
        'thursday': thursday,
        'friday': friday,
        'saturday': saturday,
        'extra': extra,
    }

    for (const [key, value] of Object.entries(weekDay)) {
        const element = document.querySelector('#' + key)
        if (value) {
            element.classList.remove('hidden');
            element.classList.add('sm:grid');
            element.classList.add('sm:grid-cols-3');
            
            buildList(element.getElementsByTagName('ul')[0], value);
        } else {
            element.classList.add('hidden');
            element.classList.remove('sm:grid');
            element.classList.remove('sm:grid-cols-3');
        }
    }
}

function buildList(list, data) {
    list.innerHTML = "";

    if (data) {
        data.split(',').forEach(text => {
            list.innerHTML = list.innerHTML + itemList(text)
        });
    }
}

function itemList(text) {
    return '<li class="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"><div class="flex w-0 flex-1 items-center"><div class="ml-4 flex min-w-0 flex-1 gap-2"><span class="truncate font-medium">' + text + '</span></div></div></li>';
}

function showDataNumber(length) {
    document.querySelector('#data-length').innerHTML = length;
}
