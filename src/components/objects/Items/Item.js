import { Group } from "three";
import { tileSize } from "../../constants";

class Item extends Group {
  constructor(parent, row, col) {
    super();
    this.row = row;
    this.col = col;
    this.isHeld = false;
    this.heldBy = null;

    parent.addToUpdateList(this);
  }

  beGrabbed(player) {
    console.log("be grabbed");
    this.isHeld = true;
    this.heldBy = player;
  }

  beDropped() {
    this.isHeld = false;
    this.heldBy = null;
  }

  update(timeStamp) {
    if (!this.isHeld) {
      this.position.z = this.row * tileSize;
      this.position.x = this.col * tileSize;
    } else if (this.heldBy) {
      this.position.z = this.heldBy.position.z;
      this.position.x = this.heldBy.position.x;
    }
  }
}

export default Item;
