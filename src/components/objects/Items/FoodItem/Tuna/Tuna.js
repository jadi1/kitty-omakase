import { sharedLoader } from "../../../loader";
import MODEL from "./tuna.glb";
import FoodItem from "../FoodItem";
import { food } from "../../../../constants";

class Tuna extends FoodItem {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    this.name = food.TUNA;

    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.1, 0.1, 0.1);
    });

    // chopping state
    this.isBeingChopped = false;
    this.elapsedChopTime = 0;
    this.totalChopTime = 2; // seconds
    this.progressBar = null; // will be assigned
  }

  startChopping() {
    if (this.isPrepared) return;
    this.isBeingChopped = true;
    if (this.progressBar) this.progressBar.startProgress();
  }

  stopChopping() {
    this.isBeingChopped = false;
  }

  updateChopping(delta) {
    if (!this.isBeingChopped || this.isPrepared) return;

    this.elapsedChopTime += delta;
    if (this.progressBar) this.progressBar.setProgress(this.elapsedChopTime / this.totalChopTime);

    if (this.elapsedChopTime >= this.totalChopTime) {
      this.isPrepared = true;
      this.isBeingChopped = false;
    }
  }


}

export default Tuna;
