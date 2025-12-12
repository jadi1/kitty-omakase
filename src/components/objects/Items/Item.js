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
    parent.add(this);
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

      // if on furniture, set y to furniture height (assumed 0 here)
      if (this.parent && this.parent.state && this.parent.state.furnitureGrid) {
        const furniture = this.parent.state.furnitureGrid[this.row][this.col];
        if (furniture) {
          this.position.y = 0.51; // Adjust based on furniture height if needed
        } else {
          this.position.y = 0.1; // Ground level
        }
      }
    } else if (this.heldBy) {
      this.position.z = this.heldBy.position.z;
      this.position.y = this.heldBy.position.y + .7; // Slightly above the player
      this.position.x = this.heldBy.position.x;
    }
  }
}

export default Item;
