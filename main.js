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

map.on("click", "dc-museums", (event) => {
  const lngLat = event.lngLat;
  console.log(lngLat);
});

map.on("mouseenter", "dc-museums", () => {
  map.getCanvas().style.cursor = "default";
});

map.on("mouseleave", "dc-museums", () => {
  map.getCanvas().style.cursor = "pointer";
});
