import { sharedLoader } from "../../../loader";
import MODEL from "./ricenori.glb";
import FoodItem from "../FoodItem";
import { food } from "../../../../constants"

class RiceNori extends FoodItem {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);
;
    this.contains.push(food.NORI);
    this.contains.push(food.RICE);
    
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.25, 0.25, 0.25);
    });
  }
}

export default RiceNori;
