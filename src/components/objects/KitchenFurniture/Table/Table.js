import { sharedLoader } from "../../loader";
import MODEL from "./table.glb";
import KitchenFurniture from "../KitchenFurniture";
import { PLATEGENERATOR } from "../../../constants";
import { Plate } from "../../Items/Plate"

class Table extends KitchenFurniture {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    // load specific model
    this.name = "table";
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.5);
    });
  }

  // special function ONLY for the table that is labeled "plategenerator" in gamescene
  regeneratePlate(itemName) {
    if (this.name != PLATEGENERATOR) {
      return; // do nothing
    }

    // the item that was picked up was a plate
    if (itemName == "plate") {
      setTimeout(() => {
        if (!this.parent.state.itemGrid[this.row][this.col]) {
          const newPlate = new Plate(this.parent, this.row, this.col);
          this.parent.state.itemGrid[this.row][this.col] = newPlate;
          console.log("Plate regenerated at", this.row, this.col);
        }
      }, 3000);
    }
  }
}

export default Table;
