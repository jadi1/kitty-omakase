import { sharedLoader } from "../../../loader";
import MODEL from "./noribin.glb";
import IngredientBin from "../IngredientBin";

class NoriBin extends IngredientBin {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col, "nori");

    // load specific model
    this.name = "noribin";
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.5);
    });
  }
}

export default NoriBin;
