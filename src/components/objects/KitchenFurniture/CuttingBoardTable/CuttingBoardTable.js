import { sharedLoader } from "../../loader";
import MODEL from "./cutting_board_table.glb";
import KitchenFurniture from "../KitchenFurniture";
import Salmon from "../../Items/FoodItem/Salmon/Salmon";
import Tuna from "../../Items/FoodItem/Tuna/Tuna";
import { food } from "../../../constants";
import PreparedFood from "../../Items/FoodItem/PreparedFood";

class CuttingBoardTable extends KitchenFurniture {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    // load specific model
    this.name = "cuttingboard";
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.5);
    });
  }

  interact(player) {
    const item = this.parent.state.itemGrid[this.row][this.col];
    if (item && item instanceof Salmon && item.isPrepared == false) {
      item.trash();
      const newFood = new PreparedFood(this.parent, this.row,this.col, food.SALMON);
      this.parent.state.itemGrid[this.row][this.col] = newFood;
    } else if (item && item instanceof Tuna && item.isPrepared == false) {
      item.trash();
      const newFood = new PreparedFood(this.parent, this.row,this.col, food.TUNA);
      this.parent.state.itemGrid[this.row][this.col] = newFood;
    }
  }
}

export default CuttingBoardTable;
