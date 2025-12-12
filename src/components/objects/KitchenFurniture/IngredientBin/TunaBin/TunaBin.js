import { sharedLoader } from "../../../loader";
import MODEL from "./tunabin.glb";
import IngredientBin from "../IngredientBin";

class TunaBin extends IngredientBin {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col, "tuna");

    // load specific model
    this.name = "tunabin";
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.5);
    });
  }
}

export default TunaBin;
