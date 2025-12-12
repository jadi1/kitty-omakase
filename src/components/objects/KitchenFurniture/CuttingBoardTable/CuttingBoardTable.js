import { sharedLoader } from "../../loader";
import MODEL from "./cutting_board_table.glb";
import KitchenFurniture from "../KitchenFurniture";
import Salmon from "../../Items/FoodItem/Salmon/Salmon";

class CuttingBoardTable extends KitchenFurniture {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    // load specific model
    this.name = "cabinet";
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.5);
    });
  }

  interact(player) {
    const item = this.parent.state.itemGrid[this.row][this.col];
    if (item && item instanceof Salmon) {
      item.prepare();
      console.log("Salmon prepared on cutting board table");
    }
  }
}

export default CuttingBoardTable;
