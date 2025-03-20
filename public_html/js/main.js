import { createScene, createCamera, createRenderer } from './scene.js';
import { addLighting } from './lighting.js';
import { createRoad } from './road.js';
import { createFolders } from './folders.js';
import { setupControls } from './controls.js';
import { createStarfield } from './stars.js';

// Create the scene, camera, and renderer
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();

// Add elements
addLighting(scene);
//createRoad(scene);
const folders = createFolders(scene);
setupControls(camera, folders);
const animateStars = createStarfield(scene);


// Handle Resizing
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    animateStars();
    renderer.render(scene, camera);
}
animate();
