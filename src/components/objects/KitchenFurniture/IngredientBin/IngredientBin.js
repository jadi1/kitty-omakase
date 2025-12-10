import KitchenFurniture from "../KitchenFurniture";
import Rice from "../../Items/FoodItem/Rice/Rice";
import Salmon from "../../Items/FoodItem/Salmon/Salmon";
import Nori from "../../Items/FoodItem/Nori/Nori";

class IngredientBin extends KitchenFurniture {
  constructor(parent, row, col, food) {
    super(parent, row, col); // Pass parent, row, and col to the KitchenFurniture constructor
    this.food = food; // a const defined in constants/food
    this.name = "ingredientbin";
  }

  // does nothing
  interact() {
    console.log("interact with ingredient bin");
  }

  // unlike other furnitures, pickup is the correct interaction for ingredient bins
  pickup() {
    // spawn food item and make player hold it
    let foodItem;
    switch (this.food) {
      case "rice":
        foodItem = new Rice(this.parent, this.row, this.col);
        break;
      case "salmon":
        foodItem = new Salmon(this.parent, this.row, this.col); 
        break;
      case "nori":
        foodItem = new Nori(this.parent, this.row, this.col);
        break;
      default:
        console.error("Unknown food type:", this.food);
        return;
    }

    foodItem.beGrabbed(this.parent.player);
    this.parent.player.heldObject = foodItem;
  }
}

export default IngredientBin;