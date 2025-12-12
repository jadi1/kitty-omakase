import { sharedLoader } from "../../loader.js";

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

const masterMeshesData = [
  { name: "rice", path: RICE, scale: 0.25 },
  { name: "nori", path: NORI, scale: 0.25 },
  { name: "salmon", path: SALMON, scale: 0.15 },
  { name: "tuna", path: TUNA, scale: 0.15 },
  { name: "ricenori", path: RICENORI, scale: 0.25 },
  { name: "salmonnori", path: SALMONNORI, scale: 0.25 },
  { name: "salmonrice", path: SALMONRICE, scale: 0.25 },
  { name: "tunanori", path: TUNANORI, scale: 0.25 },
  { name: "tunarice", path: TUNARICE, scale: 0.25 },
  { name: "salmonsushi", path: SALMONSUSHI, scale: 0.15 },
  { name: "tunasushi", path: TUNASUSHI, scale: 0.15 },
];

const masterMeshes = {};

export function loadAllMasterMeshes() {
  const promises = masterMeshesData.map(f => {
    return new Promise((resolve) => {
      sharedLoader.load(f.path, (gltf) => {
        const mesh = gltf.scene;
        mesh.scale.set(f.scale, f.scale, f.scale);
        mesh.visible = false;
        masterMeshes[f.name] = mesh;
        resolve();
      });
    });
  });

  return Promise.all(promises); // resolves when all meshes are loaded
}

export { masterMeshes };

