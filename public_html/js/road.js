import * as THREE from 'three';

export function createRoad(scene) {
    const roadGeometry = new THREE.PlaneGeometry(10, 100);
    const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -40);
    scene.add(road);
}
