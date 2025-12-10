import { Scene, Color } from "three";
import { ToonCat } from "objects";
import { BasicLights } from "lights";

class GameScene extends Scene {
  constructor() {
    // Call parent Scene() constructor
    super();

    // Init state
    this.state = {
      itemGrid: [], // pickup items (ingredients / pots & plates)
      objectGrid: [], // stove, trash, ingredient bins, table
      updateList: [],
    };

    // Set background to a nice color
    this.background = new Color(0x7ec0ee);

    // Add meshes to scene
    this.player = new ToonCat(this);

    const lights = new BasicLights();
    this.add(this.player, lights);

    // gemini told me to put this here
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  addToUpdateList(object) {
    this.state.updateList.push(object);
  }

  handleKeyDown(event) {
    switch (event.key) {
      case "w":
      case "ArrowUp":
        this.player.move("forward");
        console.log("up");
        break;
      case "s":
      case "ArrowDown":
        this.player.move("backward");
        console.log("down");
        break;
      case "a":
      case "ArrowLeft":
        this.player.move("left");
        console.log("left");
        break;
      case "d":
      case "ArrowRight":
        this.player.move("right");
        console.log("right");
        break;
      case " ":
        console.log("space");
        break;
    }
  }

  handleKeyUp(event) {
    return;
  }

  update(timeStamp) {
    const updateList = this.state.updateList;

    // Call update for each object in the updateList
    for (const obj of updateList) {
      obj.update(timeStamp);
    }
  }
}

export default GameScene;
