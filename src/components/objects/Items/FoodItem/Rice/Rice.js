import { sharedLoader } from "../../../loader.js";
import MODEL from "./rice.glb";
import FoodItem from "../FoodItem";

class Rice extends FoodItem {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    this.name = "rice";
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.25, 0.25, 0.25);
    });
  }
}

export default Rice;
