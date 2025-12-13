import { sharedLoader } from "../../loader";
import MODEL from "./delivery.glb";
import KitchenFurniture from "../KitchenFurniture";
import { Plate } from "../../Items/Plate";

class Delivery extends KitchenFurniture {
  constructor(parent, row = 0, col = 0) {
    super(parent, row, col);

    // load specific model
    this.name = "delivery";
    sharedLoader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(0.5, 0.5, 0.5);
      this.model.position.set(0.5, 0, 0);
    });
  }

  interact(object) {
    // if not a plate or the plate is empty, do nothing
    if (!(object instanceof Plate) || (object.food == null)) {
      return;
    }

    const foodName = object.food.name;

    // check if it matches any of the recipes, then delete the contents + plate
    for (const card of this.parent.recipeList.cards) {
      if (card.recipeName == foodName) {
        this.parent.recipeList.repopulate(card);
        object.food.trash();
        object.delete();
        return true; // successful delivery, throw out contents
      }
    }
    object.food.trash();
    object.delete();
    return false; // bad delivery, still throw out contents
  }
}

export default Delivery;
