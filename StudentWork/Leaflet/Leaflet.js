//#####################
// Interaction values
//#####################
var data = new Werteliste(location.search);

var frostBaseURL = data.URL;
var thingIotID = data.ID;
var startTime = data.timeStart;
var endTime = data.timeEnd;
var measurementType = data.ID19measurement; // This is only needed for ID=19, as there are multiple measurements available

//#####################
// Map view
//#####################
var map = L.map('mapid').setView([48.137, 11.575], 10);


//#####################
// Interaction data
//#####################
var legend;
var sensorName;
var observName1;
var observName2;
var measurementID1;
var measurementID2;

// Color Marker + Lines:
var getColorClass1;
var getColorClass2;
var getColorClass3;
// For Charts:
var thresholdObs1;
var thresholdObs2;
var unitObs1;
var unitObs2;
var textDatePlace;
var thresholdObs1Class1;
var thresholdObs1Class2;
var thresholdObs1Class3;
var thresholdObs2Class1;
var thresholdObs2Class2;
var thresholdObs2Class3;
var textObs1Class1;
var textObs1Class2;
var textObs1Class3;
var textObs2Class1;
var textObs2Class2;
var textObs2Class3;
var colObs1Class1;
var colObs1Class2;
var colObs1Class3;
var colObs2Class1;
var colObs2Class2;
var colObs2Class3;

// Number of HistoricalLocations for Map Content
// For ID=17 it will be changed to 'nHistoricalLocations = 37;' later
var nHistoricalLocations = 999;


if (thingIotID == 15) { //Markus Arduino
  sensorName = "Markus Arduino";
  observName1 = "Temperature";
  observName2 = "Humidity";
  measurementID1 = 13;
  measurementID2 = 14;
  chart1Border1 = 13.3;
  chart1Border2 = 13.6;
  chart2Border1 = 67;
  document.getElementById('legend').innerHTML = '<img src="../Data/LegendeMarkus.png" height="100px"/>';
  document.getElementById('header').innerHTML = '<h1 style="margin-bottom:0;">Arduino Trajectory in Munich</h1>';
  map.setView([48.1855, 11.517], 17);

  // Color Marker + Lines:
  getColorClass1 = "rgb(0,0,255)";
  getColorClass2 = "rgb(255,136,0)";
  getColorClass3 = "rgb(255,0,0)";;
  // For Charts:
  thresholdObs1 = 20;
  thresholdObs2 = 100;
  unitObs1 = "°C";
  unitObs2 = "%";
  textDatePlace = "22nd of December, 2020 in Munich, Germany";
  thresholdObs1Class1 = 13.3;
  thresholdObs1Class2 = 13.6;
  thresholdObs1Class3 = 30;
  thresholdObs2Class1 = 50;
  thresholdObs2Class2 = 68;
  thresholdObs2Class3 = 100;
  textObs1Class1 = "Cold";
  textObs1Class2 = "Medium";
  textObs1Class3 = "Warm";
  textObs2Class1 = "Dry";
  textObs2Class2 = "Medium";
  textObs2Class3 = "Wet";
  colObs1Class1 = "rgba(0,0,136, 0.1)";
  colObs1Class2 = "rgba(255,136,0, 0.1)";
  colObs1Class3 = "rgba(255,0,0, 0.1)";
  colObs2Class1 = "rgba(182,182,182,0.4)";
  colObs2Class2 = "rgba(200,228,191,0.4)";
  colObs2Class3 = "rgba(255,227,136,0.4)";
}
if (thingIotID == 16) { //Smartphone Robin
  sensorName = "Robin's Phone";
  observName1 = "Microphone";
  observName2 = "Luxometer";
  measurementID1 = 17;
  measurementID2 = 16;
  chart1Border1 = 30;
  chart1Border2 = 60;
  chart2Border1 = 50;
  document.getElementById('header').innerHTML = '<h1 style="margin-bottom:0;">Smartphone Trajectory in Munich</h1>';
  map.setView([48.1855, 11.473], 17);
  textDatePlace = "7th of December, 2020 in Munich, Germany";
}
if (thingIotID == 17) { //Smartphone Yifan
  nHistoricalLocations = 37;
  sensorName = "Yifan's Phone";
  observName1 = "Microphone";
  observName2 = "Luxometer";
  measurementID1 = 18;
  measurementID2 = 19;
  chart1Border1 = 30;
  chart1Border2 = 60;
  chart2Border1 = 50;
  document.getElementById('header').innerHTML = '<h1 style="margin-bottom:0;">Smartphone Trajectory in Wuhan</h1>';
  map.setView([30.53, 114.36], 13);
  textDatePlace = "8th of December, 2020 in Wuhan, China";
}
if (thingIotID == 16 || thingIotID == 17) {
  document.getElementById('legend').innerHTML = '<img src="../Data/LegendePhone.png" height="100px"/>';
  // Color Marker + Lines:
  getColorClass1 = "#008800";
  getColorClass2 = "#ff8800";
  getColorClass3 = "#FF0000";;
  // For Charts:
  thresholdObs1 = 100;
  thresholdObs2 = 500;
  unitObs1 = "dB";
  unitObs2 = "Lux";
  thresholdObs1Class1 = 30;
  thresholdObs1Class2 = 60;
  thresholdObs1Class3 = 150;
  thresholdObs2Class1 = 50;
  thresholdObs2Class2 = 350;
  thresholdObs2Class3 = 15000;
  textObs1Class1 = "Quite";
  textObs1Class2 = "Bearable";
  textObs1Class3 = "Unbearable";
  textObs2Class1 = "Indoor";
  textObs2Class2 = "Outdoor, cloudy";
  textObs2Class3 = "Outdoor, sunny";
  colObs1Class1 = "rgba(0,136,0, 0.1)";
  colObs1Class2 = "rgba(255,136,0, 0.1)";
  colObs1Class3 = "rgba(255,0,0, 0.1)";
  colObs2Class1 = "rgba(182,182,182,0.4)";
  colObs2Class2 = "rgba(200,228,191,0.4)";
  colObs2Class3 = "rgba(255,227,136,0.4)";
}
if (thingIotID == 19) { //Tobi's Arduino
  sensorName = "Tobi's Arduino";
  document.getElementById('header').innerHTML = '<h1 style="margin-bottom:0;">Arduino Trajectory in Pfaffenhofen</h1>';
  map.setView([48.5309, 11.5154], 16);
  
  if (startTime === "2021-02-04T16:13:05Z") { // Which day you want to display?
    textDatePlace = "4th of February, 2021 in Pfaffenhofen, Germany";

    // What measurement is chosen?
    if (measurementType == "ID19Temp") {
      observName1 = "Temperature";
      observName2 = "Humidity";
      measurementID1 = 21;
      measurementID2 = 22;
      document.getElementById('legend').innerHTML = '<img src="../Data/Tobi_2021-02-04_Temp.png" height="100px"/>';
      // Color Marker + Lines:
      getColorClass1 = "rgb(0,0,255)";
      getColorClass2 = "rgb(255,136,0)";
      getColorClass3 = "rgb(255,0,0)";;
      // For Charts:
      thresholdObs1 = 20; // Top end of Highchart 1
      thresholdObs2 = 80; // Top end of Highchart 2
      unitObs1 = "°C";
      unitObs2 = "%";

      thresholdObs1Class1 = 7; // first value when the background color of the highcharts changes
      thresholdObs1Class2 = 9; // value when the background color of the highcharts changes
      thresholdObs1Class3 = 30; // top end of the background color
      thresholdObs2Class1 = 40;
      thresholdObs2Class2 = 60;
      thresholdObs2Class3 = 100;
      chart1Border1 = thresholdObs1Class1; // Borders where the text "Cold","Medium","Warm" changes
      chart1Border2 = thresholdObs1Class2;
      chart2Border1 = thresholdObs2Class1;
      //chart2Border2 = thresholdObs2Class2;
      textObs1Class1 = "Cold"; // text of the highchart classes
      textObs1Class2 = "Medium";
      textObs1Class3 = "Warm";
      textObs2Class1 = "Dry";
      textObs2Class2 = "Medium";
      textObs2Class3 = "Wet";
      colObs1Class1 = "rgba(0,0,136, 0.1)"; // color of the highchart classes
      colObs1Class2 = "rgba(255,136,0, 0.1)";
      colObs1Class3 = "rgba(255,0,0, 0.1)";
      colObs2Class1 = "rgba(182,182,182,0.4)";
      colObs2Class2 = "rgba(200,228,191,0.4)";
      colObs2Class3 = "rgba(255,227,136,0.4)";
    
    } else if (measurementType == "ID19Light") {
      observName1 = "Visible Light";
      observName2 = "Infrared Light";
      measurementID1 = 24;
      measurementID2 = 25;
      document.getElementById('legend').innerHTML = '<img src="../Data/Tobi_VisLight.png" height="100px"/>';
      // Color Marker + Lines:
      getColorClass1 = "rgb(0,0,255)";
      getColorClass2 = "rgb(255,136,0)";
      getColorClass3 = "rgb(255,0,0)";;
      // For Charts:
      thresholdObs1 = 300; // Top end of Highchart 1
      thresholdObs2 = 300; // Top end of Highchart 2
      unitObs1 = " Lux";
      unitObs2 = " Lux";

      thresholdObs1Class1 = 260; // first value when the background color of the highcharts changes
      thresholdObs1Class2 = 265; // value when the background color of the highcharts changes
      thresholdObs1Class3 = 300; // top end of the background color
      thresholdObs2Class1 = 260;
      thresholdObs2Class2 = 270;
      thresholdObs2Class3 = 300;
      chart1Border1 = thresholdObs1Class1; // Borders where the text "Cold","Medium","Warm" changes
      chart1Border2 = thresholdObs1Class2;
      chart2Border1 = thresholdObs2Class1;
      //chart2Border2 = thresholdObs2Class2;
      textObs1Class1 = "Dark"; // text of the highchart classes
      textObs1Class2 = "";
      textObs1Class3 = "Bright";
      textObs2Class1 = "Low";
      textObs2Class2 = "Moderate";
      textObs2Class3 = "High";
      colObs1Class1 = "rgba(0,0,136, 0.1)"; // color of the highchart classes
      colObs1Class2 = "rgba(255,136,0, 0.1)";
      colObs1Class3 = "rgba(255,0,0, 0.1)";
      colObs2Class1 = "rgba(182,182,182,0.4)";
      colObs2Class2 = "rgba(200,228,191,0.4)";
      colObs2Class3 = "rgba(255,227,136,0.4)";

    } else if (measurementType == "ID19PM") {
      observName1 = "Standardized Particulate Matter (< 10µm)";
      observName2 = "Standardized Particulate Matter (< 2.5µm)";
      measurementID1 = 29;
      measurementID2 = 28;
      document.getElementById('legend').innerHTML = '<img src="../Data/Tobi_PM.png" height="100px"/>';
      // Color Marker + Lines:
      getColorClass1 = "rgb(0,0,255)";
      getColorClass2 = "rgb(255,136,0)";
      getColorClass3 = "rgb(255,0,0)";;
      // For Charts:
      thresholdObs1 = 150; // Top end of Highchart 1
      thresholdObs2 = 150; // Top end of Highchart 2
      unitObs1 = "µg/m3";
      unitObs2 = "µg/m3";

      thresholdObs1Class1 = 20; // first value when the background color of the highcharts changes
      thresholdObs1Class2 = 40; // value when the background color of the highcharts changes
      thresholdObs1Class3 = 150; // top end of the background color
      thresholdObs2Class1 = 10;
      thresholdObs2Class2 = 20;
      thresholdObs2Class3 = 150;
      chart1Border1 = thresholdObs1Class1; // Borders where the text "Cold","Medium","Warm" changes
      chart1Border2 = thresholdObs1Class2;
      chart2Border1 = thresholdObs2Class1;
      //chart2Border2 = thresholdObs2Class2;
      textObs1Class1 = "Little Polluted"; // text of the highchart classes
      textObs1Class2 = "Polluted";
      textObs1Class3 = "Heavily Polluted";
      textObs2Class1 = "Little Polluted";
      textObs2Class2 = "Polluted";
      textObs2Class3 = "Heavily Polluted";
      colObs1Class1 = "rgba(0,0,136, 0.1)"; // color of the highchart classes
      colObs1Class2 = "rgba(255,136,0, 0.1)";
      colObs1Class3 = "rgba(255,0,0, 0.1)";
      colObs2Class1 = "rgba(182,182,182,0.4)";
      colObs2Class2 = "rgba(200,228,191,0.4)";
      colObs2Class3 = "rgba(255,227,136,0.4)";

    }


  } else if (startTime === "2021-02-05T13:35:21Z") {
    textDatePlace = "5th of February, 2021 in Pfaffenhofen, Germany";

    // What measurement is chosen?
    if (measurementType == "ID19Temp") {
      observName1 = "Temperature";
      observName2 = "Humidity";
      measurementID1 = 21;
      measurementID2 = 22;
      document.getElementById('legend').innerHTML = '<img src="../Data/Tobi_2021-02-05_Temp.png" height="100px"/>';
      // Color Marker + Lines:
      getColorClass1 = "rgb(0,0,255)";
      getColorClass2 = "rgb(255,136,0)";
      getColorClass3 = "rgb(255,0,0)";;
      // For Charts:
      thresholdObs1 = 20; // Top end of Highchart 1
      thresholdObs2 = 80; // Top end of Highchart 2
      unitObs1 = "°C";
      unitObs2 = "%";

      thresholdObs1Class1 = 12; // first value when the background color of the highcharts changes
      thresholdObs1Class2 = 15; // value when the background color of the highcharts changes
      thresholdObs1Class3 = 30; // top end of the background color
      thresholdObs2Class1 = 40;
      thresholdObs2Class2 = 60;
      thresholdObs2Class3 = 100;
      chart1Border1 = thresholdObs1Class1; // Borders where the text "Cold","Medium","Warm" changes
      chart1Border2 = thresholdObs1Class2;
      chart2Border1 = thresholdObs2Class1;
      //chart2Border2 = thresholdObs2Class2;
      textObs1Class1 = "Cold"; // text of the highchart classes
      textObs1Class2 = "Medium";
      textObs1Class3 = "Warm";
      textObs2Class1 = "Dry";
      textObs2Class2 = "Medium";
      textObs2Class3 = "Wet";
      colObs1Class1 = "rgba(0,0,136, 0.1)"; // color of the highchart classes
      colObs1Class2 = "rgba(255,136,0, 0.1)";
      colObs1Class3 = "rgba(255,0,0, 0.1)";
      colObs2Class1 = "rgba(182,182,182,0.4)";
      colObs2Class2 = "rgba(200,228,191,0.4)";
      colObs2Class3 = "rgba(255,227,136,0.4)";
    
    } else if (measurementType == "ID19Light") {
      observName1 = "Visible Light";
      observName2 = "Infrared Light";
      measurementID1 = 24;
      measurementID2 = 25;
      document.getElementById('legend').innerHTML = '<img src="../Data/Tobi_VisLight.png" height="100px"/>';
      // Color Marker + Lines:
      getColorClass1 = "rgb(0,0,255)";
      getColorClass2 = "rgb(255,136,0)";
      getColorClass3 = "rgb(255,0,0)";;
      // For Charts:
      thresholdObs1 = 300; // Top end of Highchart 1
      thresholdObs2 = 300; // Top end of Highchart 2
      unitObs1 = " Lux";
      unitObs2 = " Lux";

      thresholdObs1Class1 = 260; // first value when the background color of the highcharts changes
      thresholdObs1Class2 = 265; // value when the background color of the highcharts changes
      thresholdObs1Class3 = 300; // top end of the background color
      thresholdObs2Class1 = 260;
      thresholdObs2Class2 = 270;
      thresholdObs2Class3 = 300;
      chart1Border1 = thresholdObs1Class1; // Borders where the text "Cold","Medium","Warm" changes
      chart1Border2 = thresholdObs1Class2;
      chart2Border1 = thresholdObs2Class1;
      //chart2Border2 = thresholdObs2Class2;
      textObs1Class1 = "Dark"; // text of the highchart classes
      textObs1Class2 = "";
      textObs1Class3 = "Bright";
      textObs2Class1 = "Low";
      textObs2Class2 = "Moderate";
      textObs2Class3 = "High";
      colObs1Class1 = "rgba(0,0,136, 0.1)"; // color of the highchart classes
      colObs1Class2 = "rgba(255,136,0, 0.1)";
      colObs1Class3 = "rgba(255,0,0, 0.1)";
      colObs2Class1 = "rgba(182,182,182,0.4)";
      colObs2Class2 = "rgba(200,228,191,0.4)";
      colObs2Class3 = "rgba(255,227,136,0.4)";

    } else if (measurementType == "ID19PM") {
      observName1 = "Standardized Particulate Matter (< 10µm)";
      observName2 = "Standardized Particulate Matter (< 2.5µm)";
      measurementID1 = 29;
      measurementID2 = 28;
      document.getElementById('legend').innerHTML = '<img src="../Data/Tobi_PM.png" height="100px"/>';
      // Color Marker + Lines:
      getColorClass1 = "rgb(0,0,255)";
      getColorClass2 = "rgb(255,136,0)";
      getColorClass3 = "rgb(255,0,0)";;
      // For Charts:
      thresholdObs1 = 60; // Top end of Highchart 1
      thresholdObs2 = 60; // Top end of Highchart 2
      unitObs1 = "µg/m3";
      unitObs2 = "µg/m3";

      thresholdObs1Class1 = 20; // first value when the background color of the highcharts changes
      thresholdObs1Class2 = 40; // value when the background color of the highcharts changes
      thresholdObs1Class3 = 60; // top end of the background color
      thresholdObs2Class1 = 10;
      thresholdObs2Class2 = 20;
      thresholdObs2Class3 = 60;
      chart1Border1 = 0; // Borders where the text "Cold","Medium","Warm" changes
      chart1Border2 = thresholdObs1Class2;
      chart2Border1 = thresholdObs2Class1;
      //chart2Border2 = thresholdObs2Class2;
      textObs1Class1 = "Little Polluted"; // text of the highchart classes
      textObs1Class2 = "Polluted";
      textObs1Class3 = "Heavily Polluted";
      textObs2Class1 = "Little Polluted";
      textObs2Class2 = "Polluted";
      textObs2Class3 = "Heavily Polluted";
      colObs1Class1 = "rgba(0,0,136, 0.1)"; // color of the highchart classes
      colObs1Class2 = "rgba(255,136,0, 0.1)";
      colObs1Class3 = "rgba(255,0,0, 0.1)";
      colObs2Class1 = "rgba(182,182,182,0.4)";
      colObs2Class2 = "rgba(200,228,191,0.4)";
      colObs2Class3 = "rgba(255,227,136,0.4)";

    }
  }
  
}



//#####################
// Basemap
//#####################
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

var baseMaps = {
  "BaseMap": tileLayer
};

// Layer of markers
var markersGroup = new L.layerGroup();

var overlayMaps = {
  "Markers": markersGroup
};

L.control.layers(baseMaps, overlayMaps).addTo(map);


L.control.scale({
  position: 'bottomleft',
  maxWidth: '100',
  imperial: false
}).addTo(map);


//#####################
// Map content
//#####################
var timeIntervalFilter = '$filter=time%20gt%20' + startTime + '%20and%20time%20lt%20' + endTime;
// Build query
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
frostQuery += '$expand=Locations($select=location)&$top=' + nHistoricalLocations + '&$select=time&$resultFormat=GeoJSON&$orderby=time%20desc';
var url = frostBaseURL + frostQuery;


// collect locations and rervert latLons
var latlngs = [];
var latitude = [];
var longitude = [];
var timestamp = [];

// Fetch data from FROST
fetch(url)
  .then((resp) => resp.json())
  .then(function (data) {
    // Build poly line from FROST query

    if (data.features.length <= 0) {
      throw new Error('No GeoJSON returned, check your query!');
    }
    data.features.forEach(function (feature) {
      // Skip features with no geometry
      if (!feature.geometry) return;

      // Coords and other information
      var coords = switchLatLon(feature.geometry.coordinates);
      // var marker = L.marker(coords);
      latlngs.push(coords);
      latitude.push(Math.round(coords[0] * 1000000) / 1000000);
      longitude.push(Math.round(coords[1] * 1000000) / 1000000);
      timestamp.push(feature.properties.time);
    });

    ////////////////////////////////////////////////////////////////////////////
    // Query for measurement observations
    // Build query
    var timeIntervalFilter_1 = '$filter=phenomenonTime%20gt%20' + startTime + '%20and%20phenomenonTime%20lt%20' + endTime;
    var frostQuery_1 = '/Datastreams(' + measurementID1 + ')/Observations?';
    // Append time interval filter, if exists
    try {
      if (timeIntervalFilter_1) {
        frostQuery_1 += timeIntervalFilter_1;
        if (timeIntervalFilter_1.slice(-1) != '&') {
          frostQuery_1 += '&';
        }
      }
    } catch {
      // Do nothing if timeIntervalFilter is not defined
    }
    // append select
    frostQuery_1 += '$resultFormat=GeoJSON&$top=' + nHistoricalLocations + '&$orderby=phenomenonTime desc&$select=result';
    var url_1 = frostBaseURL + frostQuery_1;


    ////////////////////////////////////////////////////////////////////////////

    // Build query
    var timeIntervalFilter_2 = '$filter=phenomenonTime%20gt%20' + startTime + '%20and%20phenomenonTime%20lt%20' + endTime;
    var frostQuery_2 = '/Datastreams(' + measurementID2 + ')/Observations?';
    // Append time interval filter, if exists
    try {
      if (timeIntervalFilter_2) {
        frostQuery_2 += timeIntervalFilter_2;
        if (timeIntervalFilter_2.slice(-1) !== '&') {
          frostQuery_2 += '&';
        }
      }
    } catch {
      // Do nothing if timeIntervalFilter is not defined
    }
    // append select
    frostQuery_2 += '$resultFormat=GeoJSON&$top=' + nHistoricalLocations + '&$orderby=phenomenonTime desc&$select=result';
    var url_2 = frostBaseURL + frostQuery_2;

    var measurement1 = [];
    var measurement2 = [];

    async function fetchTwo(req1, req2) {
      try {
        let res1 = await fetch(req1);
        let res2 = await fetch(req2);
        let data1 = await res1.json();
        let data2 = await res2.json();
        if (data1.features.length <= 0) {
          throw new Error('No GeoJSON observation returned, check your query!');
        }
        data1.features.forEach(function (feature) {
          // Skip values with no result
          //if (!feature.properties.result) return;
          measurement1.push(Math.round(feature.properties.result * 100) / 100);

        });
        if (data2.features.length <= 0) {
          throw new Error('No GeoJSON observation returned, check your query!');
        }
        data2.features.forEach(function (feature) {
          // Skip values with no result
          //if (!feature.properties.result) return;
          measurement2.push(Math.round(feature.properties.result * 100) / 100);

        });

        //=====================================================================
        //=====================================================================
        //=====================================================================
        // Legend 
        /*
        var colores = [getColorClass1,getColorClass2,getColorClass3]
        var values = ['< 13.3', '13.3 - 13.6','> 13.6']
        var legend = L.control({ position: 'bottomright' })
        legend.onAdd = function (map) {
          var div = L.DomUtil.create('div', 'info legend');
          grades = [0, thresholdObs1Class1, thresholdObs1Class2];
          labels = [];
          div.innerHTML += '<strong>Temperature [°C]</strong>' + '<br>';
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length; i++) {
            div.innerHTML += '<i style="background:' + colores[i] + '"></i> ' + values[i] + '<br>';
          }
          return div;
        };
        legend.addTo(map);
        */
        //=====================================================================
        //=====================================================================
        //=====================================================================




        // coordinates and measurements of polylines
        var latlon = [];

        for (var i = 0; i <= timestamp.length - 1; i++) {
          latlon[0] = latlngs[i];
          latlon[1] = latlngs[i + 1];

          var lat = (latitude[i] + latitude[i + 1]) / 2;
          var lon = (longitude[i] + longitude[i + 1]) / 2;
          var colMea = (measurement1[i] + measurement1[i + 1]) / 2;

          lat = Math.round(lat * 1000000) / 1000000;
          lon = Math.round(lon * 1000000) / 1000000;

          colMea = Math.round(colMea * 100) / 100;

          var col = getColor(colMea);

          var latlonreverse = latlon.reverse();

          // buld polyline from latlon reverse and add arrows
          var polyline = L.polyline(latlonreverse, {
            color: col,
            lineCap: 'round',
            lineJoin: 'round',
            opacity: 0.8,
            weight: 4,
            smoothFactor: 20
          })
            .arrowheads({
              yawn: 50,
              fill: false,
              size: '15px',
              frequency: 'allvertices',
              color: col,
              opacity: 1
            })
            .addTo(map);

          // Min and max coordinates of our polylines
          var bounds = [
            [Math.min.apply(Math, latitude), Math.min.apply(Math, longitude)],
            [Math.max.apply(Math, latitude), Math.max.apply(Math, longitude)]];
          // Fit map to polyline bounds
          map.fitBounds(bounds);


          polyline.bindPopup("<h2><a> Name: " + sensorName + " (Thing #" + thingIotID + ")</a></h2>" +
            "<b> Coordinates: </b>" + lat + "° , " + lon + "°" + "<br>" +
            "<b>" + observName1 + " : </b>" + measurement1[i] + " " + unitObs1 + "<br>" +
            "<b>" + observName2 + " : </b>" + measurement2[i] + " " + unitObs2 + "<br><br>" +
            "<b> Movement from: </b>" + timestamp[timestamp.length - 1].split("-")[2].split("T")[0] + "." + timestamp[timestamp.length - 1].split("-")[1] + "." + timestamp[timestamp.length - 1].split("-")[0] + " - " + timestamp[timestamp.length - 1].split("T")[1].split(":")[0] + ":" + timestamp[timestamp.length - 1].split("T")[1].split(":")[1] + " UTC<br>" +
            "<b> Movement until: </b>" + timestamp[0].split("-")[2].split("T")[0] + "." + timestamp[0].split("-")[1] + "." + timestamp[0].split("-")[0] + " - " + timestamp[0].split("T")[1].split(":")[0] + ":" + timestamp[0].split("T")[1].split(":")[1] + " UTC<br>" +
            "<b> Time of observation: </b>" + "<t>" + timestamp[i].split("-")[2].split("T")[0] + "." + timestamp[i].split("-")[1] + "." + timestamp[i].split("-")[0] + " - " + timestamp[i].split("T")[1].split(":")[0] + ":" + timestamp[i].split("T")[1].split(":")[1] + " UTC<br>");



          // Marker and Popup  
          var marker = L.marker([latitude[i], longitude[i]]);

          marker.bindPopup("<h2><a> Name: " + sensorName + " (Thing #" + thingIotID + ")</a></h2>" +
            "<b> Coordinates: </b>" + lat + "° , " + lon + "°" + "<br>" +
            "<b>" + observName1 + " : </b>" + measurement1[i] + " " + unitObs1 + "<br>" +
            "<b>" + observName2 + " : </b>" + measurement2[i] + " " + unitObs2 + "<br><br>" +
            "<b> Movement from: </b>" + timestamp[timestamp.length - 1].split("-")[2].split("T")[0] + "." + timestamp[timestamp.length - 1].split("-")[1] + "." + timestamp[timestamp.length - 1].split("-")[0] + " - " + timestamp[timestamp.length - 1].split("T")[1].split(":")[0] + ":" + timestamp[timestamp.length - 1].split("T")[1].split(":")[1] + " UTC<br>" +
            "<b> Movement until: </b>" + timestamp[0].split("-")[2].split("T")[0] + "." + timestamp[0].split("-")[1] + "." + timestamp[0].split("-")[0] + " - " + timestamp[0].split("T")[1].split(":")[0] + ":" + timestamp[0].split("T")[1].split(":")[1] + " UTC<br>" +
            "<b> Time of observation: </b>" + "<t>" + timestamp[i].split("-")[2].split("T")[0] + "." + timestamp[i].split("-")[1] + "." + timestamp[i].split("-")[0] + " - " + timestamp[i].split("T")[1].split(":")[0] + ":" + timestamp[i].split("T")[1].split(":")[1] + " UTC<br>"
          ).addTo(markersGroup);
          map.addLayer(markersGroup);



          //////////////////////////////////////////////////////////////////////////////
          // Highcharts Graphs
          // Add X values
          timestamp.reverse();
          measurement1.reverse();
          measurement2.reverse();
          var timeLable = [];
          if (Math.max.apply(Math, measurement1) < thresholdObs1) {
            var yMax = thresholdObs1;
          } else {
            var yMax = Math.max.apply(Math, measurement1);
          }
          var measurement1Chart = Highcharts.map(measurement1, function (val, j) {
            timeLable[j] = timestamp[j].split("T")[1].split(":")[0] + ":" + timestamp[j].split("T")[1].split(":")[1]
            return [timeLable[j], val];
          });
          var measurement2Chart = Highcharts.map(measurement2, function (val, j) {
            return [timeLable[j], val];
          });


          Highcharts.chart('container1', {
            chart: {
              type: 'spline',
              scrollablePlotArea: {
                minWidth: 600,
                scrollPositionX: 1
              },
              backgroundColor: '#F2F2F2'
            },
            title: {
              text: observName1 + ' measurements',
              align: 'left'
            },
            subtitle: {
              text: textDatePlace,
              align: 'left'
            },
            xAxis: {
              title: {
                text: 'Time'
              },
              categories: timeLable,
              labels: {
                formatter: function () {
                  return this.value;
                }
              }
            },
            yAxis: {
              max: yMax,
              title: {
                text: unitObs1
              },
              minorGridLineWidth: 0,
              gridLineWidth: 0,
              alternateGridColor: null,
              plotBands: [{ //Quite
                from: 0, // Thresholds: www.who.int/docstore/peh/noise/Comnoise-1.pdf
                to: thresholdObs1Class1,
                color: colObs1Class1,
                label: {
                  text: textObs1Class1,
                  style: {
                    color: '#606060'
                  }
                }
              }, { // Bearable
                from: thresholdObs1Class1,
                to: thresholdObs1Class2,
                color: colObs1Class2,
                label: {
                  text: textObs1Class2,
                  style: {
                    color: '#606060'
                  }
                }
              }, { // Unbearable
                from: thresholdObs1Class2,
                to: thresholdObs1Class3,
                color: colObs1Class3,
                label: {
                  text: textObs1Class3,
                  style: {
                    color: '#606060'
                  }
                }
              }]
            },
            tooltip: {
              valueSuffix: unitObs1
            },
            plotOptions: {
              spline: {
                lineWidth: 4,
                states: {
                  hover: {
                    lineWidth: 5
                  }
                },
                marker: {
                  enabled: false
                },

              }
            },
            series: [{
              name: observName1 + ' Measurement',
              data: measurement1Chart
            }],
            navigation: {
              menuItemStyle: {
                fontSize: '10px'
              }
            }
          });

          /////////////////////////////////////////////////////////////////////////////
          if (Math.max.apply(Math, measurement2) < thresholdObs2) {
            var yMax = thresholdObs2;
          } else {
            var yMax = Math.max.apply(Math, measurement2);
          }
          Highcharts.chart('container2', {
            chart: {
              type: 'spline',
              scrollablePlotArea: {
                minWidth: 600,
                scrollPositionX: 1
              },
              backgroundColor: '#F2F2F2'
            },
            title: {
              text: observName2 + ' measurements',
              align: 'left'
            },
            subtitle: {
              text: textDatePlace,
              align: 'left'
            },
            xAxis: {
              title: {
                text: 'Time'
              },
              categories: timeLable,
              labels: {
                formatter: function () {
                  return this.value;
                }
              }
            },
            yAxis: {
              max: yMax,
              title: {
                text: unitObs2
              },
              minorGridLineWidth: 0,
              gridLineWidth: 0,
              alternateGridColor: null,
              plotBands: [{ // Indooor
                from: 0, // Thresholds: www.en.wikipedia.org/wiki/Daylight
                to: thresholdObs2Class1,
                color: colObs2Class1,
                label: {
                  text: textObs2Class1,
                  style: {
                    color: '#606060'
                  }
                }
              }, { // Outdoor, cloudy
                from: thresholdObs2Class1,
                to: thresholdObs2Class2,
                color: colObs2Class2,
                label: {
                  text: textObs2Class2,
                  style: {
                    color: '#606060'
                  }
                }
              }, { // Outdoor, sunny
                from: thresholdObs2Class2,
                to: thresholdObs2Class3,
                color: colObs2Class3,
                label: {
                  text: textObs2Class3,
                  style: {
                    color: '#606060'
                  }
                }
              }]
            },
            tooltip: {
              valueSuffix: unitObs2
            },
            plotOptions: {
              spline: {
                lineWidth: 4,
                states: {
                  hover: {
                    lineWidth: 5
                  }
                },
                marker: {
                  enabled: false
                },

              }
            },
            series: [{
              name: observName2 + ' Measurement',
              data: measurement2Chart
            }],
            navigation: {
              menuItemStyle: {
                fontSize: '10px'
              }
            }
          });
          timestamp.reverse();
          measurement1.reverse();
          measurement2.reverse();
        };
      } catch (e) {
        console.log("Oops, error", e);
      }
    }

    fetchTwo(url_1, url_2);

  })
  .catch(function (err) {
    // Handle errors during request
    console.log('Requesting ' + url + ' failed!');
    console.log(err);
  });





//#####################
// Functions
//#####################

function getColor(d) {
  return d > thresholdObs1Class2 ? getColorClass3 :
    d > thresholdObs1Class1 ? getColorClass2 :
      getColorClass1;
}

// switch coords
function switchLatLon(inpu) {
  var arr = [inpu[1], inpu[0]];
  return arr;
}


function Werteliste(querystring) {
  if (querystring == '') return;
  var wertestring = querystring.slice(1);
  var paare = wertestring.split("&");
  var paar, name, wert;
  for (var i = 0; i < paare.length; i++) {
    paar = paare[i].split("=");
    name = paar[0];
    wert = paar[1];
    name = unescape(name).replace("+", " ");
    wert = unescape(wert).replace("+", " ");
    this[name] = wert;
  }
}



function disableButtonID(value) {
  if (value != "noOption") {
    document.getElementById('buttonIDs').disabled = false;
  } else {
    document.getElementById('buttonIDs').disabled = true;
  }
  
}

function displayNext(id_Button) {
  if (id_Button === "buttonIDs") {
    document.getElementById('ID').disabled = true;
    document.getElementById('FrostInput').readOnly = true;
    document.getElementById('buttonIDs').disabled = true;
    
    if (document.getElementById('ID').value === "15") {
      document.getElementById('optionID15Start').disabled = false; // Show only the options possible for this ID
      document.getElementById('optionID15End').disabled = false;
      document.getElementById('submitButton').disabled = false; // Enable the Submit-button "Get Data"
    
    } else if (document.getElementById('ID').value === "16") {
      document.getElementById('optionID16Start').disabled = false;
      document.getElementById('optionID16End').disabled = false;
      document.getElementById('submitButton').disabled = false;
    
    } else if (document.getElementById('ID').value === "17") {
      document.getElementById('optionID17Start').disabled = false;
      document.getElementById('optionID17End').disabled = false;
      document.getElementById('submitButton').disabled = false;
    
    } else if (document.getElementById('ID').value === "19") {
      document.getElementById('optionID19Start_1').disabled = false; // Show only the options possible for this ID
      document.getElementById('optionID19End_1').disabled = false;
      document.getElementById('optionID19Start_2').disabled = false;
      document.getElementById('optionID19End_2').disabled = false;

      document.getElementById('buttonForDrop19').style.display = "block"; // As there are numerous measurements available for ID=19, one can press ">>" instead of "Get Data"
    }

    document.getElementById('timeSet').style.display = "block"; // Show the timeSet to be able to select start- and end-time
    
  }

  if (id_Button === 'buttonForDrop19') {  // For ID=19 one can choose between different measurements to display
    document.getElementById('drop19Set').style.display = "block";
    document.getElementById('submitButton').disabled = false; // After choosing the desired measurement for ID=19, one will be able to submit
  }
  
}

function resetForm() {
  document.getElementById('ID').disabled = false;
  document.getElementById('FrostInput').readOnly = false;
  document.getElementById('timeSet').style.display = "none";

  document.getElementById('optionID15Start').disabled = true;
  document.getElementById('optionID15End').disabled = true;
  document.getElementById('optionID16Start').disabled = true;
  document.getElementById('optionID16End').disabled = true;
  document.getElementById('optionID17Start').disabled = true;
  document.getElementById('optionID17End').disabled = true;
  document.getElementById('optionID19Start_1').disabled = true;
  document.getElementById('optionID19End_1').disabled = true;
  document.getElementById('optionID19Start_2').disabled = true;
  document.getElementById('optionID19End_2').disabled = true;
}
