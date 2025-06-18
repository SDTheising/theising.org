import * as THREE from 'three';

export function setupLayerControls(camera, layers) {
    let currentDepth = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function showLayer(depth) {
        if (depth < 0 || depth >= layers.length) return;
        camera.position.z = layers[depth].position.z + 10;
        currentDepth = depth;
    }

    window.addEventListener('pointerdown', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(layers[currentDepth].children);
        if (intersects.length > 0) {
            const node = intersects[0].object.userData.node;
            if (node.children) {
                showLayer(currentDepth + 1);
            } else if (node.url) {
                window.location.href = node.url;
            }
        }
    });

    const backBtn = document.getElementById('backButton');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (currentDepth > 0) showLayer(currentDepth - 1);
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            showLayer(currentDepth + 1);
        } else if (e.key === 'ArrowDown') {
            showLayer(currentDepth - 1);
        }
    });

    showLayer(0);
}
