navbarAnimationMobile();

const params = new URLSearchParams(window.location.search);
const keyView = params.get('key');
const title = params.get('name');
if (keyView) {
    document.querySelector('#data-marker').classList.remove('hidden');
    document.querySelector('#title').innerHTML = title;
}

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
    const url = "https://script.google.com/macros/s/AKfycbwSOo-cuu659Ch0QYjQsmDiyfq5Te9Pba6SHWK9i8AM1wZlSOQ0tQxyvC_BX0TrsugH/exec";
    
    let headers = new Headers();
    
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    
    const requestBD = fetch(url, headers);
    
    requestBD.then(res => {
        return res.json();
    }).then(res => {
        let viewSucess = false;

        const dataResponse = Object.values(res);
        // remove head
        dataResponse.shift();
        let count = 0;

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
            count++;
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
            marker.key = count;
            
            marker.bindPopup(buildPopup(item))
            marker.on('click', findDataMarker);
            marker.addTo(map);
            marker.setZIndexOffset(count);

            if (count == keyView) {
                buildDataMarker(item, count)
                map.setView(item.c.split(','), '19');
                viewSucess = true;
            }
        }

        if (!viewSucess) {
            document.querySelector('#data-marker').classList.add('hidden');
        }
    });
}

function buildPopup(data) {
    return '<h3>' + data.a + '</h3><p>' + data.b + '.</p>';
}

function findDataMarker(e) {
    buildDataMarker(e.target.info, e.target.key)
}

function buildDataMarker(info, key){
    const title = info.a;
    const subtitle = info.b;
    const localization = info.c;
    const address = info.d;
    const description = info.e;
    const youtube = info.f;
    const instagram = info.g;
    const facebook = info.h;
    const sunday = info.i;
    const monday = info.j;
    const tuesday = info.k;
    const wednesday = info.l;
    const thursday = info.m;
    const friday = info.n;
    const saturday = info.o;
    const extra = info.p;
    const date = info.q;
    const filter = info.r;

    document.querySelector('#data-marker').classList.remove('hidden');

    document.querySelector('#title').innerHTML = title;
    document.querySelector('#subtitle').innerHTML = subtitle;
    document.querySelector('#address').innerHTML = address;
    document.querySelector('#description').innerHTML = description;
    document.querySelector('#date').innerHTML = date;

    if (youtube) {
        document.querySelector('#youtube').classList.remove('hidden');
        document.querySelector('#youtube').href = youtube;
    } else {
        document.querySelector('#youtube').classList.add('hidden');
    }

    if (instagram) {
        document.querySelector('#instagram').classList.remove('hidden');
        document.querySelector('#instagram').href = instagram;
    } else {
        document.querySelector('#instagram').classList.add('hidden');
    }

    if (facebook) {
        document.querySelector('#facebook').classList.remove('hidden');
        document.querySelector('#facebook').href = facebook;
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

    if (filter.trim().length > 0) {
        let html = "";
        if (filter.includes("Libras")) {
            html += '<span class="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-gray-800 bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-300">Libras</span>'
        }
        if (filter.includes("Tridentino")) {
            html += '<span class="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-gray-800 bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-300">Tridentino</span>';
        }

        document.querySelector('#badge').innerHTML = html;
    }

    document.querySelector("#edit-button").addEventListener("click", function() {
        sessionStorage.setItem("edit-key", JSON.stringify(key));
    });

    let url = new URL(window.location.href);
    url.searchParams.set('key', key);
    url.searchParams.set('name', title);
    const link = document.getElementById('shared-button');
    link.href = url;

    const sharedWhats = document.getElementById('shared-button-whats');
    document.getElementById('shared-div-whats').classList.remove('hidden');
    let urlWhats = new URL(sharedWhats.href);
    urlWhats.searchParams.set('text', title + '\nno endereço: ' + address + '\nno link: ' + url);
    sharedWhats.href = urlWhats;

    sessionStorage.setItem("info", JSON.stringify(info));
    sessionStorage.setItem("key", JSON.stringify(key));
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
