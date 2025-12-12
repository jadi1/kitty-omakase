import { sharedLoader } from "../../loader";
import MODEL from "./stove.glb";
import KitchenFurniture from "../KitchenFurniture";
import Pot from "../../Items/Pot/Pot";
import { food } from "../../../constants";
import PreparedFood from "../../Items/FoodItem/PreparedFood";

class Stove extends KitchenFurniture {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    // load specific model
    this.name = "stove";
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.5);
    });
  }

  // placing rice in pot on stove should start cooking
  interact() {
    const item = this.parent.state.itemGrid[this.row][this.col];
    if (item instanceof Pot && item.heldObject == true) { // pot that is holding rice
      item.isPrepared = true;
      console.log("RICE COOKED");
    }
  }
}

export default Stove;
