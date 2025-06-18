import { createScene, createCamera, createRenderer } from './scene.js';
import { addLighting } from './lighting.js';
import { createStarfield } from './stars.js';
import { createHierarchy } from './folderView.js';
import { setupLayerControls } from './layerControls.js';

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();

addLighting(scene);
const animateStars = createStarfield(scene);

const layers = createHierarchy(scene);
setupLayerControls(camera, layers);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    animateStars();
    renderer.render(scene, camera);
}
animate();
