// Map centered to Munich, Germany
var map = L.map('mapid').setView([48.15, 11.58], 11);

// Add Stadiamaps background map
var tileLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> | &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors | <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
}).addTo(map);

// Configure FROST instance and setup query
// Example query:
// https://iot.hef.tum.de/frost/Things(16)/HistoricalLocations?$filter=time%20gt%202020-10-20T00:00:00.000Z%20and%20time%20lt%202020-10-22T23:59:59.999Z&$expand=Locations($select=location)&$top=10&$select=time&$resultFormat=GeoJSON&$orderby=time desc

// FROST server and, Thing, number of HistoricalLocations, time filter (optional)
var frostBaseURL = 'https://iot.hef.tum.de/frost';

var thingIotID = 16;
var nHistoricalLocations = 10;
var timeIntervalFilter = '$filter=time%20gt%202020-10-20T00:00:00.000Z%20and%20time%20lt%202020-10-22T23:59:59.999Z';

// Build query
var frostBaseURL = 'https://iot.hef.tum.de/frost';
var frostQuery = '/Things(' + thingIotID + ')/HistoricalLocations?';

// Append time interval filter, if exists
try {
  if (timeIntervalFilter) {
    frostQuery += timeIntervalFilter;
    if (timeIntervalFilter.slice(-1) != '&') {
      frostQuery += '&';
    }
  }
} catch {
  // Do nothing if timeIntervalFilter is not defined
}

// append expand and select
frostQuery += '$expand=Locations($select=location)&$top=' + nHistoricalLocations + '&$select=time&$resultFormat=GeoJSON&$orderby=time desc';
var url = frostBaseURL + frostQuery;

// Update headline and query
document.getElementById('hl').innerHTML = 'Last ' + nHistoricalLocations + ' locations of Thing #' + thingIotID;
document.getElementById('query').innerHTML = url;

// Fetch data from FROST
fetch(url)
  .then((resp) => resp.json())
  .then(function(data) {

    // Build poly line from FROST query
    // collect locations and rervert latLons
    var latlngs = [];

    if (data.features.length <= 0) {
      throw new Error('No GeoJSON locations returned, check your query!');
    }

    data.features.forEach(function(feature) {
      latlngs.push(switchLatLon(feature.geometry.coordinates));
    });

    var latlonreverse = latlngs.reverse();

    // buld polyline from latlon reverse and add arrows
    var polyline = L.polyline(latlonreverse, {
        color: '#0683c2',
        lineCap: 'round',
        lineJoin: 'round',
        opacity: 0.9,
        weight: 3
      })
      .arrowheads({ yawn: 50, fill: false, size: '8%', frequency: 'allvertices', proportionalToTotal: false })
      .addTo(map);

    // Fit map to polyline bounds
    map.fitBounds(polyline.getBounds());
  })
  .catch(function(err) {
    // Handle errors during request
    console.log('Requesting ' + url + ' failed!');
    console.log(err);
  });

// switch coords
function switchLatLon(inpu) {
  var arr = [inpu[1], inpu[0]];
  return arr;
}