import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import MODEL from "./cabinet.glb";
import KitchenFurniture from "../KitchenFurniture";

class Cabinet extends KitchenFurniture {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    // load specific model
    const loader = new GLTFLoader();
    this.name = "cabinet";
    loader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.5);
    });
  }
}

export default Cabinet;
