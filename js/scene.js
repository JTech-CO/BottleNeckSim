import { CONFIG } from './constants.js';

export const scene = new THREE.Scene();
const container = document.getElementById('canvas-container');

// Camera
let aspect = container.clientWidth / container.clientHeight;
export const camera = new THREE.OrthographicCamera(
    -CONFIG.VIEW_SIZE * aspect, CONFIG.VIEW_SIZE * aspect, 
    CONFIG.VIEW_SIZE, -CONFIG.VIEW_SIZE, 
    0.1, 2000
);
camera.position.set(100, 80, 100);
camera.lookAt(0, 0, 0);

// Renderer
export const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Controls
export const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.minZoom = 0.5;
controls.maxZoom = 3.0;

// Lights & Helpers
const gridHelper = new THREE.GridHelper(300, 20, 0x004050, 0x002030);
gridHelper.position.y = -40;
scene.add(gridHelper);

scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 0.7));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(50, 100, 50);
scene.add(dirLight);
const backLight = new THREE.DirectionalLight(0x445566, 0.5);
backLight.position.set(-50, -50, -100);
scene.add(backLight);

// Resize Handler
window.addEventListener('resize', () => {
    aspect = container.clientWidth / container.clientHeight;
    camera.left = -CONFIG.VIEW_SIZE * aspect;
    camera.right = CONFIG.VIEW_SIZE * aspect;
    camera.top = CONFIG.VIEW_SIZE;
    camera.bottom = -CONFIG.VIEW_SIZE;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);

});
