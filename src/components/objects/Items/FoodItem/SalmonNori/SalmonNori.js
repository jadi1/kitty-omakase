import { sharedLoader } from "../../../loader";
import MODEL from "./salmonnori.glb";
import FoodItem from "../FoodItem";
import { food } from "../../../../constants"

class SalmonNori extends FoodItem {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);
;
    this.name = food.SALMONNORI;
    
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.55);
    });
  }
}

export default SalmonNori;
