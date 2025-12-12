import { sharedLoader } from "../../../loader";
import MODEL from "./salmon.glb";
import CHOPPED_MODEL from "./choppedsalmon.glb";
import FoodItem from "../FoodItem";
import { food } from "../../../../constants";

class Salmon extends FoodItem {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    this.name = food.SALMON;

    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.1, 0.1, 0.1);
    });

    // sharedLoader.load(CHOPPED_MODEL, (gltf) => {
    //   this.add(gltf.scene);
    //   this.choppedModel = gltf.scene;
    //   this.choppedModel.scale.set(0.15, 0.15, 0.15);
    //   this.choppedModel.visible = false;
    // });
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

export default Salmon;
