import { Group } from "three";
import { tileSize } from "../../constants";

class Item extends Group {
  constructor(parent, row, col) {
    super();
    this.row = row;
    this.col = col;
    this.isHeld = false;
    this.heldBy = null;
    this.name = "";

    parent.addToUpdateList(this);
    parent.add(this);
  }

  beGrabbed(player) {
    this.isHeld = true;
    this.heldBy = player;
  }

  beDropped(targetRow, targetCol) {
    this.isHeld = false;
    this.heldBy = null;
    this.row = targetRow;
    this.col = targetCol;
  }

  trash() {
    return;
  }


  update(timeStamp) {
    if (!this.isHeld) {
      this.position.z = this.row * tileSize;
      this.position.x = this.col * tileSize;

      // if on furniture, set y to furniture height
      if (this.parent && this.parent.state && this.parent.state.furnitureGrid) {
        const furniture = this.parent.state.furnitureGrid[this.row][this.col];
        if (furniture) {
          if (furniture.name == "stove") {
            this.position.y = .55; // Adjust based on stove height if needed
          } else if (furniture.name == "cuttingboard") {
            this.position.y = 0.58; // Adjust based on sink height if needed
          } else {
            this.position.y = 0.51; // Adjust based on furniture height if needed
          }
        } else {
          this.position.y = .1; // Ground level
        }
      }
    } else if (this.heldBy) {
      this.position.z = this.heldBy.position.z;
      this.position.x = this.heldBy.position.x;
      if (this.heldBy.name == "plate") {
        this.position.y = this.heldBy.position.y + .05; // slightly above plate
      } else {
        this.position.y = this.heldBy.position.y + .7; // above player
      }
    }
  }
}

export default Item;
