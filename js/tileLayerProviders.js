  // Mapbox background
  var mapboxToken = '';
  var tileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11', // mapbox/satellite-v9 | more at: https://www.mapbox.com/gallery
    tileSize: 512,
    zoomOffset: -1,
    accessToken: mapboxToken
  }).addTo(mymap);


  // Open Topo Map background
  var tileLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors | <a href="http://viewfinderpanoramas.org/">SRTM</a> | Map style &copy; <a href="https://opentopomap.org/">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>)',
    maxZoom: 18,
    tms: false,
    subdomains: 'abc',
    zoomOffset: -1,
    tileSize: 512
  }).addTo(mymap);


  // OSM background map
  var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    tms: false,
    subdomains: 'abc',
    zoomOffset: -1,
    tileSize: 512
  }).addTo(mymap);

  // Open Topo Map background
  var thunderforestAPIKey = '';
  var tileLayer = L.tileLayer('https://{s}.tile.thunderforest.com/{style}/{z}/{x}/{y}.png?apikey={apikey}', {
    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 22,
    style: 'neighbourhood', // cycle | transport | transport-dark | landscape | outdoors | spinal-map | pioneer | mobile-atlas | neighbourhood
    apikey: thunderforestAPIKey
  }).addTo(mymap);