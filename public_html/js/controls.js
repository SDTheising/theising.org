export function setupControls(camera, pageObjects) {
    if (!pageObjects || pageObjects.length === 0) {
        console.error("setupControls: No objects available for interaction.");
        return;
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener("pointerdown", (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // ✅ Fix: Make sure we're checking actual objects, not undefined values
        const models = pageObjects
            .map(p => p.model)
            .filter(obj => obj && obj.isObject3D); // Ensure valid objects

        if (models.length === 0) {
            console.warn("No interactable models found.");
            return;
        }

        const intersects = raycaster.intersectObjects(models, true); // `true` enables recursive check in GLTF models
        if (intersects.length > 0) {
            const clickedModel = pageObjects.find(p => p.model === intersects[0].object.parent);
            if (clickedModel) {
                window.open(clickedModel.url, "_blank"); // Open page in new tab
            }
        }
    });

    let touchStartY = 0;
    let isDragging = false;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobile) {
        window.addEventListener("touchstart", (event) => {
            touchStartY = event.touches[0].clientY;
            isDragging = true;
        }, { passive: false });

        window.addEventListener("touchmove", (event) => {
            if (!isDragging) return;
            event.preventDefault();
            const touchEndY = event.touches[0].clientY;
            const deltaY = touchStartY - touchEndY;
            camera.position.z += deltaY * 0.05;
            // Camera bounds
            camera.position.z = Math.max(camera.position.z, -50);
            camera.position.z = Math.min(camera.position.z, 50);
            touchStartY = touchEndY;
        }, { passive: true });

        window.addEventListener("touchend", () => {
            isDragging = false;
        });
    } else {
        window.addEventListener("wheel", (event) => {
            camera.position.z += event.deltaY * 0.01;
            // Camera bounds(2)
            camera.position.z = Math.max(camera.position.z, -50);
            camera.position.z = Math.min(camera.position.z, 50);
        });
    }
}
