import { Group, PlaneGeometry, Mesh, MeshStandardMaterial, DoubleSide } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './floor.glb';

class Floor extends Group {
    constructor() {
        // Call parent Group() constructor
        super();
        this.name = 'Floor';
        
        const loader = new GLTFLoader();

        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
        
    }
}

export default Floor;
