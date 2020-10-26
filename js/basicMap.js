// Map centered to Munich, Germany
var map = L.map('mapid').setView([48.15, 11.58], 11);

// Add OSM background map
var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
  minZoom: 0,
  tms: false,
  subdomains: 'abc',
  zoomOffset: -1,
  tileSize: 512
}).addTo(map);

// Configure FROST instance and setup query
var frost = 'https://gi3.gis.lrg.tum.de/frost/v1.1'
var query = '/Locations';
var url = frost + query;

console.log("FROST query: " + url);

// Fetch data from FROST
fetch(url)
  .then((resp) => resp.json())
  .then(function(data) {

    console.log('JSON returned from FROST:');
    console.log(data);

    // Process JSON from FORST here
    // ...
    // ...


  })
  .catch(function(err) {
    // Handle errors during request
    console.log('Requesting ' + url + ' failed!');
    console.log(err);
  });