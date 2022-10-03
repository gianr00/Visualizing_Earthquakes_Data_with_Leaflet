//====================================================================================================
// Create the Earthquake Visualization
// © 2022 Rosie Gianan
//====================================================================================================

//===================================
//? Malvern PA: center: center: [40.036217, -75.513809]
// Creating the map object
var myMap = L.map("map", {
  center: [40.036217, -75.513809],
  zoom: 4
});
//???-----
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
//??-----

// Load the GeoJSON data.
var geoEarthquakeDataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Getting our GeoJSON data ---------------------
d3.json(geoEarthquakeDataURL).then(function (data) {


  let earthquakeData = data.features;


//----------------------------------------------------------------------------------------------------
function createMapFeatures(earthquakeData) {
  console.log("createMap earthquakeData:", earthquakeData);

  //----------------------------------------------------------------------------------------------------
  // create layer group for earthquake data
  //----------------------------------------------------------------------------------------------------
  L.geoJson(earthquakeData, {
    pointToLayer: pointToLayer: function(layer, latlng) {
        return L.circleMarker(latlng);
      },
  onEachFeature: function (feature, layer) {
      layer.bindPopup("<h1>" + feature.properties.place + "</h1> <hr> <h2>" + feature.properties.mag + "</h2>");
  }).addTo(myMap);

  

  //----------------------------------------------------------------------------------------------------
  function getMarkerColor(depth) {
    switch (true) {
      case (depth <= 10):
        return "#ffffb2";
      case (depth <= 30):
        return "#fed976";
      case (depth <= 50):
        return "#feb24c";
      case (depth <= 70):
        return "#fd8d3c";
      case (depth <= 90):
        return "#fc4e2a";
      default:
        return "#e31a1c";
    }
  };


};
            });
// © 2022 Rosie Gianan ===============================================================================
