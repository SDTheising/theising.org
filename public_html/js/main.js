import { createScene, createCamera, createRenderer } from './scene.js';
import { addLighting } from './lighting.js';
import { createRoad } from './road.js';
import { createStarfield } from './stars.js';
import { setupControls } from './controls.js';
import { createPages } from './pages.js';
import { createLines } from './lines.js'; // Import lines

// Create the scene, camera, and renderer
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();

// Add elements
addLighting(scene);
//createRoad(scene);
setupControls(camera);
const animateStars = createStarfield(scene);

// ✅ Generate Boxes & Draw 90° Bent Connection Lines
createPages(scene).then((pageBoxes) => {
    createLines(scene, pageBoxes); // Connect related pages
    setupControls(camera, pageBoxes); // Make them clickable
});

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
