import { sharedLoader } from "../../../loader";
import MODEL from "./tuna.glb";
import FoodItem from "../FoodItem";
import { food } from "../../../../constants"

class Tuna extends FoodItem {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    this.name = food.TUNA;
    this.contains.push(food.TUNA);

    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.1, 0.1, 0.1);
    });
  }
}

export default Tuna;
