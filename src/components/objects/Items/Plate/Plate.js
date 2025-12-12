import { sharedLoader } from "../../loader.js";
import MODEL from "./plate.glb";
import Item from "../Item";
import FoodItem from "../Item"

class Plate extends Item {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    this.name = "plate";
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.5);
    });

    this.foodItem = null;
  }

  receiveObject(object) {
    if (object instanceof FoodItem && object.isPrepared == true) {
      if (this.foodItem == null) {
        this.foodItem = object;
      } else { // handle the case where you already have a food object, gotta combine them!
        // combine with whatever you currently have on plate
      }
      console.log(`${object.name} placed on plate.`);
      return true;
    } else {
      console.log("Invalid item.");
      return false;
    }
  }
}

export default Plate;
