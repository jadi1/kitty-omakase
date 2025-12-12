import { sharedLoader } from "../../loader.js";
import EMPTY_MODEL from "./pot.glb";
import RICE_MODEL from "./ricepot.glb";
import Item from "../Item";
import Rice from "../FoodItem/Rice/Rice.js";

class Pot extends Item {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);
    this.heldObject = null;

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
    if (this.heldObject == null && object instanceof Rice) {
      this.heldObject = object;
      console.log(`${object.name} placed in pot.`);
      return true;
    } else {
      console.log("Pot already has an item.");
      return false;
    }
  }

  trash() {
    if (this.heldObject) {
      this.heldObject.trash();
      console.log("Pot's held item trashed.");
    }
  }

  update(timeStamp) {
    super.update(timeStamp);
    if (!this.emptyMesh || !this.riceMesh) return;
    if (this.heldObject && this.heldObject instanceof Rice) {
      this.riceMesh.visible = true;
      this.emptyMesh.visible = false;
    } else {
      this.riceMesh.visible = false;
      this.emptyMesh.visible = true;
    }
  }
}

export default Pot;
