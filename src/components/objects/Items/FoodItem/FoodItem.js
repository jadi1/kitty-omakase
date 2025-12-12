import Item from "../Item.js";
import { removeMesh } from "../../../utils.js";

class FoodItem extends Item {
  constructor(parent, row, col) {
    super(parent, row, col);
    this.isPrepared = false;
  }

  trash() {
    super.delete();
    if (this.heldBy) {
      this.heldBy.heldObject = null;
    }
    removeMesh(this.mesh);
  }
}

export default FoodItem;
