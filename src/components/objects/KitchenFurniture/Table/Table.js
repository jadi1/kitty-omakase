import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './table.glb';
// import * as THREE from 'three';

class Table extends Group {
    constructor(parent) {
        super();
        this.state = {
            gui: parent.state.gui,
        };
        const loader = new GLTFLoader();
        this.name = 'table';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
            this.model = gltf.scene;
            this.model.scale.set(0.25, 0.25, 0.25);
        });
        parent.addToUpdateList(this);
    }
    update(timeStamp) {
        if (this.mixer) {
            const delta = 0.016; 
            this.mixer.update(delta);
        }

    }
}
export default Table;