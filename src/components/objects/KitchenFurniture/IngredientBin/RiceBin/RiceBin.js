import { sharedLoader } from "../../../loader";
import MODEL from "./ricebin.glb";
import IngredientBin from "../IngredientBin";

class RiceBin extends IngredientBin {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col, "rice");

    // load specific model
    this.name = "ricebin";
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.5);
    });
  }
}

export default RiceBin;
