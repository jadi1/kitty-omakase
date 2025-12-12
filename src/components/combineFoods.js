import { food } from "./constants.js";

// helper function to combine foods
// return string with name of new food
export function combineFoods(food1, food2) {
  if (!(food1 instanceof Food) && !(food2 instanceof Food)) {
    console.log("both inputs must be food");
    return
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
