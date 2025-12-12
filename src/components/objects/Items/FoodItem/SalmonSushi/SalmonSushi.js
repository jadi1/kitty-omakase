import { sharedLoader } from "../../../loader";
import MODEL from "./salmonsushi.glb";
import FoodItem from "../FoodItem";
import { food } from "../../../../constants"

class SalmonSushi extends FoodItem {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);
    
    this.name = food.SALMONSUSHI;

    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.55);
    });
  }
}

export default SalmonSushi;
