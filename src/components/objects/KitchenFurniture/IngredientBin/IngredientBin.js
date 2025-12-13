import KitchenFurniture from "../KitchenFurniture";
import Rice from "../../Items/FoodItem/Rice/Rice";
import Salmon from "../../Items/FoodItem/Salmon/Salmon";
import Nori from "../../Items/FoodItem/Nori/Nori";
import Tuna from "../../Items/FoodItem/Tuna/Tuna";
import PreparedFood from "../../Items/FoodItem/PreparedFood";
import { food } from "../../../constants";

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
      case food.RICE:
        foodItem = new Rice(this.parent, this.row, this.col);
        break;
      case food.SALMON:
        foodItem = new Salmon(this.parent, this.row, this.col);
        break;
      case food.NORI:
        foodItem = new PreparedFood(this.parent, this.row, this.col, food.NORI);
        break;
      case food.TUNA:
        foodItem = new Tuna(this.parent, this.row, this.col);
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
