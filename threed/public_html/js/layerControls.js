import * as THREE from 'three';

export function setupLayerControls(camera, layers) {
    let currentDepth = 0;
    const positionStack = [0];
    let lastClickedX = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function showLayer(depth, x = camera.position.x) {
        if (depth < 0 || depth >= layers.length) return;
        camera.position.z = layers[depth].position.z + 10;
        camera.position.x = x;
        currentDepth = depth;
    }

    window.addEventListener('pointerdown', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(layers[currentDepth].children);
        if (intersects.length > 0) {
            const mesh = intersects[0].object;
            const node = mesh.userData.node;
            if (node.children) {
                let centerX = mesh.getWorldPosition(new THREE.Vector3()).x;
                const children = mesh.userData.children || [];
                if (children.length > 0) {
                        const sum = children.reduce((acc, child) => acc + child.getWorldPosition(new THREE.Vector3()).x, 0);
                    centerX = sum / children.length;
                }
                lastClickedX = centerX;
                positionStack.push(centerX);
                showLayer(currentDepth + 1, centerX);
            } else if (node.url) {
                window.location.href = node.url;
            }
        }
    });

    const backBtn = document.getElementById('backButton');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (currentDepth > 0) {
                positionStack.pop();
                const x = positionStack[positionStack.length - 1] || 0;
                lastClickedX = x;
                showLayer(currentDepth - 1, x);
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            const targetLayer = currentDepth + 1;
            if (targetLayer < layers.length) {
                positionStack.push(lastClickedX);
                showLayer(targetLayer, lastClickedX);
            }
        } else if (e.key === 'ArrowDown') {
            if (currentDepth > 0) {
                positionStack.pop();
                const x = positionStack[positionStack.length - 1] || 0;
                lastClickedX = x;
                showLayer(currentDepth - 1, x);
            }
        }
    });

    showLayer(0);
}