//====================================================================================================
// Create the Earthquake Visualization
// © 2022 Rosie Gianan
//====================================================================================================



// // create the Base Layer with a satellite background
//? to do: temp url is used
var earthquakesMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  id: "mapbox.satellite"
});
 var satelliteMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
   id: "mapbox.satellite"
 });

 var grayScaleMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
 });
 //?? using mapbox.naip temp
 var outdoorsMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
   id: "mapbox.naip"
 });


// Creating the map object using satellite and earthquak maps on initial load
var myMap = L.map("map", {
  center: [40.036217, -75.513809],
  zoom: 4,
   layers: [satelliteMap, earthquakesMap]
});

//create layer groups for the overlay layers
var earthquakesMapLayer = L.layerGroup();
var tectonicPlatesMaplayer = L.layerGroup();


// create the basemap list
var baseMaps = {
  "Satellite": satelliteMap,
  "Gray Scale": grayScaleMap
};


// create the overlay object ?????
var overlayMaps = {
  "Tectonic Plates": tectonicPlatesMaplayer,
  "Earthquakes": earthquakesMapLayer
}


// Load the GeoJSON data.
var geoEarthquakeDataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var tectonicPlatesDataURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";



// Getting our GeoJSON data ---------------------
d3.json(geoEarthquakeDataURL).then(function (data) {

  let earthquakeData = data.features;

//----------------------------------------------------------------------------------------------------
function createMapFeatures(earthquakeData) {

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
        d3.json(tectonicPlatesDataURL).then(function (data2) {
     

          let tectonicPlatesData = data2.features;
          //call function createMap passing earthquakeData
          createMapFeatures(earthquakeData, tectonicPlatesData);

        })
        //----------------------------------------------------------------------------------------------------
        // create layer group for   tectonicPlatesData
        //----------------------------------------------------------------------------------------------------
        L.geoJson(tectonicPlatesData, {
            
        fillOpacity: 0,
        color: "red"
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
// end of function createMap()-----------------------------------------------------------

// © 2022 Rosie Gianan ===============================================================================
