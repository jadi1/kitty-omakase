import { Scene, Color, BoxGeometry, MeshBasicMaterial, Mesh, BackSide, TextureLoader } from "three";
import RecipeList from "../ui/RecipeList.js";
import ScoreLabel from "../ui/ScoreLabel.js";
import TimerLabel from "../ui/TimerLabel.js";
import PauseModal from "../ui/PauseModal.js";
import RulesModal from "../ui/RulesModal.js";
import MuteButton from "../ui/MuteButton.js";
import EndScreenModal from "../ui/EndScreenModal.js";
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
import { numRows, numCols, PLATEGENERATOR} from "../constants";
import * as THREE from "three";
import bgMusic from '../../assets/background-music.mp3';

const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

const speed = 5;  // adjust as needed

class GameScene extends Scene {
  constructor(onQuit, onRestart) {
    // Call parent Scene() constructor
    super();

    this.levelTime = 3 * 60; // 3 minutes
    this.elapsedLevelTime = 0;
    this.timerLabel = new TimerLabel(); // reuse ScoreLabel or create a TimerLabel
    this.timerLabel.show();
    this.updateTimerLabel();

    this.onQuit = onQuit;
    this.onRestart = onRestart;
    this.isPaused = false;
    this.isMuted = false;
    this.isGameEnd = false;

    // init bg music
    this.backgroundMusic = new Audio(bgMusic); // Replace with your audio file path
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3;

    this.rows = numRows;
    this.cols = numCols;

    this.worldBounds = {
      minX: .5,
      maxX: numCols - 1.5,
      minZ: .5,
      maxZ: numRows - 1.5
    }

    this.clock = new THREE.Clock();
    this.clock.start()
    this.score = new ScoreLabel();
    this.score.show();

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

    const loader = new TextureLoader();
    const wallColor = 0xAB6D41;
    const floorColor = 0xFFDB82;
    const backWallColor = 0x73411F;

    const materials = [
      new MeshBasicMaterial({ color: wallColor, side: BackSide }), // left wall
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

    // Initialize modals
    this.rulesModal = new RulesModal();
    this.pauseModal = new PauseModal({
      onRules: () => this.rulesModal.show(),
      onQuit: () => this.handleQuit(),
      onPause: () => this.togglePause()
    });
    this.muteButton = new MuteButton({
      onToggleMute: (isMuted) => this.toggleMute(isMuted)
    });
    this.endScreenModal = new EndScreenModal({
      onRestart: () => this.handleRestart(),
      onQuit: () => this.handleQuit()
    });
    // TEST BUTTON - Remove this in production
    this._buildTestButton();

    this.startMusic();

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
      [" ", " ", " ", " ", " ", " ", "p", " "],
      [" ", " ", " ", " ", " ", " ", " ", ""],
      [" ", " ", " ", " ", " ", " ", " ", ""],
      [" ", " ", " ", "o", "o", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " "],
    ];
    // hardcode plate generator table
    this.plateSpawnRow = 0;
    this.plateSpawnCol = 6;
    this.state.furnitureGrid[this.plateSpawnRow][this.plateSpawnCol].name = PLATEGENERATOR;
    
    this.populateItemGrid(initialItems);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  _buildTestButton() {
    // Test button for triggering end screen
    this.testButton = document.createElement("button");
    this.testButton.textContent = "TEST END";
    Object.assign(this.testButton.style, {
      position: "fixed",
      top: "140px",
      right: "20px",
      padding: "8px 12px",
      borderRadius: "10px",
      border: "none",
      background: "#4CAF50",
      color: "#fff",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "bold",
      boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
      zIndex: 9998,
    });
    this.testButton.addEventListener("click", () => this.handleEndGame());
    
    document.body.appendChild(this.testButton);
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
  handleRestart() {
    this.isGameEnd = false;
    this.endScreenModal.hide();
    // Stop music and reset keys
    this.stopMusic();
    keys.forward = false;
    keys.backward = false;
    keys.left = false;
    keys.right = false;

    this.elapsedLevelTime = 0;
    this.updateTimerLabel();
    this.clock.start();
    if (this.onRestart) this.onRestart();
  }

  handleQuit() {
    this.isPaused = false;
    this.pauseModal.hide();
    // Reset all movement keys when quitting
    keys.forward = false;
    keys.backward = false;
    keys.left = false;
    keys.right = false;
    this.stopMusic();
    if (this.onQuit) this.onQuit();
  }

  startMusic() {
    if (!this.isMuted) {
      this.backgroundMusic.play().catch(error => {
        console.log("Music autoplay prevented. User interaction required:", error);
      });
    }
  }
  stopMusic() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
  }

  toggleMute(isMuted) {
    this.isMuted = isMuted;
    if (this.isMuted) {
      this.backgroundMusic.pause();
    } else {
      if (!this.isPaused) {
        this.backgroundMusic.play().catch(error => {
          console.log("Music play error:", error);
        });
      }
    }
  }
  
  handleKeyDown(event) {
    if (event.key === "Escape" && !this.isGameEnd) {
      this.togglePause();
      return;
    }
    if (this.isPaused || this.isGameEnd) return;

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
    if (this.isPaused || this.isGameEnd) return;

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

  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.pauseModal.show();
      // Reset all movement keys when pausing
      keys.forward = false;
      keys.backward = false;
      keys.left = false;
      keys.right = false;
      this.backgroundMusic.pause();
      this.clock.stop();
    } else {
      this.clock.start();
      this.pauseModal.hide();
      if (!this.isMuted) {
        this.backgroundMusic.play().catch(error => {
          console.log("Music play error:", error);
        });
      }
    }
  }

  handleEndGame() {
    this.endScreenModal.show(this.score.score);
    this.isGameEnd = true;
    this.backgroundMusic.pause();
    this.clock.stop();
  }

  update(timeStamp) {
    if (this.isPaused || this.isGameEnd) return;

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
      obj.update(delta);
      // for pots and chopping, update their progress bar
    }

    // Update level timer
    this.elapsedLevelTime += delta;
    this.updateTimerLabel();

    if (this.elapsedLevelTime >= this.levelTime) {
      this.handleEndGame();
    }
  }

  updateTimerLabel() {
    const remaining = Math.max(0, this.levelTime - this.elapsedLevelTime);
    const minutes = Math.floor(remaining / 60);
    const seconds = Math.floor(remaining % 60);
    this.timerLabel.setText(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  }

  destroy() {
    if (this.recipeList && typeof this.recipeList.destroy === "function") {
      this.recipeList.destroy();
    }
    if (this.rulesModal && typeof this.rulesModal.destroy === "function") {
      this.rulesModal.destroy();
    }
    if (this.pauseModal && typeof this.pauseModal.destroy === "function") {
      this.pauseModal.destroy();
    }
    if (this.muteButton && typeof this.muteButton.destroy === "function") {
      this.muteButton.destroy();
    }
    if (this.endScreenModal && typeof this.endScreenModal.destroy === "function") {
      this.endScreenModal.destroy();
    }
    // Remove test button
    if (this.testButton && this.testButton.parentNode) {
      this.testButton.parentNode.removeChild(this.testButton);
    }
    // Stop and cleanup music
    this.stopMusic();
  }
}

export default GameScene;