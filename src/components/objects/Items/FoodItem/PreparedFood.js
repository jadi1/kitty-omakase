import { masterMeshes } from "./loadMasterMeshes.js";
import FoodItem from "./FoodItem.js";
import { removeMesh } from "../../../utils.js";
import { food } from "../../../constants.js";
import Pot from "../Pot/Pot.js";

class PreparedFood extends FoodItem {
  constructor(parent, row, col, name) {
    super(parent, row, col);
    this.isPrepared = true;
    this.name = name;
    this.model = null;

    this.loadMesh(name);
  }

  trash() {
    if (this.heldBy) {
      this.heldBy.heldObject = null;
    }
    removeMesh(this.model);
  }

  // figures out what mesh to load based on name
  loadMesh(name) {
    // if there is already a mesh, remove it
    if (this.model) {
      this.remove(this.model);
      this.model = null;
    }

    const master = masterMeshes[name];
    if (!master) {
      console.log(master);
      console.warn("No master mesh for", name);
      return false;
    }

    // clone synchronously
    const instance = master.clone(true); // deep clone
    instance.visible = true;
    this.add(instance);
    this.model = instance;
    return true;
  }

  receiveObject(object) {
    console.log(object)
    let newFoodName;
    if (object instanceof Pot && object.isPrepared == true) {
      newFoodName = food.RICE;
    } else {
      newFoodName = object.name;
    }

    const combinedFoodName = this.getNewFood(this.name, newFoodName);
    if (combinedFoodName == null) {
      console.log("FAILED NAME");
      return false; // just exit, nothing returned
    }
    object.trash(); // get rid of old object
    this.name = combinedFoodName;
    this.loadMesh(combinedFoodName);
    return true;
  }


  getNewFood(food1, food2) {
    if (food1 == "") { // empty plate
      return food2;
    } if (food2 == "") {
      return food1;
    }

    if ((food1 == food.RICE && food2 == food.NORI) || (food1 == food.NORI && food2 == food.RICE)) {
      return food.RICENORI;
    } else if ((food1 == food.RICE && food2 == food.TUNA) || (food1 == food.TUNA && food2 == food.RICE)) {
      return food.TUNARICE;
    } else if ((food1 == food.NORI && food2 == food.TUNA) || (food1 == food.TUNA && food2 == food.NORI)) {
      return food.TUNANORI;
    } else if ((food1 == food.RICE && food2 == food.SALMON) || (food1 == food.SALMON && food2 == food.RICE)) {
      return food.SALMONRICE;
    } else if ((food1 == food.NORI && food2 == food.SALMON) || (food1 == food.SALMON && food2 == food.NORI)) {
      return food.SALMONNORI;
    } else if ((food1 == food.TUNA && food2 == food.RICENORI) || (food1 == food.RICENORI && food2 == food.TUNA)) {
      return food.TUNASUSHI;
    } else if ((food1 == food.SALMON && food2 == food.RICENORI) || (food1 == food.RICENORI && food2 == food.SALMON)) {
      return food.SALMONSUSHI;
    } else if ((food1 == food.NORI && food2 == food.TUNARICE) || (food1 == food.TUNARICE && food2 == food.NORI)) {
      return food.TUNASUSHI;
    } else if ((food1 == food.NORI && food2 == food.SALMONRICE) || (food1 == food.SALMONRICE && food2 == food.NORI)) {
      return food.SALMONSUSHI;
    } else if ((food1 == food.RICE && food2 == food.TUNANORI) || (food1 == food.TUNANORI && food2 == food.RICE)) {
      return food.TUNASUSHI;
    } else if ((food1 == food.RICE && food2 == food.SALMONNORI) || (food1 == food.SALMONNORI && food2 == food.RICE)) {
      return food.SALMONSUSHI;
    }
    console.log("invalid food combination");
    return null;
  }
}

export default PreparedFood;
