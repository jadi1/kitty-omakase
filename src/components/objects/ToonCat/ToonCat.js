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
import Stove from "../KitchenFurniture/Stove/Stove";
import { PreparedFood } from "../Items/FoodItem";

class ToonCat extends Group {
  constructor(parent, row = 0, col = 0) {
    super();

    this.parent = parent;

    // Init state
    this.row = row;
    this.col = col;
    this.facing = facings.DOWN;
    this.heldObject = null;
    this.isAnimating = false;

    // Load object
    this.name = "cat";
    sharedLoader.load(MODEL, (gltf) => {
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

    this.position.z = this.row * 1;
    this.position.x = this.col * 1;
    this.rotation.y = (this.facing * Math.PI) / 2;
  }

  move(direction) {
    if (direction === "forward") {
      this.facing = facings.UP;
      if (
        this.parent.state.furnitureGrid[this.row - 1][this.col] ||
        this.parent.state.itemGrid[this.row - 1][this.col]
      ) {
        return;
      }
      this.row -= 1;
    }
    if (direction === "backward") {
      this.facing = facings.DOWN;
      if (
        this.parent.state.furnitureGrid[this.row + 1][this.col] ||
        this.parent.state.itemGrid[this.row + 1][this.col]
      ) {
        return;
      }
      this.row += 1;
    }
    if (direction === "left") {
      this.facing = facings.LEFT;
      if (
        this.parent.state.furnitureGrid[this.row][this.col - 1] ||
        this.parent.state.itemGrid[this.row][this.col - 1]
      ) {
        return;
      }
      this.col -= 1;
    }
    if (direction === "right") {
      this.facing = facings.RIGHT;
      if (
        this.parent.state.furnitureGrid[this.row][this.col + 1] ||
        this.parent.state.itemGrid[this.row][this.col + 1]
      ) {
        return;
      }
      this.col += 1;
    }
  }

  getTargetCell() {
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
      console.log(item.heldObject);
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
      } 
    }
    // check for foods/plates/pots
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
        if (held.food == null) {
          const success = held.receiveObject(item);
          if (success) {
            item.trash(); // remove ingredients
          }
        } else { // plate is not empty
          if (typeof item.receiveObject === 'function') { // check if that function is valid
            const success = held.receiveObject(item);
            if (success) {
              item.trash(); // empty pot /remove ingredients
            }
          }
        }
        // if (held.food != null) { // dump contents of plate onto food
        //   if (typeof item.receiveObject === 'function') { // check if that function is valid
        //     const success = item.receiveObject(held.food);
        //     if (success) {
        //       held.trash(); // empty plate
        //     }
        //   }
        // } else { // pick up contents with plate
        //     const success = held.receiveObject(item);
        //     if (success) {
        //       item.trash(); // remove ingredients
        //     }
        // }
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
      // if target cell is a food item...
      // if (item instanceof FoodItem || item instanceof Pot) {
      //   // ...and you are holding a pot
      //   if (held instanceof Pot) {
      //     console.log("Placing pot onto item");
      //     const success = held.receiveObject(item);
      //     if (success) {
      //       this.parent.state.itemGrid[targetRow][targetCol] = held; // update item grid 
            
      //       item.beGrabbed(held); // the item is grabbed by the pot
      //       held.beDropped(targetRow, targetCol); // you drop the pot
      //       this.heldObject = null; // no longer holding anything
      //     }
      //   // ...and you are holding a plate
      //   } else if (held instanceof Plate) {
      //     // should be very similar to pot
      //     console.log("Pick up food with plate");
      //     const success = held.receiveObject(item);
      //     if (success) {
      //       console.log("successfully placed food on plate");
      //     }
      //   }
      // // or, target item is a pot / plate
      // } else if (item instanceof Pot || item instanceof Plate) {
      //   console.log("Placing item onto pot/plate");
      //   const success = item.receiveObject(held);
      //   if (success) {
      //     item.beDropped(targetRow, targetCol);
      //     if (item instanceof Plate && !(this.heldObject instanceof Pot)) {
      //       this.heldObject = null; // you are no longer holding anything
      //     }
      //     console.log("SUCCESSFUL PLATE RECEIVING");
      //   } else {
      //     console.log("UNSUCCESSFUL PLATE RECIVING");
      //   }
      // }
    }
    if (furniture && furniture instanceof Stove) {
      furniture.interact();
    }
    
  }
}

export default ToonCat;
