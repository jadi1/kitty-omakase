import { sharedLoader } from "../../loader.js";
import FoodItem from "./FoodItem.js";
import { removeMesh } from "../../../utils.js";
import { food } from "../../../constants.js";
import RICE from "./Rice/cookedrice.glb";
import NORI from "./Nori/nori.glb";
import SALMON from "./Salmon/choppedsalmon.glb";
import TUNA from "./Tuna/choppedtuna.glb";
import RICENORI from "./RiceNori/ricenori.glb";
import SALMONNORI from "./SalmonNori/salmonnori.glb";
import SALMONRICE from "./SalmonRice/salmonrice.glb";
import TUNANORI from "./TunaNori/tunanori.glb";
import TUNARICE from "./TunaRice/tunarice.glb";
import SALMONSUSHI from "./SalmonSushi/salmonsushi.glb";
import TUNASUSHI from "./TunaSushi/tunasushi.glb";

class PreparedFood extends FoodItem {
  constructor(parent, row, col, name) {
    super(parent, row, col);
    this.isPrepared = true;
    this.name = name;
    this.model = null;

    this.loadMesh();
  }

  trash() {
    super.delete();
    if (this.heldBy) {
      this.heldBy.heldObject = null;
    }
    removeMesh(this.mesh);
  }

  // figures out what mesh to load based on name
  loadMesh() {
    // if there is already a mesh, remove it
    if (this.model) {
      removeMesh(this.model);
    }

    switch (this.name) {
      case food.RICE: // already cooked
        this.gltfLoader(RICE, 0.25);
        break;
      case food.NORI:
        this.gltfLoader(NORI, 0.25);
        break;
      // case food.SALMON:
      //   this.gltfLoader(SALMON, 0.15);
      //   break;
      // case food.TUNA:
      //   this.gltfLoader(TUNA, 0.15);
      //   break;
      case food.RICENORI:
        this.gltfLoader(RICENORI, 0.25);
        break;
      case food.SALMONNORI:
        this.gltfLoader(SALMONNORI, 0.25);
        break;
      case food.TUNANORI:
        this.gltfLoader(TUNANORI, 0.25);
        break;
      case food.SALMONRICE:
        this.gltfLoader(SALMONRICE, 0.15);
        break;
      case food.TUNARICE:
        this.gltfLoader(TUNARICE, 0.15);
        break;
      case food.SALMONSUSHI:
        this.gltfLoader(SALMONSUSHI, 0.15);
        break;
      case food.TUNASUSHI:
        this.gltfLoader(TUNASUSHI, 0.15);
        break;
    }
  }

  gltfLoader(model, scale) {
    sharedLoader.load(model, (gltf) => {
      this.add(gltf.scene);
      this.model = gltf.scene;
      this.model.scale.set(scale, scale, scale);
    });
  }

  // combines your current food with the new food
  combineFoods(newFoodName) {
    combinedFoodName = this.getNewFood(this.name, newFoodName);
    if (combinedFoodName != null) {
      this.name = combinedFoodName;
      this.loadMesh(combinedFoodName); // changes the mesh
    }
  }

  getNewFood(food1, food2) {
    if (food1 == "null") {
      return food2.name;
    } if (food2 == "null") {
      return food1.name;
    }

    if ((food1.name == food.RICE && food2.name == food.NORI) || (food1.name == food.NORI && food2.name == food.RICE)) {
      return food.RICENORI;
    } else if ((food1.name == food.RICE && food2.name == food.TUNA) || (food1.name == food.TUNA && food2.name == food.RICE)) {
      return food.TUNARICE;
    } else if ((food1.name == food.NORI && food2.name == food.TUNA) || (food1.name == food.TUNA && food2.name == food.NORI)) {
      return food.TUNANORI;
    } else if ((food1.name == food.RICE && food2.name == food.SALMON) || (food1.name == food.SALMON && food2.name == food.RICE)) {
      return food.SALMONRICE;
    } else if ((food1.name == food.NORI && food2.name == food.SALMON) || (food1.name == food.SALMON && food2.name == food.NORI)) {
      return food.SALMONNORI;
    } else if ((food1.name == food.TUNA && food2.name == food.RICENORI) || (food1.name == food.RICENORI && food2.name == food.TUNA)) {
      return food.TUNASUSHI;
    } else if ((food1.name == food.SALMON && food2.name == food.RICENORI) || (food1.name == food.RICENORI && food2.name == food.SALMON)) {
      return food.SALMONSUSHI;
    } else if ((food1.name == food.NORI && food2.name == food.TUNARICE) || (food1.name == food.TUNARICE && food2.name == food.NORI)) {
      return food.TUNASUSHI;
    } else if ((food1.name == food.NORI && food2.name == food.SALMONRICE) || (food1.name == food.SALMONRICE && food2.name == food.NORI)) {
      return food.SALMONSUSHI;
    }
    console.log("invalid food combination");
    return null;
  }
}

export default PreparedFood;
