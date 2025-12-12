import Item from "../Item.js";

class FoodItem extends Item {
  constructor(parent, row, col) {
    super(parent, row, col);
    this.isPrepared = false;
    this.contains = []; // contains ingredients stored in the food item
  }

  trash() {
    super.delete();
    this.heldBy.heldObject = null;
  }
}

export default FoodItem;
