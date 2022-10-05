//====================================================================================================
// Create the Earthquakes Visualization
// © 2022 Rosie Gianan
//====================================================================================================

// create the Base Layer with a light background
var grayScaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

// create the Base Layer with an outdoor background
var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "outdoors-v9",
  accessToken: API_KEY
});

// create the Base Layer with a satellite background
var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "satellite-streets-v9",
  accessToken: API_KEY
});

// Load the GeoJSON data.
var geoEarthquakeDataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicPlatesDataURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

// Getting our GeoJSON data 
d3.json(geoEarthquakeDataURL).then(function (data) {
  // console.log("data:", data);
  // console.log("data.features:", data.features);
  let earthquakeData = data.features;

  d3.json(tectonicPlatesDataURL).then(function (data2) {
    // console.log("data2:", data2);
    // console.log("data2.features:", data2.features);

    let tectonicPlatesData = data2.features;

    //call function createMapFeatures passing the earthquakeData and tectonicPlatesData
    createMapFeatures(earthquakeData, tectonicPlatesData);
  })
});

//----------------------------------------------------------------------------------------------------
// createMapFeatures() - create the map features using the earthquakeData
//----------------------------------------------------------------------------------------------------
function createMapFeatures(earthquakeData, tectonicPlatesData) {
  // console.log("createMapFeatures earthquakeData:", earthquakeData);
  // console.log("createMapFeatures tectonicPlatesData:", tectonicPlatesData);

  //--------------------------------------------------------------------------------------------------
  // set_pointToLayer_attributes() - set the attributes for each layer 
  //--------------------------------------------------------------------------------------------------
  function set_pointToLayer_attributes(feature, latlng) {
    let radius = (feature.properties.mag) * 4;
    let depth = feature.geometry.coordinates[2];
    let color = setMarkerColor(depth);

    let markerAttributes = {
      radius: radius,
      fillColor: color,
      color: "darkgreen",
      weight: .75,
      opacity: 2,
      fillOpacity: 1
    }
    return L.circleMarker(latlng, markerAttributes);
  };

  //--------------------------------------------------------------------------------------------------
  // setMarkerColor() - set the marker color based on earthquake depth
  //--------------------------------------------------------------------------------------------------
  function setMarkerColor(depth) {
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

  //--------------------------------------------------------------------------------------------------
  // set_onEachFeature_attributes() - set the attributes for each feature
  //--------------------------------------------------------------------------------------------------
  function set_onEachFeature_attributes(feature, layer) {
    // console.log("set_onEachFeature_attributes feature.properties.mag: ", feature.properties.mag)
    // Giving each feature a popup with information that's relevant to it
    layer.bindPopup("<p>Magnitude: " + feature.properties.mag + "<br>" +
      "Location : " + feature.properties.place + "<br>" +
      "Depth    : " + feature.geometry.coordinates[2] + "<br></p>");
  };

  //create layer groups for the overlay layers
  var earthquakesMapLayer = L.layerGroup();
  var tectonicPlatesMaplayer = L.layerGroup();

  //--------------------------------------------------------------------------------------------------
  // create layer group for earthquake data
  //--------------------------------------------------------------------------------------------------
  L.geoJson(earthquakeData, {
    pointToLayer: set_pointToLayer_attributes,
    onEachFeature: set_onEachFeature_attributes     // This is called on each feature
  }).addTo(earthquakesMapLayer);

  //----------------------------------------------------------------------------------------------------
  // create layer group for tectonicPlatesData
  //----------------------------------------------------------------------------------------------------
  // console.log("tectonicPlatesData:", tectonicPlatesData);
  L.geoJson(tectonicPlatesData, {
    fillOpacity: 0,
    color: "red"
  }).addTo(tectonicPlatesMaplayer);

  //----------------------------------------------------------------------------------------------------
  // create the basemap list
  //----------------------------------------------------------------------------------------------------
  var baseMaps = {
    "Satellite": satelliteMap,
    "Gray Scale": grayScaleMap,
    "Outdoors": outdoorsMap
  };

  //----------------------------------------------------------------------------------------------------
  // Creating the map object using satellite and earthquake maps on initial load
  //----------------------------------------------------------------------------------------------------
  var myMap = L.map("map", {
    center: [40.036217, -75.513809],
    zoom: 4,
    layers: [satelliteMap]
  });

  //----------------------------------------------------------------------------------------------------
  // create the overlay object 
  //----------------------------------------------------------------------------------------------------
  var overlayMaps = {
    "Tectonic Plates": tectonicPlatesMaplayer.addTo(myMap),
    "Earthquakes": earthquakesMapLayer.addTo(myMap),
  }

  //----------------------------------------------------------------------------------------------------
  // create tthe control layer 
  //----------------------------------------------------------------------------------------------------
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  //--------------------------------------------------------------------------------------------------
  // Add legend to the map
  //--------------------------------------------------------------------------------------------------
  // Set up the legend.
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function (myMap) {
    let div = L.DomUtil.create("div", "info legend"),
      depths = [-10, 10, 30, 50, 70, 90],
      labels = [];

    labels.push("<h7>Depths</h7><br>");
    for (let i = 0; i < depths.length; i++) {
      labels.push(
        '<li style="background:' + setMarkerColor(depths[i] + 1) + '">' +
        depths[i] + (depths[i + 1] ? '-' + depths[i + 1] + '<br>' : '+') + '</li>');
    }

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);
};

// © 2022 Rosie Gianan ===============================================================================
