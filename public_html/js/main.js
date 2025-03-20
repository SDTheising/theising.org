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
createRoad(scene);
const animateStars = createStarfield(scene);

// ✅ Ensure `setupControls` Runs Only After Models Are Loaded
createPages(scene).then((pageObjects) => {
    if (!pageObjects || pageObjects.length === 0) {
        console.warn("No page objects were created!");
        return;
    }
    console.log("Page objects loaded:", pageObjects);

    // ✅ Ensure all models are actually defined
    const validObjects = pageObjects.filter(p => p.model);
    if (validObjects.length === 0) {
        console.error("No valid models found in pageObjects!");
        return;
    }

    createLines(scene, validObjects); // Connect related pages
    setupControls(camera, validObjects); // Now it's safe to use pageObjects
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
