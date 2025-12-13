import { masterMeshes } from "./loadMasterMeshes.js";
import FoodItem from "./FoodItem.js";
import { food } from "../../../constants.js";
import Pot from "../Pot/Pot.js";

class PreparedFood extends FoodItem {
  constructor(parent, row, col, name) {
    super(parent, row, col);
    this.isPrepared = true;
    this.name = name;
    this.model = null;

    this.loadMesh(name);
    console.log(this);
  }

  trash() {
    super.trash();
  }

  // figures out what mesh to load based on name
  loadMesh(name) {
    // if there is already a mesh, remove it
    if (this.model) {
      this.remove(this.model);
      this.model = null;
    }
    console.log("new mesh name: ", name);

    const master = masterMeshes[name];
    if (!master) {
      console.warn("No master mesh for", name);
      return false;
    }

    // clone synchronously
    const instance = master.clone(true); // deep clone
    instance.visible = true;
    this.add(instance);
    this.model = instance;
    this.name = name;
    return true;
  }

  // figures out what mesh to load based on name
  changeMesh(name) {
    // check if same name
    if (name == this.name) {
      return true;
    }
    // if there is already a mesh, remove it
    if (this.model) {
      this.remove(this.model);
      this.model = null;
    }
    console.log("new mesh name: ", name);

    const master = masterMeshes[name];
    if (!master) {
      console.warn("No master mesh for", name);
      return false;
    }

    // clone synchronously
    const instance = master.clone(true); // deep clone
    instance.visible = true;
    this.add(instance);
    this.model = instance;
    this.name = name;
    return true;
  }

  receiveObject(object) {
    console.log("prepared food received, ", object);
    let newFoodName;
    if (object instanceof Pot && object.isPrepared == true) {
      newFoodName = food.RICE;
    } else if (object instanceof PreparedFood) {
      newFoodName = object.name;
    }
    console.log(this.name, newFoodName);

    const combinedFoodName = this.getNewFood(this.name, newFoodName);
    if (combinedFoodName == null) {
      console.log("FAILED NAME");
      return false; // just exit, nothing returned
    }
    // otherwise, new combo succeeds
    object.trash(); // get rid of old object
    if (this.changeMesh(combinedFoodName)) {
      return true;
    } else {
      console.log("ERROR IN LOADING MESH");
      return false;
    }
  }


  getNewFood(food1, food2) {
    if (food1 == "") { // empty plate
      return food2;
    } if (food2 == "") {
      return food1;
    }

    if ((food1 == food.RICE && food2 == food.NORI) || (food1 == food.NORI && food2 == food.RICE)) {
      return food.RICENORI;
    } else if ((food1 == food.RICE && food2 == food.CHOPPEDTUNA) || (food1 == food.CHOPPEDTUNA && food2 == food.RICE)) {
      return food.TUNARICE;
    } else if ((food1 == food.NORI && food2 == food.CHOPPEDTUNA) || (food1 == food.CHOPPEDTUNA && food2 == food.NORI)) {
      return food.TUNANORI;
    } else if ((food1 == food.RICE && food2 == food.CHOPPEDSALMON) || (food1 == food.CHOPPEDSALMON && food2 == food.RICE)) {
      return food.SALMONRICE;
    } else if ((food1 == food.NORI && food2 == food.CHOPPEDSALMON) || (food1 == food.CHOPPEDSALMON && food2 == food.NORI)) {
      return food.SALMONNORI;
    } else if ((food1 == food.CHOPPEDTUNA && food2 == food.RICENORI) || (food1 == food.RICENORI && food2 == food.CHOPPEDTUNA)) {
      return food.TUNASUSHI;
    } else if ((food1 == food.CHOPPEDSALMON && food2 == food.RICENORI) || (food1 == food.RICENORI && food2 == food.CHOPPEDSALMON)) {
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
