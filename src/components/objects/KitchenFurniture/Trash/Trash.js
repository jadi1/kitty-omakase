import { sharedLoader } from "../../loader";
import MODEL from "./trash.glb";
import KitchenFurniture from "../KitchenFurniture";

class Trash extends KitchenFurniture {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    // load specific model
    this.name = "trash";
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.5);
    });
  }
}

export default Trash;
