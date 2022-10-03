//====================================================================================================
// Create the Earthquake Visualization
// © 2022 Rosie Gianan
//====================================================================================================


// Creating the map object
var myMap = L.map("map", {
  center: [40.036217, -75.513809],
  zoom: 4
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

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
    pointToLayer: function(layer, latlng) {
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
 
      // Set up the legend.
      let legend = L.control({ position: "bottomright" });
      legend.onAdd = function (myMap) {
        let div = L.DomUtil.create("div", "info legend"),
          depths = [-10, 10, 30, 50, 70, 90],
         
         
        labels = [];
          
      var legendInfo = "<h7>Depths</h7><br>";
      div.innerHTML = legendInfo;
  
    
      labels.push('<li style="background: #ffffb2"<span>-10-10</span></li>');
      labels.push('<li style="background: #fed976"<span>10-30</span></li>');
      labels.push('<li style="background: #feb24c"<span>30-50</span></li>');
      labels.push('<li style="background: #fd8d3c"<span>50-70</span></li>');
      labels.push('<li style="background: #fc4e2a"<span>70-90</span></li>');
      labels.push('<li style="background: #e31a1c"<span>90+</span></li>')

     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
     return div;
     
     // Adding the legend to the map
     legend.addTo(myMap);
     // end of legend
   };

};
});
// © 2022 Rosie Gianan ===============================================================================
