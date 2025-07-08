import * as THREE from 'three';

export function addLighting(scene) {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
}
