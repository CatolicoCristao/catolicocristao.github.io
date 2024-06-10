navbarAnimationMobile();
const map = loadLibMap();

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
        const dataResponse = Object.values(res);
        // remove head
        dataResponse.shift();
        let count = 0;

        let search = sessionStorage.getItem("search");
        document.querySelector("#search").value = search;
        sessionStorage.clear();

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

        const pontosMaisProximos = [];

        for (const item of data) {
            count++;
            let free = false;

            if (search) {
                search = clearString(search);
                let search_a = clearString(item.a);
                if (search_a.includes(search)) {
                    free = true;
                }
                let search_b = clearString(item.b);
                if (search_b.includes(search)) {
                    free = true;
                }
                let search_d = clearString(item.d);
                if (search_d.includes(search)) {
                    free = true;
                }
                let search_e = clearString(item.e);
                if (search_e.includes(search)) {
                    free = true;
                }
                let search_r = clearString(item.r);
                if (search_r.includes(search)) {
                    free = true;
                }
            } else {
                free = true;
            }

            if (free) {

                const distancia = calcularDistancia(map.getCenter(), item);
                pontosMaisProximos.push({ item, distancia });

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

                marker.bindPopup(buildPopup(item));
                marker.on('click', findDataMarker);
                marker.addTo(map);
                marker.setZIndexOffset(count);
            }
        }

        pontosMaisProximos.sort((pontoA, pontoB) => pontoA.distancia - pontoB.distancia);

        for (const item of pontosMaisProximos) {
            const point = item.item;

            const pointHTML = buildRow(point);

            document.querySelector("#table-search").innerHTML = document.querySelector("#table-search").innerHTML + pointHTML;
        }
    });
}

function buildPopup(data) {
    return '<h3>' + data.a + '</h3><p>' + data.b + '.</p>';
}

function clearString(string) {
    string = string.trim();
    string = string.toLowerCase();
    string = string.normalize("NFD");
    string = string.replace(/[\u0300-\u036F]/g, "");

    return string;
}

function calcularDistancia(pontoA, pontoB) {
    const dx = pontoA.lat - pontoB.c.split(',')[0];
    const dy = pontoA.lng - pontoB.c.split(',')[1];

    return Math.sqrt(dx * dx + dy * dy);
}

function buildRow(point) {
    let html = "";
    html += '<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">';
    html += '<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">';
    html += point.a;
    html += '</th>';
    html += '<td class="px-6 py-4">';
    html += point.b;
    html += '</td>';
    html += '<td class="px-6 py-4">';
    html += point.d;
    html += '</td>';
    html += '</tr>';

    return html;
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
    const date = e.target.info.q;
    const filter = e.target.info.r;
    const key = e.target.key;

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
        sessionStorage.setItem("edit-key", JSON.stringify(e.target.key));
    });

    sessionStorage.setItem("info", JSON.stringify(e.target.info));
    sessionStorage.setItem("key", JSON.stringify(e.target.key));
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

document.querySelector("#search-button").addEventListener("click", function () {
    sessionStorage.setItem("search", document.querySelector("#search").value);
    location.reload();
});

document.querySelector("#you-location").addEventListener("click", function () {
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const marker = L.marker(
            [latitude, longitude],
            {
                icon: L.icon({
                    iconUrl: "user.png",
                    iconSize: [30, 30]
                }),
                title: "Você"
            }
        );
        marker.addTo(map);

        map.setView([latitude, longitude], '15');
    });
});

