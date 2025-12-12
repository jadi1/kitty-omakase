import { sharedLoader } from "../../../loader.js";
import MODEL from "./rice.glb";
import FoodItem from "../FoodItem";
import { food } from "../../../../constants";
import Pot from "../../Pot/Pot.js";
import Pot from "../../Pot/Pot.js";

class Rice extends FoodItem {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    this.name = food.RICE;
    this.contains.push(food.RICE);

    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.25, 0.25, 0.25);
    });
  }

  update(timeStamp) {
    super.update(timeStamp);
    if (this.model == null) return;
    if (this.heldBy && this.heldBy instanceof Pot) {
      this.model.visible = false;
    } else {
      this.model.visible = true;
    }
  }

  update(timeStamp) {
    super.update(timeStamp);
    if (this.model == null) return;
    if (this.heldBy && this.heldBy instanceof Pot) {
      this.model.visible = false;
    } else {
      this.model.visible = true;
    }
  }
}

export default Rice;
