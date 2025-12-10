import { sharedLoader } from "../../loader.js";
import MODEL from "./plate.glb";
import Item from "../Item";

class Plate extends Item {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    this.name = "plate";
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.5);
    });

    this.foodItems = [];
  }
}

export default Plate;
