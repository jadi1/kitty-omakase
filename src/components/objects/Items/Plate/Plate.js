import { sharedLoader } from "../../loader.js";
import MODEL from "./plate.glb";
import Item from "../Item";
import PreparedFood from "../FoodItem/PreparedFood.js";
import { removeMesh } from "../../../utils.js";

class Plate extends Item {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    this.name = "plate";
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.5);
    });

    this.food = null; // holds reference to food
  }

  trash() {
    if (this.food) {
      console.log("Plate's item trashed.");
      removeMesh(this.food);
      this.food = null;
    }
  }

  receiveObject(object) {
    console.log("Plate is receiving object", object);

    // if plate is empty
    if (this.food == null) {
      // create new preparedfood
      const newFood = new PreparedFood(this.parent, this.row, this.col, "");
      this.food = newFood;
      this.food.beGrabbed(this);
      const success = this.food.receiveObject(object);
      console.log(newFood); 
      if (success) {
        console.log("Plate successfully received object");
        object.trash(); // empty pot / clear food
      }
      return success;
    } else { // plate already has food
      const success = this.food.receiveObject(object);
      if (success) {
        object.trash(); // empty pot / clear food
      }
      return success;
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
