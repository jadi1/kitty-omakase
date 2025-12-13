import * as THREE from "three";

class ProgressBar {
  constructor(width = .6, height = 0.08) {
    this.group = new THREE.Group();

    // black border
    const borderGeo = new THREE.PlaneGeometry(width + 0.02, height + 0.03);
    const borderMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.border = new THREE.Mesh(borderGeo, borderMat);
    this.border.position.z = 0.01; // slightly backward
    this.group.add(this.border);

    // white background
    const bgGeo = new THREE.PlaneGeometry(width, height);
    const bgMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.background = new THREE.Mesh(bgGeo, bgMat);
    this.background.position.z = 0.02; // in front of border
    this.group.add(this.background);

    // green fill
    const fillGeo = new THREE.PlaneGeometry(width, height);
    const fillMat = new THREE.MeshBasicMaterial({ color: 0x66CC66});
    this.fill = new THREE.Mesh(fillGeo, fillMat);
    this.fill.position.z = 0.03; // in front of background

    // fill to left edge
    this.fill.position.x = -width / 2 + width / 2; // start at left
    this.fill.scale.set(0, 1, 1); // start empty
    this.group.add(this.fill);

    this.progress = 0; // 0 to 1
    this.width = width;
  }

  setProgress(value) {
    this.progress = THREE.MathUtils.clamp(value, 0, 1);
    this.fill.scale.x = this.progress;
    // keep fill aligned to left
    this.fill.position.x = -this.width / 2 + (this.width * this.progress) / 2;
  }

  attachToItem(item, heightOffset = 0.7) {
    item.add(this.group);
    this.group.position.set(0, heightOffset, 0);
  }

  startProgress() {
    this.group.visible = true;
    this.visible = true;
  }

  hide() {
    this.group.visible = false;
    this.visible = false;
  }
}
export default ProgressBar;