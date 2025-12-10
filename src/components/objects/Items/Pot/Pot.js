import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import MODEL from "./pot.glb";
import Item from "../item";

class Pot extends Item {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    const loader = new GLTFLoader();
    this.name = "pot";
    loader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.5);
    });
  }
}

export default Pot;
