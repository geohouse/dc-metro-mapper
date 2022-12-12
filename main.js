/*
Line colors used in Mapbox (same as on Metro map)
Red: hsl(359, 95%, 58%)
Yellow: hsl(45, 100%, 61%)
Green: hsl(144, 83%, 37%)
Orange: hsl(29, 100%, 58%)
Silver: hsl(162, 7%, 63%)
Blue: hsl(203, 100%, 38%)

*/

mapboxgl.accessToken =
  "pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2wxMTlrNDh6MThmbzNxbzBoMjhtNjlubCJ9.EMR9N5vvQAEuDHRa38ADvQ";

const map = new mapboxgl.Map({
  style: "mapbox://styles/geohouse/clb8cf3on000615p5v6mxm48w",
  center: [-77.03101, 38.88697],
  zoom: 14,
  pitch: 20,
  bearing: 0,
  container: "map",
  antialias: true,
});

map.on("load", () => {
  const layers = map.getStyle().layers;
  const labelLayerId = layers.find(
    (layer) => layer.type === "symbol" && layer.layout["text-field"]
  ).id;

  map.addLayer(
    {
      id: "add-3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 15,
      paint: {
        "fill-extrusion-color": "#aaa",
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "height"],
        ],
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "min_height"],
        ],
        "fill-extrusion-opacity": 0.6,
      },
    },
    labelLayerId
  );
});

const metroDetailsDiv = document.querySelector("#metro-details");

// These are the links to the different museums.
// The keys are the museum names as present in the data layer
const infoLinks = {
  "U.S. Capitol Visitor Center": "https://www.visitthecapitol.gov",
  "United States Botanic Garden": "https://www.usbg.gov/",
  "National Museum of American History": "https://americanhistory.si.edu/",
  "National Museum of the American Indian": "https://americanindian.si.edu/",
  "National Air and Space Museum": "https://airandspace.si.edu/",
  "National Museum of African American History and Culture":
    "https://nmaahc.si.edu/",
  "National Museum of Natural History": "https://naturalhistory.si.edu/",
  "National Gallery of Art Sculpture Garden": "https://www.nga.gov/",
  "National Gallery of Art - West Building": "https://www.nga.gov/",
  "National Gallery of Art - East Building": "https://www.nga.gov/",
  "National Portrait Gallery": "https://www.npg.si.edu/",
};

map.on("click", "dc-museums", (event) => {
  const lngLat = event.lngLat;
  console.log(lngLat);
  const museumPoint = map.queryRenderedFeatures(event.point);
  console.log(museumPoint);
  const museumLabel = museumPoint[0].properties.LABEL;
  const metroStations = map.queryRenderedFeatures({
    layers: ["metro-stations"],
  });
  const metroStations_turf = turf.featureCollection(metroStations);
  const nearestMetroStation = turf.nearestPoint(
    [lngLat.lng, lngLat.lat],
    metroStations_turf
  );
  console.log(event);
  console.log(museumLabel);
  console.log(metroStations);
  console.log(metroStations_turf);
  console.log(nearestMetroStation);

  // string representation of 1 or more closest
  // lines separated by commas parsed to array (safe if only 1
  // line is listed and no ',' is present)
  let closestLines = nearestMetroStation.properties.LINE.split(",");

  metroDetailsDiv.innerHTML = `<p><strong>${museumLabel}</strong></p>`;
  if (Object.keys(infoLinks).includes(museumLabel)) {
    metroDetailsDiv.innerHTML += `<a href=${infoLinks[museumLabel]}>Museum website</a>`;
  }
  metroDetailsDiv.innerHTML += `<p>The nearest Metro stop is: <em>${nearestMetroStation.properties.NAME}</em></p>`;
  metroDetailsDiv.innerHTML += `<p>Serving the following Metro line(s):</p>`;
  for (let line of closestLines) {
    metroDetailsDiv.innerHTML += `<div class="metro-line">
    <div class= "metro-line-color ${line.toLowerCase()}"></div>
    <p class="metro-line-name">${line}</p>
    </div>`;
  }
  //metroDetailsDiv.innerHTML += `<p>${nearestMetroStation.properties.LINE}</p>`;
});

map.on("mouseenter", "dc-museums", () => {
  map.getCanvas().style.cursor = "default";
});

map.on("mouseleave", "dc-museums", () => {
  map.getCanvas().style.cursor = "pointer";
});
