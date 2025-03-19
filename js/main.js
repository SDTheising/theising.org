import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Setup Scene, Camera, and Renderer
const container = document.getElementById("canvas-container");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10); // Start slightly above the road
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Handle Window Resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// Road (Just a large stretched plane)
const roadGeometry = new THREE.PlaneGeometry(10, 100);
const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
road.position.set(0, 0, -40); // Positioned downward so it looks like a road
scene.add(road);

// Create Wireframe Folder Objects
const folderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const folders = [];
for (let i = 0; i < 5; i++) {
    const folderGeometry = new THREE.BoxGeometry(2, 2, 2);
    const folder = new THREE.Mesh(folderGeometry, folderMaterial);
    folder.position.set(Math.random() * 6 - 3, 1, -10 - i * 10); // Spread along the path
    scene.add(folder);
    folders.push(folder);
}

// Raycaster for detecting clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Handle Click Events
window.addEventListener("click", (event) => {
    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(folders);

    if (intersects.length > 0) {
        console.log("Folder clicked:", intersects[0].object);
        alert("Opening folder: " + intersects[0].object.position.z);
        // You can add logic to animate the camera, load content, etc.
    }
});

// Handle Scrolling to Move Camera Forward
window.addEventListener("wheel", (event) => {
    camera.position.z -= event.deltaY * 0.01; // Move forward/backward
    camera.position.z = Math.max(camera.position.z, -50); // Limit movement
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
