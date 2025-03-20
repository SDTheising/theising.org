import * as THREE from 'three';
import { getPages } from './fetchPages.js';

export async function createPages(scene) {
    const pages = await getPages(); // Fetch URLs of subdomains/pages
    const pageMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: false });

    const pageBoxes = [];
    const roadWidth = 8;
    const roadStartZ = -10;
    const spacingZ = 10;

    pages.forEach((page, index) => {
        const pageGeometry = new THREE.BoxGeometry(2, 2, 2);
        const pageBox = new THREE.Mesh(pageGeometry, pageMaterial);

        // Position boxes along the road
        pageBox.position.set(
            (Math.random() - 0.5) * roadWidth, // Random x within road width
            1, // Slightly above the road
            roadStartZ - index * spacingZ // Spread along the road
        );

        scene.add(pageBox);
        pageBoxes.push({ box: pageBox, url: page, connections: [] });
    });

    return pageBoxes;
}
