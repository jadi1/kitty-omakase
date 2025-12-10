import { Scene, Color } from "three";
import { Floor, ToonCat, Table, Cabinet, Trash, Stove } from "objects";
import { BasicLights } from "lights";
import { numRows, numCols } from "../constants";

class GameScene extends Scene {
  constructor() {
    // Call parent Scene() constructor
    super();

    this.rows = numRows;
    this.cols = numCols;

    // Init state
    this.state = {
      itemGrid: Array.from({ length: this.rows }).map(() =>
        Array(this.cols).fill(null)
      ), // pickup items (ingredients / pots & plates)
      furnitureGrid: Array.from({ length: this.rows }).map(() =>
        Array(this.cols).fill(null)
      ), // stove, trash, ingredient bins, table
      updateList: [],
    };

    // Set background to a nice color
    this.background = new Color(0x7ec0ee);

    // Add meshes to scene
    this.player = new ToonCat(this, 1, 1);
    const lights = new BasicLights();
    this.player.scale.set(2,2,2);

    // floor
    const floor = new Floor;
		floor.rotation.set(0,0,0);
    floor.scale.set(0.5,0.5,0.5);
		floor.position.set((numCols - 1) / 2, -.25, (numRows - 1) / 2);

    this.add(floor, this.player, lights);

    const initialFurniture = [
      ["t", "t", "c", " ", " ", "t", "t", "t"],
      ["t", " ", " ", " ", " ", " ", " ", "t"],
      ["x", " ", " ", " ", " ", " ", " ", "t"],
      ["t", " ", " ", "s", "s", " ", " ", "t"],
      ["t", " ", " ", " ", " ", " ", " ", "t"],
      ["t", "t", " ", " ", " ", " ", "t", "t"],
    ];

    this.populateFurnitureGrid(initialFurniture);

    // gemini told me to put this here
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  populateFurnitureGrid(furnitureLayout) {
    for (let row = 0; row < furnitureLayout.length; row++) {
      for (let col = 0; col < furnitureLayout[row].length; col++) {
        const item = furnitureLayout[row][col];
        let furnitureObject = null;

        switch (item) {
          case "t":
            furnitureObject = new Table(this, row, col);
            this.add(furnitureObject);
            this.state.furnitureGrid[row][col] = furnitureObject;
            break;
          case "c":
            furnitureObject = new Cabinet(this, row, col);
            this.add(furnitureObject);
            this.state.furnitureGrid[row][col] = furnitureObject;
            break;
          case "x":
            furnitureObject = new Trash(this, row, col);
            this.add(furnitureObject);
            this.state.furnitureGrid[row][col] = furnitureObject;
            break;
          case "s":
            furnitureObject = new Stove(this, row, col);
            this.add(furnitureObject);
            this.state.furnitureGrid[row][col] = furnitureObject;
            break;
          // Add more cases for different furniture types as needed
          default:
            break;
        }
      }
    }
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
