// Creating the map object
let map = L.map("map", {
  center: [0, 0],
  zoom: 2,     
});

// Create the tile layer that will be the background of our map.    
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

// Get the data with d3.
d3.json(url).then((data)=> {
    console.log(data)
    let features = data.features
    features.forEach(feature => {
        let magnitude = feature.properties.mag 
        let coordinates =  feature.geometry.coordinates
        let depth = coordinates[2]    
       
         // Add markers to the map
        let marker = L.circleMarker([coordinates[1], coordinates[0]], {
        radius: magnitude*2.5,
        color: 'black',
        fillColor: markerColor(depth),
        fillOpacity: 1
      }).addTo(map);

      marker.bindPopup(`
      <div class="custom-popup">
        <b>Location:</b> ${feature.properties.place}<br>
        <b>Magnitude:</b> ${magnitude}<br>
        <b>Depth:</b> ${depth} km<br>
        <b>Date:</b> ${new Date(feature.properties.time).toLocaleDateString()}<br>
      </div>  
        `);

    });
});
// Create a function to define marker color based on depth
function markerColor(depth) {
    if (depth >= -10 && depth <= 10) {
        return 'yellow';
    } else if (depth <= 30) {
        return 'green';
    } else if (depth <= 50) {
        return 'blue';
    } else if (depth <= 70) {
        return 'purple';
    } else if (depth <= 90) {
        return 'red';
    } else {
        return 'brown';
    }
}

// Add legend
let legend = L.control({ position: 'bottomleft' });
legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<h4>Depth</h4>';
    div.innerHTML += '<i style="background: yellow"></i> -10 km - 10 km <br>';
    div.innerHTML += '<i style="background: green"></i> 10 km - 30 km <br>';
    div.innerHTML += '<i style="background: blue"></i> 30 km - 50 km <br>';
    div.innerHTML += '<i style="background: purple"></i> 50 km - 70 km <br>';
    div.innerHTML += '<i style="background: red"></i> 70 km - 90 km <br>';
    div.innerHTML += '<i style="background: brown"></i> 90+ km <br>';
    return div;
  };  

// Add legend to the map  
legend.addTo(map);