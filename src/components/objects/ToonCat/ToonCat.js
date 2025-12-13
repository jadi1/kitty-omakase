import { Group } from "three";
import { sharedLoader } from "../loader";
import MODEL from "./toon_cat_free.glb";
import * as THREE from "three";
import { facings } from "../../constants";
import IngredientBin from "../KitchenFurniture/IngredientBin/IngredientBin";
import Trash from "../KitchenFurniture/Trash/Trash";
import Pot from "../Items/Pot/Pot";
import Plate from "../Items/Plate/Plate";
import FoodItem from "../Items/FoodItem/FoodItem";
import Delivery from "../KitchenFurniture/Delivery/Delivery"

class ToonCat extends Group {
  constructor(parent, row = 0, col = 0) {
    super();

    this.parent = parent;

    // Init state
    this.xpos = row;
    this.zpos = col;
    // this.facing = facings.DOWN;
    this.heldObject = null;
    this.isAnimating = false;
    this.rotationAngle = 0;
    
    // Load object
    this.name = "cat";
    sharedLoader.load(MODEL, (gltf) => {
      this.mesh = gltf.scene;
      this.mesh.scale.set(0.0022,0.0022, 0.0022);
      this.add(this.mesh);

      // Pick the mesh that matters (ignore armature helpers)
      let mainMesh = null;
      this.mesh.traverse((child) => {
        if (child.isMesh && !["Cube", "Icosphere", "Object5"].includes(child.name)) {
          mainMesh = child;
        }
      });
      if (!mainMesh) return;
   });
   this.catRadius = 0.4;

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

    const { targetRow, targetCol } = this.getTargetCell();

    const furniture = this.parent.state.furnitureGrid[targetRow][targetCol];
    if (furniture) {
      furniture.interact(this);
    }
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

    this.position.z = this.zpos;
    this.position.x = this.xpos;
    this.rotation.y = this.rotationAngle;
  }

  move(moveX, moveZ, distance, worldBounds, obstacles) {
    if (moveX === 0 && moveZ === 0) return;

    // Normalize movement vector
    const len = Math.hypot(moveX, moveZ);
    moveX /= len;
    moveZ /= len;

    const newX = this.position.x + moveX * distance;
    const newZ = this.position.z + moveZ * distance;

    // check world bounds
    if (newX - this.catRadius < worldBounds.minX || newX + this.catRadius > worldBounds.maxX) return;
    if (newZ - this.catRadius < worldBounds.minZ || newZ + this.catRadius > worldBounds.maxZ) return;

    for (const obs of obstacles) {
      if (
        newX + this.catRadius > obs.minX &&
        newX - this.catRadius < obs.maxX &&
        newZ + this.catRadius > obs.minZ &&
        newZ - this.catRadius < obs.maxZ
      ) {
        return; // collision, cancel move
      }
    }

    this.xpos = newX;
    this.zpos = newZ;

    // Update rotation only if moving
    // if (moveX !== 0 || moveZ !== 0) {
      this.rotationAngle = Math.atan2(moveX, moveZ);
    // }
  }
  getTargetCell() {
    // Snap to nearest current cell
    const currentRow = Math.round(this.zpos);
    const currentCol = Math.round(this.xpos);

    // Compute direction vector from rotationAngle
    const dxRaw = Math.sin(this.rotationAngle);
    const dzRaw = Math.cos(this.rotationAngle);

    // Apply deadzone to avoid accidental diagonals near cardinals
    const deadzone = 0.3; // tweak between 0 and 1
    let dx = 0, dz = 0;

    if (Math.abs(dxRaw) > deadzone) dx = Math.sign(dxRaw);
    if (Math.abs(dzRaw) > deadzone) dz = Math.sign(dzRaw);

    // Compute target cell
    const targetRow = currentRow + dz;
    const targetCol = currentCol + dx;

    return { targetRow, targetCol };
}


  pickUp() {
    console.log("pick up");
    const { targetRow, targetCol } = this.getTargetCell();

    console.log(targetRow, targetCol);
    const item = this.parent.state.itemGrid[targetRow][targetCol];
    if (item) {
      this.heldObject = item;
      this.parent.state.itemGrid[targetRow][targetCol] = null;
      item.beGrabbed(this);
      console.log("Picked up:", item);
      // spawn a new plate logic
      if (item instanceof Plate && targetRow == this.parent.plateSpawnRow && targetCol == this.parent.plateSpawnCol) {
        setTimeout(() => {
          const newPlate = new Plate(this.parent, targetRow, targetCol);
          this.parent.state.itemGrid[targetRow][targetCol] = newPlate;
        }, 3000);

      }
      return;
    }

    // special case: if there's an ingredient bin at the target cell, pick up that item
    const furniture = this.parent.state.furnitureGrid[targetRow][targetCol];
    if (furniture && furniture instanceof IngredientBin) {
      console.log("INGREDIENT BIN DETECTED");
      furniture.pickup();
      return;
    }
  }

  drop() {
    console.log("drop");

    const { targetRow, targetCol } = this.getTargetCell();
    const held = this.heldObject;

    // trash
    console.log(this.parent.state.itemGrid);
    if (
      this.parent.state.furnitureGrid[targetRow][targetCol] &&
      this.parent.state.furnitureGrid[targetRow][targetCol] instanceof Trash
    ) {
      console.log("Trashing item");
      held.trash();
      return;
    }
    // dropping into delivery
    if (
      this.parent.state.furnitureGrid[targetRow][targetCol] &&
      this.parent.state.furnitureGrid[targetRow][targetCol] instanceof Delivery
    ) {
      console.log("Delivering Food");
      held.deliver(this.parent.recipeList);
      return;
    }

    const item = this.parent.state.itemGrid[targetRow][targetCol];
    if (item == null) {
      // drop if the target cell is empty
      console.log("Dropping item");

      this.parent.state.itemGrid[targetRow][targetCol] = held;
      held.row = targetRow;
      held.col = targetCol;
      console.log(held);

      held.beDropped();
      this.heldObject = null;
    } else {
      if (item instanceof FoodItem) {
        // if target cell has a prepared food item and the item you're currently holding is food, combine them !
        // if you/item are holding plate and prepared food, combine them
        if (held instanceof Pot) {
          console.log("Placing pot onto item");
          const success = held.receiveObject(item);
          if (success) {
            this.parent.state.itemGrid[targetRow][targetCol] = held;
            held.row = targetRow;
            held.col = targetCol;
            item.beGrabbed(held);
            held.beDropped();
            this.heldObject = null;
          }
        } else if (held instanceof Plate) {
          console.log("Placing food onto plate");
          const success = held.receiveObject(item);
          if (success) {
            console.log("successfully placed food on plate");
          }
        }
      } else if (item instanceof Pot) {
        console.log("Placing item into pot");
        const success = item.receiveObject(held);
        if (success) {
          this.heldObject = null;
          held.beGrabbed(item);
        }
      }
      else if (item instanceof Plate) {
        console.log("Placing food onto plate");
        const success = item.receiveObject(held);
        if (success) {
          this.heldObject = null;
          held.beGrabbed(item);
          console.log("successfully placed food on plate");
        }
      }
    }
  }
}

export default ToonCat;
