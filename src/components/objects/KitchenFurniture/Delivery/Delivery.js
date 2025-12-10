import { sharedLoader } from "../../loader";
import MODEL from "./delivery.glb";
import KitchenFurniture from "../KitchenFurniture";

class Delivery extends KitchenFurniture {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    // load specific model
    this.name = "delivery";
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.5);
      this.model.position.set(0.5, 0, 0);
    });
  }
}

export default Delivery;
