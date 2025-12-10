import { Scene, Color } from 'three';
import { BasicLights } from 'lights';
import { Floor } from 'objects';

class KitchenScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        const floor = new Floor;
        floor.rotation.set(0,Math.PI/2,0);
        const lights = new BasicLights();
        this.add(floor, lights);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { updateList } = this.state;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default KitchenScene;
