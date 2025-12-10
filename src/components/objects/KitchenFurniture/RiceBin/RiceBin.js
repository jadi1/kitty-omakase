import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import MODEL from "./ricebin.glb";
import KitchenFurniture from "../KitchenFurniture";

class RiceBin extends KitchenFurniture {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    // load specific model
    const loader = new GLTFLoader();
    this.name = "ricebin";
    loader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.5);
      this.model.position.set(0.5, 0, 0);
    });
  }
}

export default RiceBin;
