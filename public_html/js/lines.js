import * as THREE from 'three';

export function createLines(scene, pageBoxes) {
    const lines = [];
    const lineMaterial = new THREE.LineBasicMaterial({ transparent: true, color: 0xffffff, linewidth: 1, opacity: 0.3});

    const boxWidth = 2; // Adjust if necessary (half box width is 1)

    for (let i = 0; i < pageBoxes.length; i++) {
        for (let j = i + 1; j < pageBoxes.length; j++) {
            const pageA = pageBoxes[i];
            const pageB = pageBoxes[j];

            // Only connect similar pages
            if (pageA.url.includes(pageB.url) || pageB.url.includes(pageA.url)) {
                pageA.connections.push(pageB);
                pageB.connections.push(pageA);

                const start = pageA.box.position.clone();
                const end = pageB.box.position.clone();

                // Step 1: Move along Z-axis first (halfway to target)
                let firstBend = new THREE.Vector3(start.x, start.y, (start.z + end.z) / 2);

                // Step 2: Calculate minimum X movement (at least half a box width)
                let minXShift = boxWidth / 2;
                let bendX = end.x > start.x ? start.x + minXShift : start.x - minXShift;

                // Step 3: Adjust X further if needed to ensure a clear path
                let secondBend = new THREE.Vector3(bendX, start.y, firstBend.z);

                // Step 4: Final stretch along Z to the destination
                let finalPoint = new THREE.Vector3(bendX, start.y, end.z);

                // Step 5: Create the final path (Start → Bend1 → Bend2 → End)
                const points = [start, firstBend, secondBend, finalPoint, end];
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, lineMaterial);

                scene.add(line);
                lines.push(line);
            }
        }
    }

    return lines;
}
