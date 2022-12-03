mapboxgl.accessToken =
  "pk.eyJ1IjoiZ2VvaG91c2UiLCJhIjoiY2w3bXE2NGM0MGE0eTNxcGJ5Z3JkejB6dyJ9.kiYEnwXtZejWr5rCvexouQ";

const map = new mapboxgl.Map({
  style: "mapbox://styles/mapbox/light-v11",
  center: [-74, 40],
  zoom: 15.5,
  pitch: 45,
  bearing: -17.6,
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
