import { sharedLoader } from "../../../loader";
import MODEL from "./nori.glb";
import FoodItem from "../FoodItem";

class Nori extends FoodItem {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    this.name = "nori";
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.25, 0.25, 0.25);
    });
  }
}

export default Nori;
