/**
 * DGZ Vision — Main Entry Point
 */
import { initMap, changeBasemap, toggleIGAC, toggleCadastre, togglePowerLayer } from './map-engine.js';
import { togglePanel, initMouseDrag, onFeatureHover } from './ui-controller.js';
import { initVision, initVisionElements, getCurrentGestureState } from './gestures.js';

// 1. Mapbox Configuration
const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN_HERE';

document.addEventListener('DOMContentLoaded', () => {
    // 2. Initialize Map
    const map = initMap(MAPBOX_TOKEN);

    // 3. Initialize Vision Elements
    const elements = {
        video: document.querySelector('.input_video'),
        canvas: document.querySelector('.output_canvas'),
        ctx: document.querySelector('.output_canvas').getContext('2d'),
        cursor: document.getElementById('cyber-cursor'),
        statusText: document.getElementById('vision-status'),
        gestureFeedback: document.getElementById('gesture-status')
    };
    initVisionElements(elements);

    // 4. Global Map Events
    map.on('mousemove', (e) => {
        const state = getCurrentGestureState();
        if (state === "NONE" || state === "POINTER") {
            onFeatureHover(e.point.x, e.point.y);
        }
    });

    // 5. Canvas Resize
    const canvas = elements.canvas;
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 6. Expose functions to window (for legacy onclick attributes)
    window.togglePanel = togglePanel;
    window.initMouseDrag = initMouseDrag;
    window.changeBasemap = changeBasemap;
    window.toggleIGAC = toggleIGAC;
    window.toggleCadastre = toggleCadastre;
    window.togglePowerLayer = togglePowerLayer;
    window.initVision = initVision;
});
