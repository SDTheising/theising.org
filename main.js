import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js'; // Ensure GLTFLoader.js is in the same folder or update the path accordingly

// Get the container element where the canvas should be added
const container = document.getElementById("canvas-container");

// Create the WebGL renderer and set its size to match the container
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);

// Append the renderer's canvas element to the container
container.appendChild(renderer.domElement);

// Set up a basic scene, camera, and a rotating cube (or load a model using GLTFLoader)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Example: Load a GLTF model (if you have a model file, otherwise this is just a placeholder)
// const loader = new GLTFLoader();
// loader.load('model.glb', function (gltf) {
//   scene.add(gltf.scene);
//   animate();
// }, undefined, function (error) {
//   console.error(error);
// });

// As a fallback, add a simple cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Animation loop to render the scene and rotate the cube
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
