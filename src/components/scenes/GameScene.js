import { Scene, Color, BoxGeometry, MeshBasicMaterial, Mesh, BackSide, TextureLoader } from "three";
import RecipeList from "../ui/RecipeList.js";
import {
  Floor,
  ToonCat,
  Table,
  Cabinet,
  Trash,
  Stove,
  Delivery,
  CuttingBoardTable,
  Plate,
  Pot,
  FishBin,
  NoriBin,
  RiceBin,
  TunaBin,
} from "objects";
import { BasicLights } from "lights";
import { numRows, numCols, tileSize, food } from "../constants";
import * as THREE from "three";

// function makeTextSprite(message, size = 64, color = "red") {
//   const canvas = document.createElement("canvas");
//   const context = canvas.getContext("2d");
//   context.font = `${size}px Arial`;
//   context.fillStyle = color;
//   context.fillText(message, 0, size);

//   const texture = new THREE.CanvasTexture(canvas);
//   const material = new THREE.SpriteMaterial({ map: texture });
//   const sprite = new THREE.Sprite(material);
//   sprite.scale.set(0.5, 0.25, 1); // world units
//   return sprite;
// }

const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

const speed = 3;  // adjust as needed

class GameScene extends Scene {
  constructor() {
    // Call parent Scene() constructor
    super();

    this.rows = numRows;
    this.cols = numCols;

    // // optional grid helper
    // const gridHelper = new THREE.GridHelper(tileSize * numCols, numCols, 0x00ff00, 0x444444);
    // this.add(gridHelper);

    // // loop through each cell
    // for (let r = 0; r < numRows; r++) {
    //   for (let c = 0; c < numCols; c++) {
    //     const x = c * tileSize + tileSize / 2; // world X coordinate of cell center
    //     const z = r * tileSize + tileSize / 2; // world Z coordinate of cell center
    //     const y = 0.05; // slightly above ground

    //     const sprite = makeTextSprite({message: `(${x.toFixed(1)}, ${z.toFixed(1)})`, // show world coords
    //     });

    //     sprite.position.set(x, y, z);
    //     this.add(sprite);
    //   }
    // }

    this.worldBounds = {
      minX: .5,
      maxX: numCols - 1.5,
      minZ: .5,
      maxZ: numRows - 1.5
    }
    // Visualize world bounds
    // const width = this.worldBounds.maxX - this.worldBounds.minX;
    // const depth = this.worldBounds.maxZ - this.worldBounds.minZ;
    // const height = 1; // for wireframe box height

    // const geometry = new THREE.BoxGeometry(width, height, depth);
    // const material = new THREE.MeshBasicMaterial({
    //   color: 0x00ff00,
    //   wireframe: true,
    //   opacity: 0.5,
    //   transparent: true
    // });

    // const boundsBox = new THREE.Mesh(geometry, material);
    // boundsBox.position.set(
    //   (this.worldBounds.minX + this.worldBounds.maxX) / 2,
    //   height / 2,
    //   (this.worldBounds.minZ + this.worldBounds.maxZ) / 2
    // );

    // this.add(boundsBox);

    this.clock = new THREE.Clock();

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

    this.obstacles = [
      { minX: 2.5, maxX: 4.5, minZ: 2.5, maxZ: 3.5}, // hardcode stove bounds
    ];
    //visualize
    // Assuming you have a reference to your scene
    // this.obstacles.forEach((obs) => {
    //   const width = obs.maxX - obs.minX;
    //   const depth = obs.maxZ - obs.minZ;
    //   const height = 2; // arbitrary height for visualization

    //   const geometry = new THREE.BoxGeometry(width, height, depth);
    //   const material = new THREE.MeshBasicMaterial({
    //     color: 0xff0000,
    //     wireframe: true,
    //   });
    //   const box = new THREE.Mesh(geometry, material);

    //   // Position box at the center of the obstacle
    //   box.position.set(
    //     (obs.minX + obs.maxX) / 2,
    //     height / 2, // lift so it's above floor
    //     (obs.minZ + obs.maxZ) / 2
    //   );

      // this.add(box); // add to scene or parent group
    // });
    // Set background to a nice color
    // this.background = new Color(0x7ec0ee);
    const loader = new TextureLoader();
    const wallColor = 0xAB6D41;
    const floorColor = 0xFFDB82;
    const backWallColor = 0x73411F;

    const materials = [
      new MeshBasicMaterial({ color: wallColor, side: BackSide }), // left wall. try with image, map: loader.load('./jwall.jpg')
      new MeshBasicMaterial({ color: wallColor, side: BackSide }), // right wall
      new MeshBasicMaterial({ color: wallColor, side: BackSide }), // top wall  
      new MeshBasicMaterial({ color: floorColor, side: BackSide }), // floor
      new MeshBasicMaterial({ color: wallColor, side: BackSide }), // front wall
      new MeshBasicMaterial({ color: backWallColor, side: BackSide })  // back wall
    ];

    const skyboxGeometry = new BoxGeometry(14, 21, 10); // xzy
    const skybox = new Mesh(skyboxGeometry, materials);
    
    // Center the skybox around your scene
    skybox.position.set((numCols - 1) / 2, 10, (numRows - 1) / 2 + 1);
    
    this.add(skybox);
    

    // Add meshes to scene
    this.player = new ToonCat(this, 2, 1);
    const lights = new BasicLights();

    // recipe list ui overlay
    this.recipeList = new RecipeList();
    this.recipeList.show();

    // floor
    const floor = new Floor();
    floor.rotation.set(0, 0, 0);
    floor.scale.set(0.5, 0.5, 0.5);
    floor.position.set((numCols - 1) / 2, -0.1, (numRows - 1) / 2);

    this.add(floor, this.player, lights);

    const initialFurniture = [
      ["t", "t", "c", "d", " ", "t", "t", "t"],
      ["t", " ", " ", " ", " ", " ", " ", "t"],
      ["x", " ", " ", " ", " ", " ", " ", "u"],
      ["t", " ", " ", "s", "s", " ", " ", "u"],
      ["t", " ", " ", " ", " ", " ", " ", "t"],
      ["t", "t", "1", "2", "3", "4", "t", "t"],
    ];
    this.populateFurnitureGrid(initialFurniture);

    const initialItems = [
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", "p"],
      [" ", " ", " ", " ", " ", " ", " ", ""],
      [" ", " ", " ", "o", "o", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
    ];
    this.plateSpawnRow = 1;
    this.plateSpawnCol = 7;
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
          case "u":
            furnitureObject = new CuttingBoardTable(this, row, col);
            this.state.furnitureGrid[row][col] = furnitureObject;
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
          case "4":
            furnitureObject = new TunaBin(this, row, col);
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

  removeFromUpdateList(object) {
    const index = this.state.updateList.indexOf(object);
    if (index > -1) {
      this.state.updateList.splice(index, 1);
    }
  }

  
  handleKeyDown(event) {
    switch (event.key) {
      case "w":
      case "ArrowUp":
        keys.forward = true;
        break;
      case "s":
      case "ArrowDown":
        keys.backward = true;
        break;
      case "a":
      case "ArrowLeft":
        keys.left = true;
        break;
      case "d":
      case "ArrowRight":
        keys.right = true;
        break;
      case "e":
        this.player.pickupDrop();
        break;
      case " ":
        this.player.interact();
        break;
    }
  }


  handleKeyUp(event) {
    switch (event.key) {
      case "w":
      case "ArrowUp":
        keys.forward = false;
        break;
      case "s":
      case "ArrowDown":
        keys.backward = false;
        break;
      case "a":
      case "ArrowLeft":
        keys.left = false;
        break;
      case "d":
      case "ArrowRight":
        keys.right = false;
        break;
    }
  }

  update(timeStamp) {
    const updateList = this.state.updateList;
    const delta = this.clock.getDelta();
    
    const distance = speed * delta;
    let moveX = 0;
    let moveZ = 0;

    if (keys.forward)  moveZ -= 1;
    if (keys.backward) moveZ += 1;
    if (keys.left)     moveX -=  1;
    if (keys.right)    moveX +=  1;

    const len = Math.hypot(moveX, moveZ);

    // always rotate
    if (moveX !== 0 || moveZ !== 0) {
      this.player.rotationAngle = Math.atan2(moveX, moveZ);
    }

    if (len > 0) {
      this.player.move(moveX, moveZ, distance, this.worldBounds, this.obstacles);
    }
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
