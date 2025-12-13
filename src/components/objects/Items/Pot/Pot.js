import { sharedLoader } from "../../loader.js";
import EMPTY_MODEL from "./pot.glb";
import RICE_MODEL from "./ricepot.glb";
import Item from "../Item";
import Rice from "../FoodItem/Rice/Rice.js";
import ProgressBar from "../../../ui/ProgressBar.js";

class Pot extends Item {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);
    this.heldObject = false; // pot can only hold rice, change to bool
    this.isPrepared = false; // pot can only be prepared when rice is inside, start with false
    this.onStove = true; // initially on stove

    this.name = "pot";
    sharedLoader.load(EMPTY_MODEL, (gltf) => {
      this.emptyMesh = gltf.scene;
      this.emptyMesh.scale.set(0.5, 0.5, 0.5);
      this.add(this.emptyMesh);
    });

    sharedLoader.load(RICE_MODEL, (gltf) => {
      this.riceMesh = gltf.scene;
      this.riceMesh.scale.set(0.5, 0.5, 0.5);
      this.riceMesh.visible = false;
      this.add(this.riceMesh);
    });

    // Create progress bar
    this.progressBar = new ProgressBar();
    this.progressBar.attachToItem(this); // adjust height
    this.progressBar.hide(); // initially hidden

    this.totalCookTime = 7; // 7 seconds?
    this.elapsedTime = 0;
    this.isCooking = false;
  }

  receiveObject(object) {
    if (!this.heldObject && object instanceof Rice) {
      this.heldObject = true;

      this.riceMesh.visible = true;
      this.emptyMesh.visible = false;

      object.trash(); // stop rendering the rice
      return true;
    } else {
      console.log("Invalid object or pot already has an item.");
      return false;
    }
  }

  startCooking() {
    console.log("START COOKING")
    if (!this.heldObject) {
      console.log("Cannot cook: pot is empty.");
      return;
    }
    this.isCooking = true;
    this.progressBar.startProgress();
  }

  update(delta) {
    super.update(delta);
    if (!this.isCooking || !this.onStove) return;

    this.elapsedTime += delta;
    const progress = Math.min(this.elapsedTime / this.totalCookTime, 1);
    this.progressBar.setProgress(progress); // update progress bar

    // when cooking complete, stop cooking, switch to isprepared = true, hide progress bar
    if (progress >= 1) {
      this.isCooking = false;
      this.isPrepared = true;
      this.progressBar.hide();
    }
  }

  trash() {
    console.log("Pot trashed.");
    if (this.heldObject == true) {
      console.log("Pot's held item trashed.");
      this.riceMesh.visible = false;
      this.emptyMesh.visible = true;
      this.heldObject = false;
      this.isPrepared = false;
      this.isCooking = false;
      this.elapsedTime = false;
      this.progressBar.hide();
    }
    console.log(this);
  }
}

export default Pot;
