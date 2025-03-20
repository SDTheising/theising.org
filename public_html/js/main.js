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
<<<<<<< Updated upstream
//createRoad(scene);
const folders = createFolders(scene);
setupControls(camera, folders);
const animateStars = createStarfield(scene);

=======
createRoad(scene);
const animateStars = createStarfield(scene);

// ✅ Ensure `setupControls` Runs Only After GLB Models Are Loaded
createPages(scene).then((pageObjects) => {
    if (!pageObjects || pageObjects.length === 0) {
        console.warn("No page objects were created! Make sure the GLB model is correctly loaded.");
        return;
    }

    console.log("Page objects loaded:", pageObjects);

    createLines(scene, pageObjects); // Connect related pages
    setupControls(camera, pageObjects); // Now it's safe to use pageObjects
});
>>>>>>> Stashed changes

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
