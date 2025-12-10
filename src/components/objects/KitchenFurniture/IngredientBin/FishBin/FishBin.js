import { sharedLoader } from "../../../loader";
import MODEL from "./fishbin.glb";
import IngredientBin from "../IngredientBin";

class FishBin extends IngredientBin {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col, "salmon");

    // load specific model
    this.name = "fishbin";
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.5);
    });
  }
}

export default FishBin;
