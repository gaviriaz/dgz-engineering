/**
 * DGZ Vision — Map Engine Controller
 */
import { playSciFiBlip } from './utils.js';

let map;
let mapLoaded = false;
let isIGACActive = false;
let isCadastreActive = false;
let isPowerActive = false;

const cadastreGeoJSON = {
    "type": "FeatureCollection",
    "features": [
        { "type": "Feature", "properties": { "predio": "001-A", "uso": "Residencial", "area": "120m²", "propietario": "J. Pérez", "avaluo": "$150M" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ -74.0721, 4.7110 ], [ -74.0725, 4.7110 ], [ -74.0725, 4.7114 ], [ -74.0721, 4.7114 ], [ -74.0721, 4.7110 ] ] ] } },
        { "type": "Feature", "properties": { "predio": "001-B", "uso": "Comercial", "area": "85m²", "propietario": "M. Gómez", "avaluo": "$210M" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ -74.0721, 4.7106 ], [ -74.0725, 4.7106 ], [ -74.0725, 4.7110 ], [ -74.0721, 4.7110 ], [ -74.0721, 4.7106 ] ] ] } },
        { "type": "Feature", "properties": { "predio": "002-A", "uso": "Lote Baldío", "area": "400m²", "propietario": "Distrito Capital", "avaluo": "$30M" }, "geometry": { "type": "Polygon", "coordinates": [ [ [ -74.0715, 4.7106 ], [ -74.0721, 4.7106 ], [ -74.0721, 4.7114 ], [ -74.0715, 4.7114 ], [ -74.0715, 4.7106 ] ] ] } }
    ]
};

const powerLinesGeoJSON = {
    "type": "FeatureCollection",
    "features": [
        { "type": "Feature", "properties": { "type": "HighVoltage", "voltage": "230kV", "status": "Active" }, "geometry": { "type": "LineString", "coordinates": [ [-74.0721, 4.7110], [-74.10, 4.75], [-74.15, 4.80] ] } },
        { "type": "Feature", "properties": { "type": "Substation", "name": "Bogota-Norte", "capacity": "500MW" }, "geometry": { "type": "Point", "coordinates": [-74.0721, 4.7110] } }
    ]
};

export function initMap(accessToken) {
    mapboxgl.accessToken = accessToken;
    map = new mapboxgl.Map({
        container: 'map-container',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-74.0721, 4.7110],
        zoom: 6,
        pitch: 45,
        bearing: 0,
        antialias: true,
        projection: 'globe'
    });

    map.on('style.load', () => {
        map.setFog({
            'color': 'rgb(186, 210, 235)',
            'high-color': 'rgb(36, 92, 223)',
            'horizon-blend': 0.02,
            'space-color': 'rgb(11, 11, 25)',
            'star-intensity': 0.6
        });

        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
        });
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
        mapLoaded = true;
        addCustomLayers();
    });

    return map;
}

export function addCustomLayers() {
    if (!map) return;
    
    // 1. Colombia Departamentos
    if (!map.getSource('colombia-departamentos')) {
        map.addSource('colombia-departamentos', {
            type: 'geojson',
            data: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/COL.geo.json'
        });
    }
    if (!map.getLayer('col-layer')) {
        map.addLayer({
            id: 'col-layer',
            type: 'line',
            source: 'colombia-departamentos',
            paint: { 'line-color': '#00E5FF', 'line-width': 2, 'line-opacity': 0.6 }
        });
        map.addLayer({
            id: 'col-fill',
            type: 'fill',
            source: 'colombia-departamentos',
            paint: { 'fill-color': '#9D4EDD', 'fill-opacity': 0.1 }
        });
    }

    // 2. Earthquakes
    if (!map.getSource('earthquakes')) {
        map.addSource('earthquakes', {
            type: 'geojson',
            data: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson'
        });
    }
    if (!map.getLayer('earthquakes-glow')) {
        map.addLayer({
            id: 'earthquakes-glow',
            type: 'circle',
            source: 'earthquakes',
            paint: {
                'circle-radius': ['*', ['get', 'mag'], 4],
                'circle-color': '#ff4b2b',
                'circle-opacity': 0.2,
                'circle-blur': 1
            }
        });
        map.addLayer({
            id: 'earthquakes-core',
            type: 'circle',
            source: 'earthquakes',
            paint: {
                'circle-radius': ['*', ['get', 'mag'], 1.5],
                'circle-color': '#FFB400',
                'circle-opacity': 0.8,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#000'
            }
        });
    }

    // 3. SGC WMS
    if (isIGACActive) {
        if (!map.getSource('sgc-wms')) {
            map.addSource('sgc-wms', {
                'type': 'raster',
                'tiles': [
                    'https://srvags.sgc.gov.co/arcgis/services/Mapa_Geologico_Colombia_2015/Mapa_Geologico_Colombia_2015/MapServer/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=17,18,19,20,60&styles=,,,,'
                ],
                'tileSize': 256
            });
        }
        if (!map.getLayer('sgc-layer')) {
            map.addLayer({
                'id': 'sgc-layer',
                'type': 'raster',
                'source': 'sgc-wms',
                'paint': { 'raster-opacity': 0.8 }
            }, 'col-fill');
        }
    } else if (map.getLayer('sgc-layer')) {
        map.removeLayer('sgc-layer');
        map.removeSource('sgc-wms');
    }

    // 4. Cadastre
    if (isCadastreActive) {
        if (!map.getSource('cadastre')) {
            map.addSource('cadastre', {
                type: 'geojson',
                data: cadastreGeoJSON
            });
        }
        if (!map.getLayer('cadastre-fill')) {
            map.addLayer({
                id: 'cadastre-fill',
                type: 'fill',
                source: 'cadastre',
                paint: {
                    'fill-color': [
                        'match', ['get', 'uso'],
                        'Residencial', '#00E5FF',
                        'Comercial', '#FFB400',
                        '#9D4EDD'
                    ],
                    'fill-opacity': 0.4
                }
            });
            map.addLayer({
                id: 'cadastre-line',
                type: 'line',
                source: 'cadastre',
                paint: {
                    'line-color': '#FFF',
                    'line-width': 1
                }
            });
            map.flyTo({ center: [-74.0720, 4.7110], zoom: 16.5, speed: 1.5 });
        }
    } else {
        if (map.getLayer('cadastre-fill')) map.removeLayer('cadastre-fill');
        if (map.getLayer('cadastre-line')) map.removeLayer('cadastre-line');
        if (map.getSource('cadastre')) map.removeSource('cadastre');
    }

    // 5. Power Lines
    if (isPowerActive) {
        if (!map.getSource('power')) {
            map.addSource('power', { type: 'geojson', data: powerLinesGeoJSON });
        }
        if (!map.getLayer('power-lines')) {
            map.addLayer({
                id: 'power-lines-glow',
                type: 'line',
                source: 'power',
                paint: { 'line-color': '#39FF14', 'line-width': 6, 'line-blur': 4, 'line-opacity': 0.4 }
            });
            map.addLayer({
                id: 'power-lines',
                type: 'line',
                source: 'power',
                paint: { 'line-color': '#FFF', 'line-width': 2, 'line-opacity': 0.8 }
            });
            map.addLayer({
                id: 'power-points',
                type: 'circle',
                source: 'power',
                filter: ['==', '$type', 'Point'],
                paint: { 'circle-radius': 8, 'circle-color': '#39FF14', 'circle-stroke-width': 2, 'circle-stroke-color': '#FFF' }
            });
            
            animatePower();
        }
    } else {
        if (map.getLayer('power-lines')) map.removeLayer('power-lines');
        if (map.getLayer('power-lines-glow')) map.removeLayer('power-lines-glow');
        if (map.getLayer('power-points')) map.removeLayer('power-points');
        if (map.getSource('power')) map.removeSource('power');
    }
}

let powerStep = 0;
function animatePower() {
    if (!isPowerActive || !map) return;
    powerStep = (powerStep + 1) % 100;
    const opacity = 0.3 + (Math.sin(powerStep / 10) * 0.3);
    if (map.getLayer('power-lines-glow')) {
        map.setPaintProperty('power-lines-glow', 'line-opacity', opacity);
    }
    requestAnimationFrame(animatePower);
}

export function changeBasemap(type) {
    playSciFiBlip(500, 'square', 0.1);
    document.getElementById('btn-dark').classList.remove('active');
    document.getElementById('btn-sat').classList.remove('active');
    
    if (type === 'dark') {
        document.getElementById('btn-dark').classList.add('active');
        map.setStyle('https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json');
    } else {
        document.getElementById('btn-sat').classList.add('active');
        map.setStyle({
            'version': 8,
            'sources': {
                'esri-sat': {
                    'type': 'raster',
                    'tiles': ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
                    'tileSize': 256
                }
            },
            'layers': [{
                'id': 'satellite',
                'type': 'raster',
                'source': 'esri-sat',
                'minzoom': 0,
                'maxzoom': 22
            }]
        });
    }
}

export function toggleIGAC() {
    playSciFiBlip(700, 'sawtooth', 0.15);
    isIGACActive = !isIGACActive;
    const btn = document.getElementById('btn-igac');
    if (isIGACActive) btn.classList.add('active');
    else btn.classList.remove('active');
    addCustomLayers();
}

export function toggleCadastre() {
    playSciFiBlip(800, 'square', 0.1);
    isCadastreActive = !isCadastreActive;
    const btn = document.getElementById('btn-cadastre');
    if (isCadastreActive) btn.classList.add('active');
    else btn.classList.remove('active');
    addCustomLayers();
}

export function togglePowerLayer() {
    playSciFiBlip(900, 'sine', 0.2);
    isPowerActive = !isPowerActive;
    const btn = document.getElementById('btn-power');
    if (isPowerActive) btn.classList.add('active');
    else btn.classList.remove('active');
    addCustomLayers();
}

export function isMapLoaded() { return mapLoaded; }
export function getMap() { return map; }
