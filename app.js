let latitude = -3.732708;
let longitude = -38.525963;
let zoom = 12;

const map = L.map('map').setView([latitude, longitude], zoom);
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var popup = L.popup();

// const geolocation = navigator.geolocation;
// geolocation.getCurrentPosition(function(position) {
//     latitude = position.coords.latitude;
//     longitude = position.coords.longitude;
//     zoom = 15;

//     map.setView([latitude,longitude], zoom);
// }, function(error) {
//     if (error.code === error.PERMISSION_DENIED) {
//         console.log("O usuário não concedeu permissão para acessar sua localização.");
//     }
// });

function onClickMarker(e) {
    console.log(e.latlng.lat + ' - ' + e.latlng.lng);
}

function onMapClick(e) {
    document.querySelector('#lat').value = e.latlng.lat;
    document.querySelector('#lng').value = e.latlng.lng;

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
        L.marker([item.c, item.d])
            .addTo(map)
            .bindPopup('<b>'+item.a+'</b><br />'+item.b+'.')
            .on('click', onClickMarker);
    }
});

// Adiciona um evento de click ao botão de salvar
document.querySelector('button[type="submit"]').addEventListener('click', function(event) {
    event.preventDefault();// Especifica a URL da rota API

    // Obtém os dados do formulário
    const nomeIgreja = document.querySelector('#nome-igreja').value;
    const paroquia = document.querySelector('#paroquia').value;
    const lat = document.querySelector('#lat').value;
    const lng = document.querySelector('#lng').value;

    // Cria um objeto JSON
    const dados = {
      'a': nomeIgreja,
      'b': paroquia,
      'c': lat,
      'd': lng
    };

    postData(url, headers, dados);

    
    
    // // Faz a solicitação POST
    // fetch(url, {
    //   method: "POST",
    //   body: JSON.stringify(textoJSON),
    //   headers: headers,
    // })
    //   .then((response) => {
    //     // Trata a resposta da solicitação
    //     if (response.ok) {
    //       // A solicitação foi bem-sucedida
    //       console.log("Post enviado com sucesso");
    //     } else {
    //       // A solicitação falhou
    //       console.log("Erro ao enviar o post");
    //     }
    //   })
    //   .catch((error) => {
    //     // Erro ao fazer a solicitação
    //     console.log(error);
    //   });
      

    // Salva o objeto JSON em um arquivo
    // const dadosEmTexto = JSON.stringify(dados);
    // const arquivo = new FileWriter('/dados.json');
    // arquivo.write(dadosEmTexto);
    // arquivo.close();

    console.log('foi');

});

async function postData(url, headers, data){
    try {
        const response = await fetch(url, {
            method: "POST", // or 'PUT'
            headers: headers,
            body: data,
        });

        const result = await response.json();
        console.log("Success:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}
// map.on('click', onMapClick);


// const map = L.map("map", {
//     center: [-3.7753, -38.5081],
//     zoom: 10,
// });

// const marker = L.marker([-3.7753, -38.5081]);

// marker.addTo(map);

// const infoWindow = L.infoWindow({
//     content: `
//       <h3>Rua da Paz, 123</h3>
//       <p>Fortaleza, CE, Brasil</p>
//     `,
//   });
  
//   marker.bindTooltip(infoWindow);

  
/*/ Importa o Google Maps
const google = require("google-maps");

// Inicializa o mapa
const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -3.7753, lng: -38.5081 },
    zoom: 10,
});

// Cria um objeto para armazenar os eventos
const events = [];

// Adiciona um evento ao objeto
events.push({
    title: "Missa Dominical",
    description: "Missa das 10h",
    location: { lat: -3.7753, lng: -38.5081 },
    time: "10:00",
});

// Adiciona os pinos ao mapa
for (const event of events) {
    const marker = new google.maps.Marker({
        map: map,
        position: event.location,
    });

    // Cria um tooltip para o pino
    const infoWindow = new google.maps.InfoWindow({
        content: `
      <h3>${event.title}</h3>
      <p>${event.description}</p>
      <p>Horário: ${event.time}</p>
    `,
    });

    // Abre o tooltip quando o usuário clica no pino
    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });
}
*/