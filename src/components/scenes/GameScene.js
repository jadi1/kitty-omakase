import { Scene, Color } from "three";
import RecipeList from "../ui/RecipeList.js";
import {
  Floor,
  ToonCat,
  Table,
  Cabinet,
  Trash,
  Stove,
  Delivery,
  Plate,
  Pot,
  FishBin,
  NoriBin,
  RiceBin,
} from "objects";
import { BasicLights } from "lights";
import { numRows, numCols, food } from "../constants";

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
    this.player.scale.set(2, 2, 2);

    // recipe list ui overlay
    this.recipeList = new RecipeList();
    this.recipeList.show();

    // floor
    const floor = new Floor();
    floor.rotation.set(0, 0, 0);
    floor.scale.set(0.5, 0.5, 0.5);
    floor.position.set((numCols - 1) / 2, -.1, (numRows - 1) / 2);

    this.add(floor, this.player, lights);

    const initialFurniture = [
      ["t", "t", "c", "d", " ", "t", "t", "t"],
      ["t", " ", " ", " ", " ", " ", " ", "t"],
      ["x", " ", " ", " ", " ", " ", " ", "t"],
      ["t", " ", " ", "s", "s", " ", " ", "t"],
      ["t", " ", " ", " ", " ", " ", " ", "t"],
      ["t", "t", "1", "2", "3", "2", "t", "t"],
    ];
    this.populateFurnitureGrid(initialFurniture);

    const initialItems = [
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", "p", " "],
      [" ", " ", " ", " ", " ", " ", "o", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
    ];
    this.populateItemGrid(initialItems);

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
            this.state.furnitureGrid[row][col] = furnitureObject;
            break;
          case "c":
            furnitureObject = new Cabinet(this, row, col);
            this.state.furnitureGrid[row][col] = furnitureObject;
            break;
          case "x":
            furnitureObject = new Trash(this, row, col);
            this.state.furnitureGrid[row][col] = furnitureObject;
            break;
          case "s":
            furnitureObject = new Stove(this, row, col);
            this.state.furnitureGrid[row][col] = furnitureObject;
            break;
          case "d":
            furnitureObject = new Delivery(this, row, col);
            this.state.furnitureGrid[row][col] = furnitureObject;
            this.state.furnitureGrid[row][col + 1] = furnitureObject;
            break;
          case "1":
            furnitureObject = new FishBin(this, row, col);
            this.state.furnitureGrid[row][col] = furnitureObject;
            break;
          case "2":
            furnitureObject = new RiceBin(this, row, col);
            this.state.furnitureGrid[row][col] = furnitureObject;
            break;
          case "3":
            furnitureObject = new NoriBin(this, row, col);
            this.state.furnitureGrid[row][col] = furnitureObject;
            break;
          // Add more cases for different furniture types as needed
          default:
            break;
        }
      }
    }
  }

  populateItemGrid(itemLayout) {
    for (let row = 0; row < itemLayout.length; row++) {
      for (let col = 0; col < itemLayout[row].length; col++) {
        const item = itemLayout[row][col];
        let itemObject = null;

        switch (item) {
          case "p":
            itemObject = new Plate(this, row, col);
            this.state.itemGrid[row][col] = itemObject;
            break;
          case "o":
            itemObject = new Pot(this, row, col);
            this.state.itemGrid[row][col] = itemObject;
            break;
          // Add more cases for different item types as needed
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
      case "e":
        this.player.pickupDrop();
        console.log("pickup/drop");
        break;
      case " ":
        this.player.interact();
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
  destroy() {
    if (this.recipeList && typeof this.recipeList.destroy === "function") this.recipeList.destroy();
  }
}

export default GameScene;
