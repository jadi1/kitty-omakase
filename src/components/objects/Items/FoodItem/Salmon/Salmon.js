import { sharedLoader } from "../../../loader";
import MODEL from "./salmon.glb";
import FoodItem from "../FoodItem";

class Salmon extends FoodItem {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    this.name = "salmon";
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.5);
    });
  }
}

export default Salmon;
