import * as THREE from 'three';

export function setupControls(camera, folders) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    window.addEventListener("pointerdown", (event) => {
        const touch = event.touches ? event.touches[0] : event;
        mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(folders);

        if (intersects.length > 0) {
            console.log("Folder clicked:", intersects[0].object);
            alert("Opening folder: " + intersects[0].object.position.z);
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
            camera.position.z = Math.max(camera.position.z, -50);
            touchStartY = touchEndY;
        }, { passive: true });

        window.addEventListener("touchend", () => {
            isDragging = false;
        });
    } else {
        window.addEventListener("wheel", (event) => {
            camera.position.z += event.deltaY * 0.01;
            camera.position.z = Math.max(camera.position.z, -50);
        });
    }
}
