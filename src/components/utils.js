
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
