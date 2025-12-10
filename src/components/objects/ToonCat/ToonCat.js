import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import MODEL from "./toon_cat_free.glb";
import * as THREE from "three";
import { facings } from "../../constants";

class ToonCat extends Group {
  constructor(parent, row = 0, col = 0) {
    super();

    this.parent = parent;

    // Init state
    this.row = row;
    this.col = col;
    this.facing = facings.DOWN;
    this.heldObject =null;
    this.isAnimating = false;

    // Load object
    const loader = new GLTFLoader();

    this.name = "cat";
    loader.load(MODEL, (gltf) => {
      this.add(gltf.scene);

      this.model = gltf.scene;

      // setting up animation mixer
      if (gltf.animations && gltf.animations.length > 0) {
        this.mixer = new THREE.AnimationMixer(this.model);
        this.animations = {};

        // Store all animations by name
        gltf.animations.forEach((clip) => {
          console.log("Animation found:", clip.name);
          this.animations[clip.name] = this.mixer.clipAction(clip);
          // by default, don't play the animation
          this.action = this.mixer.clipAction(gltf.animations[0]);
          this.action.stop();
        });
      }

      window.addEventListener("keydown", (e) => this.handleKeyDown(e));
      window.addEventListener("keyup", (e) => this.handleKeyUp(e));
      // cat scale
      this.model.scale.set(0.001, 0.001, 0.001);
    });

    // Add self to parent's update list
    parent.addToUpdateList(this);
  }

  pickupDrop() {
    if (this.heldObject == null) {
      this.pickUp();
    } else {
      this.drop();
    }
  }

  interact(event) {
    console.log("interact");
  }

  handleKeyDown(event) {
    // Only start if not already animating (prevents retriggering)
    if (
      (event.code === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight") &&
      !this.isAnimating
    ) {
      this.startAnimation();
    }
  }

  handleKeyUp(event) {
    // Stop when key is released
    if (
      event.code === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight"
    ) {
      this.stopAnimation();
    }
  }

  startAnimation() {
    if (!this.action) return;
    this.action.play();
    this.isAnimating = true;
  }

  stopAnimation() {
    if (!this.action) return;
    this.action.stop();
    this.isAnimating = false;
  }

  update(timeStamp) {
    // Update animations if they exist
    if (this.mixer) {
      // deltaTime calculation - you might want to pass delta from parent instead
      const delta = 0.016; // ~60fps, or calculate properly
      this.mixer.update(delta);
    }

    this.position.z = this.row * 1;
    this.position.x = this.col * 1;
    this.rotation.y = (this.facing * Math.PI) / 2;
  }

  move(direction) {
    if (direction === "forward") {
      this.facing = facings.UP;
      if (this.parent.state.furnitureGrid[this.row - 1][this.col]) {
        return;
      }
      this.row -= 1;
    }
    if (direction === "backward") {
      this.facing = facings.DOWN;
      if (this.parent.state.furnitureGrid[this.row + 1][this.col]) {
        return;
      }
      this.row += 1;
    }
    if (direction === "left") {
      this.facing = facings.LEFT;
      if (this.parent.state.furnitureGrid[this.row][this.col - 1]) {
        return;
      }
      this.col -= 1;
    }
    if (direction === "right") {
      this.facing = facings.RIGHT;
      if (this.parent.state.furnitureGrid[this.row][this.col + 1]) {
        return;
      }
      this.col += 1;
    }
  }

  pickUp() {
    console.log("pick up");
    const facing = this.facing;
    let targetRow = this.row;
    let targetCol = this.col;

    if (facing === facings.UP) {
      targetRow -= 1;
    } else if (facing === facings.DOWN) {
      targetRow += 1;
    } else if (facing === facings.LEFT) {
      targetCol -= 1;
    } else if (facing === facings.RIGHT) {
      targetCol += 1;
    }

    const item = this.parent.state.itemGrid[targetRow][targetCol];
    if (item) {
      this.heldObject = item;
      this.parent.state.itemGrid[targetRow][targetCol] = null;
      item.beGrabbed(this);
      console.log("Picked up:", item);
    }
  }

  drop() {
    console.log("drop");
    if (this.heldObject == null) {
      return;
    }

    const facing = this.facing;
    let targetRow = this.row;
    let targetCol = this.col;

    if (facing === facings.UP) {
      targetRow -= 1;
    } else if (facing === facings.DOWN) {
      targetRow += 1;
    } else if (facing === facings.LEFT) {
      targetCol -= 1;
    } else if (facing === facings.RIGHT) {
      targetCol += 1;
    }

    // const item = this.parent.state.itemGrid[targetRow][targetCol];
    // Only drop if the target cell is empty
    if (this.parent.state.itemGrid[targetRow][targetCol] == null) {
      const item = this.heldObject;
      this.parent.state.itemGrid[targetRow][targetCol] = item;
      item.row = targetRow;
      item.col = targetCol;
      console.log(item);

      item.beDropped();

      this.heldObject = null;
    }
  }
}

export default ToonCat;
