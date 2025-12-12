import { sharedLoader } from "../../loader.js";
import MODEL from "./plate.glb";
import Item from "../Item";
import FoodItem from "../Item"
import COOKEDRICE from "../FoodItem/Rice/cookedrice.glb";
import Rice from "../FoodItem/Rice/Rice.js";
import Tuna from "../FoodItem/Tuna/Tuna.js";
import CHOPPEDTUNA from "../FoodItem/Tuna/choppedtuna.glb";

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
    // check if valid food item
    if (object instanceof FoodItem && object.isPrepared == true) {
      // plate currently empty
      if (this.foodItem == null) {
        // load tuna mesh if tuna
        if (object instanceof Tuna) {
          sharedLoader.load(CHOPPEDTUNA, (gltf) => {
            console.log("tuna mesh");
            this.mesh = gltf.scene;
            this.mesh.scale.set(.15, .15, .15);
            this.mesh.position.set(0, this.model.position.y, 0);
            this.add(this.mesh);
          });
        }
        this.foodItem = object;
      } else { // handle the case where you already have a food object, gotta combine them!
        // combine with whatever you currently have on plate
      }
      console.log("PLATE CONTAINS:");
      console.log(this.foodItem);
      return true;
    } else {
      console.log("Invalid item. Food items must be prepared");
      return false;
    }
  }

  update(timeStamp) {
    super.update(timeStamp);
  }
}

export default Plate;
