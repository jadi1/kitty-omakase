import { sharedLoader } from "../../loader.js";
import EMPTY_MODEL from "./pot.glb";
import RICE_MODEL from "./ricepot.glb";
import Item from "../Item";
import Rice from "../FoodItem/Rice/Rice.js";

class Pot extends Item {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);
    this.heldObject = false; // pot can only hold rice, change to bool
    this.isPrepared = false; // pot can only be prepared when rice is inside, start with false

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
  }

  receiveObject(object) {
    if (!this.heldObject && object instanceof Rice) {
      this.heldObject = true;

      this.riceMesh.visible = true;
      this.emptyMesh.visible = false;

      object.trash(); // stop rendering the rice
      return true;
    } else {
      console.log("Pot already has an item.");
      return false;
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
    }
    console.log(this);
  }
}

export default Pot;
