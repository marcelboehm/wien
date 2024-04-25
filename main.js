/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
  lat: 48.208493,
  lng: 16.373118,
  title: "Stephansdom",
};

// Karte initialisieren
let map = L.map("map").setView([stephansdom.lat, stephansdom.lng], 12);
map.addControl(new L.Control.Fullscreen());

// BasemapAT Layer mit Leaflet provider plugin als startLayer Variable
let startLayer = L.tileLayer.provider("BasemapAT.grau");
startLayer.addTo(map);

let themaLayer = {
  sights: L.featureGroup().addTo(map),
  zones: L.featureGroup().addTo(map),
  lines: L.featureGroup().addTo(map),
  stops: L.featureGroup().addTo(map),
  hotels: L.featureGroup().addTo(map),
}


// Hintergrundlayer
L.control
  .layers({
    "BasemapAT Grau": startLayer,
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
    "WaymarkedTrails.hiking": L.tileLayer.provider("WaymarkedTrails.hiking"),
  }, {
    "Sehenswürdigkeiten": themaLayer.sights,
    "Fußgängerzonen": themaLayer.zones,
    "Touristische Linien": themaLayer.lines,
    "Haltestellen": themaLayer.stops,
    "Hotels": themaLayer.hotels,
  })
  .addTo(map);

// Marker Stephansdom
L.marker([stephansdom.lat, stephansdom.lng])
  .addTo(themaLayer.sights)
  .bindPopup(stephansdom.title)
  .openPopup();

// Maßstab
L.control
  .scale({
    imperial: false,
  })
  .addTo(map);


async function loadSights(url) {
  let response = await fetch(url);
  let sights = await response.json();

  L.geoJson(sights, {
    pointToLayer: function (feature, latlng) {
      let icon = L.icon({
        iconUrl: "icons/photo.png",
      });
      let marker = L.marker(latlng, {
        icon: icon,
      });
      return marker;
    },


    onEachFeature: (feature, layer) => {
      layer.bindPopup(`
      <img src="${feature.properties.THUMBNAIL}" style="width:200px" />
      <h4><a href="${feature.properties
          .WEITERE_INF}" target="wien">${feature.properties.NAME}</h4></a>
      <address>${feature.properties.ADRESSE}</address>
      `)
    }
  }).addTo(themaLayer.sights);
}

async function loadZones(url) {
  let response = await fetch(url);
  let zones = await response.json();

  L.geoJson(zones, {
    style: function () {
      return {
        color: "#F012BE",
        fillColor: "#F012BE",
        fillOpacity: 0.3,
      };
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(`
      <h4>Fußgängerzone ${feature.properties.ADRESSE}</h4>
      <p><i class="fa-solid fa-clock"></i> ${feature.properties.ZEITRAUM}</p>
      <p><i class="fa-solid fa-circle-info"></i> ${feature.properties.AUSN_TEXT}</p>

      
      `);
    }
  }).addTo(themaLayer.zones);
}

async function loadLines(url) {
  let response = await fetch(url);
  let lines = await response.json();

  L.geoJson(lines, {
    style: function (feature) {

      if (feature.properties.LINE_NAME === "Blue Line") {
        return {
          color: "#0074D9",
        }
      } else if (feature.properties.LINE_NAME === "Yellow Line") {
        return {
          color: "#FFDC00",
        }
      } else if (feature.properties.LINE_NAME === "Red Line") {
        return {
          color: "#FF4136",
        }
      } else if (feature.properties.LINE_NAME === "Green Line") {
        return {
          color: "#2ECC40",
        }
      } else if (feature.properties.LINE_NAME === "Orange Line") {
        return {
          color: "#  ",
        }
      }
      return {
        color: "black",
      }
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(`
        <h4><i class="fa-solid fa-bus"></i> ${feature.properties.LINE_NAME}</h4>
        <p><i class="fa-solid fa-circle-stop"></i> ${feature.properties.FROM_NAME}</p>
        <p><i class="fa-solid fa-down-long"></i></p>
        <p><i class="fa-solid fa-circle-stop"></i> ${feature.properties.TO_NAME}</p>
      `);
    }
  }).addTo(themaLayer.lines);
}

async function loadStops(url) {
  let response = await fetch(url);
  let stops = await response.json();

  L.geoJson(stops, {
    pointToLayer: function (feature, latlng) {
      let icon = L.icon({
        popupAnchor: [15, 0],
        iconUrl: `icons/bus_${feature.properties.LINE_ID}.png`,
      });
      let marker = L.marker(latlng, {
        icon: icon,
      });
      return marker;
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(`
        <h4><i class="fa-solid fa-bus"></i> ${feature.properties.LINE_NAME}</h4>
        <p>${feature.properties.STAT_ID} ${feature.properties.STAT_NAME}</p>
      `);
    }
  }).addTo(themaLayer.stops);
}

async function loadHotel(url) {
  let response = await fetch(url);
  let hotels = await response.json();



  L.geoJson(hotels, {
    pointToLayer: function (feature, latlng) {

      let stars = "";
      if (feature.properties.KATEGORIE_TXT === "1*") {
        stars = "1";
      } else if (feature.properties.KATEGORIE_TXT === "2*") {
        stars = "2";
      } else if (feature.properties.KATEGORIE_TXT === "3*") {
        stars = "3";
      } else if (feature.properties.KATEGORIE_TXT === "4*") {
        stars = "4";
      } else if (feature.properties.KATEGORIE_TXT === "5*") {
        stars = "5";
      } else {
        stars = "0"
      }

      let icon = L.icon({
        iconUrl: `icons/hotel_${stars}stars.png`,
        popupAnchor: [15, 0],
      });
      let marker = L.marker(latlng, {

        icon: icon,
      });
      return marker;
    },
    onEachFeature: (feature, layer) => {
      layer.bindPopup(`
        <h3>${feature.properties.BETRIEB}</h3>
        <p><strong>${feature.properties.BETRIEBSART_TXT} ${feature.properties.KATEGORIE_TXT}</strong></p>
        <hr>
        <p>
          Addr.: ${feature.properties.ADRESSE}<br>
          Tel.: <a href="tel:${feature.properties.KONTAKT_TEL}">${feature.properties.KONTAKT_TEL}</a><br>
          <a href="mailto:${feature.properties.KONTAKT_EMAIL}">${feature.properties.KONTAKT_EMAIL}</a><br>
          <a href="${feature.properties.WEBLINK1}" target="wien">Homepage</a>
        </p>
      `);
    }
  }).addTo(themaLayer.hotels);
}


loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")

loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json")

loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json")

loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json")

loadHotel("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")