import { Group } from "three";
import { sharedLoader } from "../loader";
import MODEL from "./toon_cat_free.glb";
import * as THREE from "three";
import { pointsPerOrder, pointsPerWrongOrder, PLATEGENERATOR } from "../../constants";
import IngredientBin from "../KitchenFurniture/IngredientBin/IngredientBin";
import Trash from "../KitchenFurniture/Trash/Trash";
import Table from "../KitchenFurniture/Table/Table";
import Pot from "../Items/Pot/Pot";
import Plate from "../Items/Plate/Plate";
import FoodItem from "../Items/FoodItem/FoodItem";
import Stove from "../KitchenFurniture/Stove/Stove";
import { PreparedFood } from "../Items/FoodItem";
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
      this.model = gltf.scene;
      this.model.scale.set(0.0022,0.0022, 0.0022);
      this.add(this.model);

      let skinnedMesh = null;
      this.model.traverse((child) => {
        if (child.isSkinnedMesh) skinnedMesh = child;
      });

      if (!skinnedMesh) {
        console.warn("No skinned mesh found in model!");
        return;
      }

      if (gltf.animations.length && gltf.animations.length > 0) {
        this.mixer = new THREE.AnimationMixer(skinnedMesh);
        this.animations = {}

        gltf.animations.forEach((clip) => {
          console.log("Animation found:", clip.name);
          this.animations[clip.name] = this.mixer.clipAction(clip);
        });

        // Default action
        this.action = this.mixer.clipAction(gltf.animations[0]);
        this.action.stop(); // don't play automatically
      }

      // // setting up animation mixer
      // if (gltf.animations && gltf.animations.length > 0) {
      //   this.mixer = new THREE.AnimationMixer(this.model);
      //   this.animations = {};

      //   // Store all animations by name
      //   gltf.animations.forEach((clip) => {
      //     console.log("Animation found:", clip.name);
      //     this.animations[clip.name] = this.mixer.clipAction(clip);
      //     // by default, don't play the animation
      //     this.action = this.mixer.clipAction(gltf.animations[0]);
      //     this.action.stop();
      //   });

      //   gltf.animations.forEach((clip) => {
      //     console.log(clip.tracks.map(t => t.name));
      //   });
      // }
      window.addEventListener("keydown", (e) => this.handleKeyDown(e));
      window.addEventListener("keyup", (e) => this.handleKeyUp(e));
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

    // if an item exists
    const item = this.parent.state.itemGrid[targetRow][targetCol];
    console.log(item);

    if (item) {
      this.heldObject = item;
      this.parent.state.itemGrid[targetRow][targetCol] = null;
      item.beGrabbed(this);
      console.log("Picked up:", item);
      // special case: you've picked an item off the plate generator
      const furniture = this.parent.state.furnitureGrid[targetRow][targetCol];
      if (furniture && furniture instanceof Table && furniture.name == PLATEGENERATOR) {
        furniture.regeneratePlate(item.name);
      }
      return;
    }

    // special case: if there's an ingredient bin at the target cell, pick up that item
    const furniture = this.parent.state.furnitureGrid[targetRow][targetCol];
    if (furniture && furniture instanceof IngredientBin) {
      furniture.pickup();
      return;
    }
  }

  drop() {
    const { targetRow, targetCol } = this.getTargetCell();
    const held = this.heldObject;

    // check kitchen furniture items
    const furniture = this.parent.state.furnitureGrid[targetRow][targetCol];
    if (furniture) {
      if (furniture instanceof Trash) {
        console.log("Trashing item");
        held.trash();
        return;
      } else if (furniture instanceof Delivery) {
        console.log("Delivering Food");
        const success = furniture.interact(held);
        if (success === true) {
          this.heldObject = null;
          // successful delivery! increment score
          this.parent.score.addScore(pointsPerOrder);
        } else if (success === false) {
          this.heldObject = null
          // unsuccessful delivery... decrement score
          this.parent.score.addScore(-pointsPerWrongOrder);
        } // success undefined means do nothing
        return;
      }
    }

    const item = this.parent.state.itemGrid[targetRow][targetCol];
    // regular drop: drop if the target cell is empty
    if (item == null) {
      this.parent.state.itemGrid[targetRow][targetCol] = held;
      held.beDropped(targetRow, targetCol);
      this.heldObject = null;
    } else { // special cases
      // if you are holding a pot
      if (held instanceof Pot) {
        console.log("Placing pot onto item");
        if (item instanceof Plate || item instanceof PreparedFood) { // item is a plate
          const success = item.receiveObject(held);
          if (success) {
            held.trash(); // empty pot
          }
        } else { // all other items
          const success = held.receiveObject(item);
          if (success) {
            this.parent.state.itemGrid[targetRow][targetCol] = held; // update item grid 
            item.beGrabbed(held); // the item is grabbed by the pot
            held.beDropped(targetRow, targetCol); // you drop the pot
            this.heldObject = null; // no longer holding anything
          }
        }
      // if you are holding a plate
      } else if (held instanceof Plate) {
        console.log("Picking up item with plate");
        // if placing down onto a pot, attempt to pick up rice from pot
        if (item instanceof Pot) {
          const success = held.receiveObject(item);
          if (success) {
            item.trash(); // remove ingredients
          }
        } else { // otherwise, place plate down on the food
          const success = held.receiveObject(item);
          if (success) {
            held.beDropped(targetRow, targetCol); // you drop the plate onto food
            this.parent.state.itemGrid[targetRow][targetCol] = held; // update item grid 
            this.heldObject = null ; // EDGE CASE TO ADD: if the item is also a food, you want to hold plate
          }
        }
      // you are holding food
      } else {
        // you can try putting it in the plate/pot
        if (item instanceof Pot && item.isPrepared == true) {
          if (held instanceof PreparedFood) {
            const success = held.receiveObject(item);
            if (success) {
              item.trash(); // empty pot
            }
          }
        } else if(item instanceof Pot || item instanceof Plate) {
          const success = item.receiveObject(held);
          if (success) {
            held.beGrabbed(item);
            held.beDropped(targetRow, targetCol);
            this.heldObject = null; // no longer holding anything
          }
        }
        // if your food is prepared, you can try combining it with the item if its food
        else if (item instanceof PreparedFood) {
          const success = item.receiveObject(held);
          if (success) {
            held.beGrabbed(item);
            held.beDropped(targetRow, targetCol);
            this.heldObject = null; // no longer holding anything
          }
        }
      }
    }
    if (furniture && furniture instanceof Stove) {
      furniture.interact();
    }
    
  }
}

export default ToonCat;
