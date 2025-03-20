import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { getPages } from './fetchPages.js';

export async function createPages(scene) {
    const pages = await getPages(); // Fetch URLs of subdomains/pages
    const loader = new GLTFLoader();
    const modelURL = './models/page_model.glb'; // Update with correct path

    const pageObjects = [];
    const roadWidth = 8;
    const roadStartZ = -10;
    const spacingZ = 10;

    try {
        const glb = await loader.loadAsync(modelURL);
        const baseModel = glb.scene;

        for (let i = 0; i < pages.length; i++) {
            const pageModel = baseModel.clone(); // Clone model for each page

            // Position the models along the road
            pageModel.position.set(
                (Math.random() - 0.5) * roadWidth, // Random X within the road width
                0, // Keep the model on the road
                roadStartZ - i * spacingZ // Spread along the road
            );

            // Scale the model if needed
            pageModel.scale.set(1.5, 1.5, 1.5); // Adjust as needed

            // Rotate if needed
            pageModel.rotation.y = Math.PI; // Example rotation

            scene.add(pageModel);
            pageObjects.push({ model: pageModel, url: pages[i] });
        }
    } catch (error) {
        console.error("Error loading GLB model:", error);
    }

    return pageObjects;
}
