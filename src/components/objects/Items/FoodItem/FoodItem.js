import Item from "../Item.js";

class FoodItem extends Item {
  constructor(parent,row,col) {
    super(parent,row,col);
    this.isPrepared = false;
  }

}

export default FoodItem;
