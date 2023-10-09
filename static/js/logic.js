<script>
let map;

document.addEventListener("DOMContentLoaded", () => {
    initializeMap();
    fetchAndPlotEarthquakeData();
    addLegend();
});

function initializeMap() {
    map = L.map('map').setView([20, 0], 2); // Initialize the map variable.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

function fetchAndPlotEarthquakeData() {
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
    $.getJSON(url, (data) => {
        plotEarthquakeData(data);
    });
}

function plotEarthquakeData(data) {
    L.geoJson(data, {
        pointToLayer: (feature, latlng) => {
            const magnitude = feature.properties.mag;
            const depth = feature.geometry.coordinates[2];
            const place = feature.properties.place;
            const time = new Date(feature.properties.time).toLocaleString();
            const geojsonMarkerOptions = getMarkerOptions(magnitude, depth);
            const marker = L.circleMarker(latlng, geojsonMarkerOptions);
            marker.bindPopup(`<strong>Place:</strong> ${place}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth}<br><strong>Time:</strong> ${time}`);
            return marker;
        }
    }).addTo(map);
}

function getMarkerOptions(magnitude, depth) {
    return {
        radius: magnitude * 5,
        fillColor: getColor(depth),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
}

function getColor(depth) {
    return depth > 300 ? '#800026' :
           depth > 250 ? '#BD0026' :
           depth > 200 ? '#E31A1C' :
           depth > 150 ? '#FC4E2A' :
           depth > 100 ? '#FD8D3C' :
           depth > 50  ? '#FEB24C' :
           depth > 20  ? '#FED976' :
                        '#FFEDA0';
}

function addLegend() {
    const legend = L.control({ position: 'bottomright' });
    
    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'info legend');
        const depths = [0, 20, 50, 100, 150, 200, 250, 300];
        const labels = [];

        for (let i = 0; i < depths.length; i++) {
            const from = depths[i];
            const to = depths[i + 1] ? depths[i + 1] : '300+';
            labels.push(
                `<i style="background:${getColor(from + 1)}"></i> ${from} &ndash; ${to}`
            );
        }

        div.innerHTML = labels.join('<br>');
        return div;
    };

    legend.addTo(map);
}
</script>
