import { Group } from 'three';
import { sharedLoader } from '../loader.js';
import MODEL from './floor.glb';

class Floor extends Group {
    constructor() {
        // Call parent Group() constructor
        super();
        this.name = 'Floor';

        sharedLoader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
        
    }
}

export default Floor;
