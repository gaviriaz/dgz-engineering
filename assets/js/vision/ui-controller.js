/**
 * DGZ Vision — UI interaction Controller
 */
import { playSciFiBlip } from './utils.js';
import { isMapLoaded, getMap } from './map-engine.js';

let activeDragPanel = null;
let dragOffset = { x: 0, y: 0 };

export function togglePanel(btnElement) {
    playSciFiBlip(600, 'sine', 0.05);
    const content = btnElement.nextElementSibling;
    const icon = btnElement.querySelector('.toggle-icon');
    content.classList.toggle('collapsed');
    icon.classList.toggle('rotated');
}

export function initMouseDrag(e, panel) {
    e.stopPropagation();
    activeDragPanel = panel;
    
    const rect = panel.getBoundingClientRect();
    panel.style.position = 'fixed';
    panel.style.left = rect.left + 'px';
    panel.style.top = rect.top + 'px';
    panel.style.width = rect.width + 'px';
    panel.style.margin = '0';
    
    dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
    
    panel.classList.add('is-dragging');
    
    document.addEventListener('mousemove', onMouseDrag);
    document.addEventListener('mouseup', stopMouseDrag);
}

function onMouseDrag(e) {
    if (!activeDragPanel) return;
    activeDragPanel.style.left = (e.clientX - dragOffset.x) + 'px';
    activeDragPanel.style.top = (e.clientY - dragOffset.y) + 'px';
}

function stopMouseDrag() {
    if (activeDragPanel) activeDragPanel.classList.remove('is-dragging');
    activeDragPanel = null;
    document.removeEventListener('mousemove', onMouseDrag);
    document.removeEventListener('mouseup', stopMouseDrag);
}

export function onFeatureHover(x, y) {
    if (!isMapLoaded()) return;
    const map = getMap();
    
    let features = [];
    try {
        const layersToQuery = [];
        if (map.getLayer('earthquakes-core')) layersToQuery.push('earthquakes-core');
        if (map.getLayer('col-fill')) layersToQuery.push('col-fill');
        if (map.getLayer('cadastre-fill')) layersToQuery.push('cadastre-fill');
        
        if (layersToQuery.length > 0) {
            features = map.queryRenderedFeatures([x, y], { layers: layersToQuery });
        }
    } catch (err) {
        console.warn("Query rendering error", err);
        return;
    }
    
    const tooltip = document.getElementById('spatial-tooltip');
    
    if (features.length > 0) {
        const f = features[0];
        tooltip.style.display = 'block';
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
        
        const ttId = document.getElementById('tt-id');
        const ttContent = document.getElementById('tt-content');

        if (f.layer.id === 'earthquakes-core') {
            const mag = parseFloat(f.properties.mag).toFixed(1);
            const place = f.properties.place;
            const date = new Date(f.properties.time).toLocaleString();
            ttId.innerText = "SISMO [USGS]";
            ttContent.innerHTML = `
                <div class="data-row"><span class="data-label">Magnitud</span><span class="data-val" style="color:#ff4b2b;">${mag} M</span></div>
                <div class="data-row"><span class="data-label">Epicentro</span><span class="data-val">${place.split(' of ').pop()}</span></div>
                <div class="data-row"><span class="data-label">Timestamp</span><span class="data-val">${date}</span></div>
            `;
        } else if (f.layer.id === 'col-fill') {
            const name = f.properties.name || "Territorio Nacional";
            ttId.innerText = "CAPA [COL]";
            ttContent.innerHTML = `
                <div class="data-row"><span class="data-label">Provincia</span><span class="data-val" style="color:var(--accent-purple);">${name}</span></div>
                <div class="data-row"><span class="data-label">Soberanía</span><span class="data-val">Autónoma</span></div>
                <div class="data-row"><span class="data-label">Resolución</span><span class="data-val">Alta (LADM-COL)</span></div>
            `;
        } else if (f.layer.id === 'cadastre-fill') {
            ttId.innerText = "PREDIO [" + f.properties.predio + "]";
            ttContent.innerHTML = `
                <div class="data-row"><span class="data-label">Uso</span><span class="data-val" style="color:var(--accent-cyan);">${f.properties.uso}</span></div>
                <div class="data-row"><span class="data-label">Área</span><span class="data-val">${f.properties.area}</span></div>
                <div class="data-row"><span class="data-label">Propietario</span><span class="data-val">${f.properties.propietario}</span></div>
                <div class="data-row"><span class="data-label">Avalúo</span><span class="data-val" style="color:var(--accent-gold);">${f.properties.avaluo}</span></div>
            `;
        }
    } else {
        tooltip.style.display = 'none';
    }
}
