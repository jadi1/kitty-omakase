import { sharedLoader } from "../../../loader.js";
import MODEL from "./rice.glb";
import FoodItem from "../FoodItem";
import { food } from "../../../../constants";

class Rice extends FoodItem {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);
    this.name = food.RICE;

    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.25, 0.25, 0.25);
    });
  }

  // never gets called
  // prepare() {
  //   if (!this.isPrepared) {
  //     this.isPrepared = true;

  //     // switch models
  //     if (!this.model || !this.choppedModel) return;

  //     this.model.visible = false;
  //     this.choppedModel.visible = true;
  //   }
  // }
}

export default Rice;
