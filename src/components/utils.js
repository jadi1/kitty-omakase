import { food } from "./constants.js";

// helper function to combine foods
// return new food
export function combineFoods(food1, food2) {
  if (food1 == null && food2 == null) return null; // both foods cant be null at the same time;
  if (food1 == null) {
    return food2.name;
  } if (food2 == null) {
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
}

// helper function to remove mesh
export function removeMesh(mesh) {
  if (!mesh) return;

  // remove from parent if provided
  if (mesh.parent) {
    mesh.parent.remove(mesh);
  }

  // dispose everything recursively
  mesh.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose();
    }

    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((mat) => mat.dispose());
      } else {
        child.material.dispose();
      }
    }

    // textures inside materials
    if (child.material) {
      const props = ["map", "normalMap", "roughnessMap", "metalnessMap", "emissiveMap", "alphaMap", "aoMap"];
      props.forEach((p) => {
        if (child.material[p]) {
          child.material[p].dispose();
        }
      });
    }
  });
}
