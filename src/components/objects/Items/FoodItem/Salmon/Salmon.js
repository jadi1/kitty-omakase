import { sharedLoader } from "../../../loader";
import MODEL from "./salmon.glb";
import FoodItem from "../FoodItem";
import { food } from "../../../../constants"

class Salmon extends FoodItem {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    this.name = food.SALMON;
    this.contains.push(food.SALMON);

    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.1, 0.1, 0.1);
    });
  }

  prepare() {
    this.isPrepared = true;
    // change model
  }
}

export default Salmon;
