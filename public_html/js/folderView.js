import * as THREE from 'three';
import { siteTree } from './siteTree.js';

export function createHierarchy(scene) {
    // Increased spacing so deeper layers aren't visible when focused on a parent
    const layerSpacing = 30;
    const layers = [];
    const linesGroup = new THREE.Group();
    scene.add(linesGroup);

    function addNodes(nodes, depth = 0, parentX = 0, parentMesh = null) {
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
            // Position children behind their parent and spread them horizontally
            // so they don't overlap with each other
            mesh.position.x = parentX + offset * (size + 1.5);
            mesh.position.y = 0;
            mesh.userData.node = node;
            layers[depth].add(mesh);

            if (parentMesh) {
                const start = parentMesh.getWorldPosition(new THREE.Vector3());
                const end = mesh.getWorldPosition(new THREE.Vector3());
                const bendZ = start.z - layerSpacing / 2;
                const points = [
                    start,
                    new THREE.Vector3(start.x, start.y, bendZ),
                    new THREE.Vector3(end.x, end.y, bendZ),
                    end
                ];
                const geom = new THREE.BufferGeometry().setFromPoints(points);
                const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
                const line = new THREE.Line(geom, lineMat);
                linesGroup.add(line);
            }
            if (node.children) {
                addNodes(node.children, depth + 1, mesh.position.x, mesh);
            }
        });
    }

    addNodes(siteTree.children, 0, 0, null);
    return { layers, linesGroup };
}