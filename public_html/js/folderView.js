import * as THREE from 'three';
import { siteTree } from './siteTree.js';

export function createHierarchy(scene) {
    // Increased spacing so deeper layers aren't visible when focused on a parent
    const layerSpacing = 30;
    const layers = [];

    function addNodes(nodes, depth = 0, parentX = 0) {
        if (!layers[depth]) {
            const g = new THREE.Group();
            g.position.z = -depth * layerSpacing;
            scene.add(g);
            layers[depth] = g;
        }
        nodes.forEach((node, index) => {
            const size = node.type === 'folder' ? 3 : 2;
            const color = node.type === 'folder' ? 0x0077ff : 0x777777;
            const geometry = new THREE.BoxGeometry(size, size, size);
            const material = new THREE.MeshStandardMaterial({ color });
            const mesh = new THREE.Mesh(geometry, material);
            const offset = index - (nodes.length - 1) / 2;
            mesh.position.x = parentX + offset * (size + 5);
            mesh.userData.node = node;
            layers[depth].add(mesh);
            if (node.children) {
                addNodes(node.children, depth + 1, mesh.position.x);
            }
        });
    }

    addNodes(siteTree.children, 0);
    return layers;
}