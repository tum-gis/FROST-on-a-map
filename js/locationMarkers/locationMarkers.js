// Leaflet map
var map = L.map('mapid').setView([48.15, 11.58], 13);

// OSM background map
var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
  minZoom: 0,
  tms: false,
  subdomains: 'abc',
  zoomOffset: -1,
  tileSize: 512
}).addTo(map);


var frostBaseURL = 'https://iot.hef.tum.de/frost';
var frostQuery = '/Things?$expand=Locations&$resultFormat=GeoJSON';

// append expand and select
var url = frostBaseURL + frostQuery;

// Update headline and query
document.getElementById('query').innerHTML = url;

console.log(url);

// Fetch data from FROST
fetch(url)
  .then((resp) => resp.json())
  .then(function(data) {

    console.log('Data');
    console.log(data);

    // Array of markers
    var markers = [];

    data.features.forEach(function(feature) {

      // Coords and marker
      var coords = switchLatLon(feature.geometry.coordinates);
      var marker = L.marker(coords);

      // Popup for marker
      var iotSelfLink = "<a href=\"" + feature.properties["@iot.selfLink"] + "\">" + feature.properties["@iot.selfLink"] + "</a>";
      var thingID = feature.properties.id;
      var locationDescription = feature.properties["Locations/0/description"];


      marker.bindPopup("<b>" + feature.properties.name + "</b> (#" + thingID + ") <br><br>" +
        feature.properties.description + "<br>" + iotSelfLink +
        "<br>" +
        locationDescription
      );
      markers.push(marker);
    });

    // Group markers and fit map to bounds
    var featureGroup = L.featureGroup(markers).addTo(map);
    map.fitBounds(featureGroup.getBounds());
  })
  .catch(function(err) {
    console.log('Requesting ' + url + ' failed!');
    console.log(err);
  });

// switch coords
function switchLatLon(inpu) {
  var arr = [inpu[1], inpu[0]];
  return arr;
}
