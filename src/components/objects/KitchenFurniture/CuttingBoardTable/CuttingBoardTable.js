import { sharedLoader } from "../../loader";
import MODEL from "./cutting_board_table.glb";
import KitchenFurniture from "../KitchenFurniture";
import Salmon from "../../Items/FoodItem/Salmon/Salmon";
import Tuna from "../../Items/FoodItem/Tuna/Tuna";
import { food } from "../../../constants";
import PreparedFood from "../../Items/FoodItem/PreparedFood";
import ProgressBar from "../../../ui/ProgressBar";

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

    this.itemsBeingChopped = [];
  }

  interact() {
    // player presses interact at this board
    const item = this.parent.state.itemGrid[this.row][this.col];
    if (!item || item.isPrepared) return;

    if (!this.itemsBeingChopped.includes(item)) {
      this.itemsBeingChopped.push(item);

      // create progress bar if not already
      if (!item.progressBar) {
        item.progressBar = new ProgressBar();
        item.progressBar.attachToItem(item);
        item.progressBar.hide();

        // switch models
      }
    }
    console.log(item);
    // toggle chopping on/off
    if (item.isBeingChopped) item.stopChopping();
    else item.startChopping();
  }

  // called when player picks up a fish
  pickUp(item) {
    console.log("picked up fish");
    const index = this.itemsBeingChopped.indexOf(item);
    if (index >= 0) {
      console.log("hello");
      item.stopChopping();
      this.itemsBeingChopped.splice(index, 1);
    }
  }

  // Called from main update loop
  update(delta) {
    super.update(delta);
    const player = this.parent.player;
    const boardPos = this.position; 
    const distance = player.position.distanceTo(boardPos);

    const maxChopDistance = 1.3; // whatever works in your units

    for (const item of this.itemsBeingChopped) {
      if (item.isBeingChopped) {
        // pause chopping if player walked away
        if (distance > maxChopDistance) {
          item.stopChopping();
        } else {
          console.log(distance);
          item.updateChopping(delta); // continue progress if still in range
        }
      } else if (item.isPrepared == true) {
        let newFoodName;
        if (item.name == food.SALMON) {
          newFoodName = food.CHOPPEDSALMON;
        } else {
          newFoodName = food.CHOPPEDTUNA;
        }
        item.trash();
        const newFood = new PreparedFood(this.parent, this.row,this.col, newFoodName);
        this.parent.state.itemGrid[this.row][this.col] = newFood;
        // remove item from isbeingchopped
        const index = this.itemsBeingChopped.indexOf(item);
        if (index >= 0) {
          this.itemsBeingChopped.splice(index, 1);
        }
      }
    }
  }
}

export default CuttingBoardTable;
