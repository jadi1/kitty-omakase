import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import MODEL from "./flower.gltf";

class Player extends Group {
  constructor(parent) {
    // Call parent Group() constructor
    super();

    // Init state
    this.state = {
      row: 0,
      col: 0,
      facing: 0,
    };

    // Load object
    const loader = new GLTFLoader();

    this.name = "pot";
    loader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
    });

    // Add self to parent's update list
    parent.addToUpdateList(this);
  }

  update(timeStamp) {
    this.position.z = this.state.row * 1;
    this.position.x = this.state.col * 1;
    this.rotation.y = ((this.state.facing + 2) * Math.PI) / 2;

    // console.log(this.row);

    // Advance tween animations, if any exist
    TWEEN.update();
  }

  move(direction) {
    if (direction === "forward") {
      this.state.row += 1;
      this.state.facing = 0;
    }
    if (direction === "backward") {
      this.state.row -= 1;
      this.state.facing = 2;
    }
    if (direction === "left") {
      this.state.col += 1;
      this.state.facing = 1;
    }
    if (direction === "right") {
      this.state.col -= 1;
      this.state.facing = 3;
    }
  }
}

export default Player;
