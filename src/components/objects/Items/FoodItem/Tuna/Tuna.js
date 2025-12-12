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
      this.choppedModel.scale.set(0.1, 0.1, 0.1);
      this.choppedModel.visible = false;
    });
  }

  prepare() {
    this.isPrepared = true;
    // change model
  }

  update(timeStamp) {
    super.update(timeStamp);
    if (!this.model || !this.choppedModel) return;
    if (this.isPrepared) {
      this.choppedModel.visible = true;
      this.model.visible = false;
    } else {
      this.choppedModel.visible = false;
      this.model.visible = true;
    }
  }
}

export default Tuna;
