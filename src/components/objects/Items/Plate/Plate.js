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

  // this deletion is causing some weird behavior
  deliver(recipeList) {
    const foodItemName = this.foodItem.name;
    // console.log("recipeList before: ", recipeList);
    for (const card of recipeList.cards) {
      if (card.recipeName == foodItemName) {
        console.log("foodItem? ", this.foodItem)
        recipeList.repopulate(card);
        // console.log("recipeList after: ", recipeList);
        //recipeList.repopulate();
        // causes an error when parent is null
        // this.foodItem.delete();
        // this.foodItem = null;
        // this.delete()
        break;
      }
    }
  }
}

export default Plate;
