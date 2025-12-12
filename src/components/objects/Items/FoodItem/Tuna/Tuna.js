import { sharedLoader } from "../../../loader";
import MODEL from "./tuna.glb";
import CHOPPED_MODEL from "./choppedtuna.glb";
import FoodItem from "../FoodItem";
import { food } from "../../../../constants";

class Tuna extends FoodItem {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    this.name = food.TUNA;
    this.contains.push(food.TUNA);

    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.1, 0.1, 0.1);
    });

    sharedLoader.load(CHOPPED_MODEL, (gltf) => {
      this.add(gltf.scene);
      this.choppedModel = gltf.scene;
      this.choppedModel.scale.set(0.15, 0.15, 0.15);
      this.choppedModel.visible = false;
    });
  }

  prepare() {
    if (!this.isPrepared) {
      this.isPrepared = true;

      // switch models
      if (!this.model || !this.choppedModel) return;

      this.model.visible = false;
      this.choppedModel.visible = true;
    }
  }
}

export default Tuna;
