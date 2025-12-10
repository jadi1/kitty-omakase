import KitchenFurniture from "../KitchenFurniture";
import Rice from "../../Items/FoodItem/Rice/Rice";
console.log(Rice);

class IngredientBin extends KitchenFurniture {
  constructor(parent, row, col, food) {
    super(parent, row, col); // Pass parent, row, and col to the KitchenFurniture constructor
    this.food = food; // a const defined in constants/food
  }

  interact() {
    console.log(`Interacting with Ingredient Bin containing ${this.food}`);
    // spawn this.food item nad make player hold it
    console.log(this.parent);
    const rice = new Rice(this.parent, this.row, this.col);
    console.log(rice);

    this.parent.state.itemGrid[this.row][this.col] = rice;
    rice.beGrabbed(this.parent.player);
    this.parent.player.heldObject = rice;

  }
}

export default IngredientBin;