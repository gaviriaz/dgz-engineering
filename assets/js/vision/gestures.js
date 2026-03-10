/**
 * DGZ Vision — Hand Gesture Detection & Smoothing
 */
import { playSciFiBlip } from './utils.js';
import { isMapLoaded, getMap } from './map-engine.js';
import { onFeatureHover } from './ui-controller.js';

let videoElement, canvasElement, canvasCtx, cursor, statusText, gestureFeedback;
let isPinching = false;
let dragStartMapCenter = null;
let dragStartCursorPos = null;
let activeDragPanel = null;
let dragOffset = { x: 0, y: 0 };
let currentGestureState = "NONE";
let lastZoomActionTime = 0;
let frameCount = 0;
let lastFPSUpdate = Date.now();
let currentFPS = 60;

// Smoothing logic
let smoothedX = window.innerWidth / 2;
let smoothedY = window.innerHeight / 2;
let lastMappedX = smoothedX;
let lastMappedY = smoothedY;

const BASE_SMOOTHING = 0.15;
const MAX_SMOOTHING = 0.6;
const VELOCITY_SENSITIVITY = 0.05;
const basePinchThreshold = 0.06;

export function initVisionElements(elements) {
    videoElement = elements.video;
    canvasElement = elements.canvas;
    canvasCtx = elements.ctx;
    cursor = elements.cursor;
    statusText = elements.statusText;
    gestureFeedback = elements.gestureFeedback;
}

export async function initVision() {
    statusText.innerText = 'CARGANDO MODELO...';
    
    try {
        const hands = new Hands({locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }});
        
        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.70,
            minTrackingConfidence: 0.70
        });
        
        hands.onResults(onResults);
        
        const camera = new Camera(videoElement, {
            onFrame: async () => {
                await hands.send({image: videoElement});
            },
            width: 1280,
            height: 720
        });
        
        await camera.start();
        document.getElementById('btn-start').style.display = 'none';
        statusText.style.color = '#00E5FF';
        statusText.innerText = 'ONLINE / TRACKING';
        cursor.style.display = 'block';

    } catch (err) {
        console.error(err);
        statusText.innerText = 'ERROR ACCESO CÁMARA';
        statusText.style.color = '#ff4b2b';
    }
}

function setGestureState(newState, text, color) {
    if (currentGestureState !== newState) {
        currentGestureState = newState;
        if(newState === 'DRAG') playSciFiBlip(400, 'square', 0.15);
        else if(newState === 'ZOOM_IN') playSciFiBlip(1200, 'sine', 0.1);
        else if(newState === 'ZOOM_OUT') playSciFiBlip(600, 'sine', 0.1);
        else if(newState === 'RESET') playSciFiBlip(300, 'sawtooth', 0.3);
        else if(newState === 'POINTER') playSciFiBlip(900, 'sine', 0.05);
    }
    gestureFeedback.innerText = text;
    gestureFeedback.style.color = color;
}

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: 'rgba(0, 229, 255, 0.4)', lineWidth: 3});
        drawLandmarks(canvasCtx, landmarks, {color: '#9D4EDD', lineWidth: 1, radius: 4});
        
        const wrist = landmarks[0];
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const indexMcp = landmarks[5];
        const midTip = landmarks[12];
        const midMcp = landmarks[9];
        const ringTip = landmarks[16];
        const ringMcp = landmarks[13];
        const pinkyTip = landmarks[20];
        const pinkyMcp = landmarks[17];
        
        const dist = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
        
        const isIndexOpen = dist(indexTip, wrist) > dist(indexMcp, wrist) + 0.05;
        const isMidOpen = dist(midTip, wrist) > dist(midMcp, wrist) + 0.05;
        const isRingOpen = dist(ringTip, wrist) > dist(ringMcp, wrist) + 0.05;
        const isPinkyOpen = dist(pinkyTip, wrist) > dist(pinkyMcp, wrist) + 0.05;
        
        const handScale = dist(wrist, indexMcp) * 5; 
        const adaptivePinchThreshold = basePinchThreshold * handScale;

        const rawX = (1 - indexTip.x) * window.innerWidth;
        const rawY = indexTip.y * window.innerHeight;
        
        const velocity = dist({x: rawX, y: rawY}, {x: lastMappedX, y: lastMappedY}) / 100;
        const dynamicSmoothing = Math.min(MAX_SMOOTHING, BASE_SMOOTHING + (velocity * VELOCITY_SENSITIVITY));
        
        smoothedX = smoothedX + (rawX - smoothedX) * dynamicSmoothing;
        smoothedY = smoothedY + (rawY - smoothedY) * dynamicSmoothing;
        
        lastMappedX = rawX;
        lastMappedY = rawY;
        
        cursor.style.left = `${smoothedX}px`;
        cursor.style.top = `${smoothedY}px`;
        
        const tiltX = (smoothedY / window.innerHeight - 0.5) * 20;
        const tiltY = (smoothedX / window.innerWidth - 0.5) * -20;
        document.querySelectorAll('.vision-glass-panel').forEach(p => {
             if (!p.classList.contains('is-dragging')) {
                 p.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
             }
        });

        const pinchDist = dist(indexTip, thumbTip);
        const pinchThreshold = adaptivePinchThreshold;
        const depthZ = Math.round(indexTip.z * 1000);
        const now = Date.now();
        const map = getMap();
        
        // GESTURES
        if (!isIndexOpen && !isMidOpen && !isRingOpen && !isPinkyOpen) {
           setGestureState('RESET', `ACCION: RESET VISTA [Z:${depthZ}]`, "var(--status-err)");
           if (isMapLoaded() && now - lastZoomActionTime > 2000) {
               map.flyTo({ center: [-74.0721, 4.7110], zoom: 6, bearing: 0, pitch: 0 });
               lastZoomActionTime = now;
           }
           isPinching = false;
           cursor.classList.remove('pinching');
        }
        else if (isIndexOpen && isMidOpen && !isRingOpen && !isPinkyOpen) {
           setGestureState('ZOOM_IN', `ACCION: ZOOM IN (+) [Z:${depthZ}]`, "var(--accent-cyan)");
           cursor.classList.add('zooming');
           if (isMapLoaded() && now - lastZoomActionTime > 150) {
               map.zoomTo(map.getZoom() + 0.2, {duration: 150});
               lastZoomActionTime = now;
           }
           isPinching = false;
           cursor.classList.remove('pinching');
        }
        else if (isIndexOpen && isMidOpen && isRingOpen && isPinkyOpen && pinchDist > pinchThreshold) {
           setGestureState('ZOOM_OUT', `ACCION: ZOOM OUT (-) [Z:${depthZ}]`, "var(--accent-purple)");
           cursor.classList.add('zooming');
           if (isMapLoaded() && now - lastZoomActionTime > 150) {
               map.zoomTo(map.getZoom() - 0.2, {duration: 150});
               lastZoomActionTime = now;
           }
           isPinching = false;
           cursor.classList.remove('pinching');
        }
        else if (pinchDist < pinchThreshold) {
          setGestureState('DRAG', `ACCION: ARRASTRE [Z:${depthZ}]`, "#fff");
          
          if (!isPinching) {
            isPinching = true;
            cursor.classList.add('pinching');
            
            const elementUnder = document.elementFromPoint(smoothedX, smoothedY);
            if (elementUnder && elementUnder.closest('.vision-glass-panel')) {
                activeDragPanel = elementUnder.closest('.vision-glass-panel');
                activeDragPanel.classList.add('is-dragging');
                
                const rect = activeDragPanel.getBoundingClientRect();
                activeDragPanel.style.position = 'fixed';
                activeDragPanel.style.left = rect.left + 'px';
                activeDragPanel.style.top = rect.top + 'px';
                activeDragPanel.style.width = rect.width + 'px';
                activeDragPanel.style.margin = '0';
                
                dragOffset = {
                    x: smoothedX - rect.left,
                    y: smoothedY - rect.top
                };
            } else {
                activeDragPanel = null;
                dragStartMapCenter = map.getCenter();
                dragStartCursorPos = { x: smoothedX, y: smoothedY };
            }
          } else {
            if (activeDragPanel) {
                activeDragPanel.style.left = (smoothedX - dragOffset.x) + 'px';
                activeDragPanel.style.top = (smoothedY - dragOffset.y) + 'px';
            } else {
                const pixelDeltaX = dragStartCursorPos.x - smoothedX;
                const pixelDeltaY = dragStartCursorPos.y - smoothedY;
                
                if(isMapLoaded()) {
                    const zoomFactor = Math.pow(2, map.getZoom());
                    const lngDelta = (pixelDeltaX / 512) * (360 / zoomFactor);
                    const latDelta = -(pixelDeltaY / 512) * (360 / zoomFactor) * Math.cos(dragStartMapCenter.lat * Math.PI / 180);
                    
                    map.setCenter([
                        dragStartMapCenter.lng + lngDelta,
                        dragStartMapCenter.lat + latDelta
                    ]);
                }
            }
          }
        } 
        else {
          setGestureState('POINTER', `TRACKING: PUNTERO [Z:${depthZ}]`, "rgba(255,255,255,0.5)");
          
          if (isPinching) {
            isPinching = false;
            cursor.classList.remove('pinching');
            if(activeDragPanel) {
                activeDragPanel.classList.remove('is-dragging');
                activeDragPanel = null;
            }
            
            const elementUnderCursor = document.elementFromPoint(smoothedX, smoothedY);
            if(elementUnderCursor && (elementUnderCursor.tagName === 'BUTTON' || elementUnderCursor.closest('button'))) {
                const btn = elementUnderCursor.tagName === 'BUTTON' ? elementUnderCursor : elementUnderCursor.closest('button');
                btn.click();
                playSciFiBlip(1000, 'square', 0.05);
            }
          } else {
            document.querySelectorAll('button').forEach(btn => btn.classList.remove('hovered'));
            const element = document.elementFromPoint(smoothedX, smoothedY);
            if(element && (element.tagName === 'BUTTON' || element.closest('button'))) {
                const btn = element.tagName === 'BUTTON' ? element : element.closest('button');
                btn.classList.add('hovered');
            }
          }
        }
        
        if (currentGestureState === 'POINTER') {
             onFeatureHover(smoothedX, smoothedY);
        } else {
             document.getElementById('spatial-tooltip').style.display = 'none';
        }
        
    } else {
        if (isPinching) {
          isPinching = false;
          cursor.classList.remove('pinching');
        }
        frameCount++;
        const currentTime = Date.now();
        if (currentTime - lastFPSUpdate > 1000) {
            currentFPS = frameCount;
            frameCount = 0;
            lastFPSUpdate = currentTime;
        }
        gestureFeedback.innerText = `ESPERANDO INPUT... | FPS:${currentFPS}`;
    }
    canvasCtx.restore();
}

export function getCurrentGestureState() { return currentGestureState; }
