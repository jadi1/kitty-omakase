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

    this.foodMesh = null; // holds mesh of food
    this.foodName= null; // holds reference to name food
  }

  receiveObject(object) {
    // check if object is valid food item
    // EVEN BETTER: CHECK IF ITS PREPARED FOOD ITEM
    if (object instanceof FoodItem && object.isPrepared == true) {
      // create new prepared food on plate and combine with object
      newFood = new PreparedFood(this.parent, this.row, this.col, this.foodName)
      newFood.combineFoods(object.name);
      this.foodName = newFood.name;

      if (newFoodName != null) { // if valid new food name
        this.loadFood(newFoodName);
        this.foodItem = object;

        object.trash(); // stop rendering the old food item(s)
      } 
      // console.log("PLATE CONTAINS:");
      // console.log(this.foodName);
      return true;
    } else {
      console.log("Invalid item. Food items must be prepared");
      return false;
    }
  }
}

export default Plate;
