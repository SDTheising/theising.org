import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Create scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 10); // Start position

const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 1.5 : 1);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// Road (A long plane to simulate the path)
const roadGeometry = new THREE.PlaneGeometry(10, 100);
const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
road.position.set(0, 0, -40);
scene.add(road);

// Wireframe Folder Objects
const folderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const folders = [];
for (let i = 0; i < 5; i++) {
    const folderGeometry = new THREE.BoxGeometry(2, 2, 2);
    const folder = new THREE.Mesh(folderGeometry, folderMaterial);
    folder.position.set(Math.random() * 6 - 3, 1, -10 - i * 10);
    scene.add(folder);
    folders.push(folder);
}

// Raycaster for detecting clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Handle Clicks (Mouse & Touch)
window.addEventListener("pointerdown", (event) => {
    const touch = event.touches ? event.touches[0] : event;
    mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(folders);

    if (intersects.length > 0) {
        console.log("Folder clicked:", intersects[0].object);
        alert("Opening folder: " + intersects[0].object.position.z);
    }
});

// ✅ Fixed: Handle Touch Swipe (Mobile - Now Works in Firefox!)
let touchStartY = 0;
let touchStartX = 0;
let isDragging = false;

window.addEventListener("touchstart", (event) => {
    touchStartY = event.touches[0].clientY;
    touchStartX = event.touches[0].clientX;
    isDragging = true;
}, { passive: false }); // Important: Allows preventDefault()

window.addEventListener("touchmove", (event) => {
    if (!isDragging) return;
    
    event.preventDefault(); // 🔥 Stops the page from scrolling! (Now works in Firefox)

    const touchEndY = event.touches[0].clientY;
    const touchEndX = event.touches[0].clientX;
    const deltaY = touchStartY - touchEndY;
    const deltaX = touchStartX - touchEndX;

    camera.position.z -= deltaY * 0.05; // Move forward/backward
    camera.position.z = Math.max(camera.position.z, -50);

    camera.rotation.y -= deltaX * 0.005; // Slightly rotate with side swipes

    touchStartY = touchEndY;
    touchStartX = touchEndX;
}, { passive: false });

window.addEventListener("touchend", () => {
    isDragging = false;
});

// Gyroscope Support (Mobile)
window.addEventListener("deviceorientation", (event) => {
    const tiltX = event.beta;
    const tiltY = event.gamma;

    camera.rotation.x = THREE.MathUtils.degToRad(-tiltX * 0.2);
    camera.rotation.y = THREE.MathUtils.degToRad(tiltY * 0.3);
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
    renderer.render(scene, camera);
}
animate();
