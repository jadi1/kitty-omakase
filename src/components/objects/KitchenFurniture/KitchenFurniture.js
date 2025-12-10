import { Group } from "three";
import { tileSize } from "../../constants";

class KitchenFurniture extends Group {
  constructor(parent, row, col) {
    super();
    this.row = row;
    this.col = col;
    parent.addToUpdateList(this);
  }

  update(timeStamp) {
    this.position.z = this.row * tileSize;
    this.position.x = this.col * tileSize;
  }
}

export default KitchenFurniture;
