import * as THREE from 'three';

export function createFolders(scene) {
    const folderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const folders = [];

    for (let i = 0; i < 5; i++) {
        const folderGeometry = new THREE.BoxGeometry(2, 2, 2);
        const folder = new THREE.Mesh(folderGeometry, folderMaterial);
        folder.position.set(Math.random() * 6 - 3, 1, -10 - i * 10);
        scene.add(folder);
        folders.push(folder);
    }

    return folders;
}
