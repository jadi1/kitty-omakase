/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { WebGLRenderer, PerspectiveCamera, Vector3 } from "three";
import { GameScene, WelcomeScene } from "scenes";
import { numRows, numCols } from "./components/constants";
import { loadAllMasterMeshes } from "./components/objects/Items/FoodItem/loadMasterMeshes";
import * as THREE from 'three';

async function startGame() {
  // load all meshes 
  await loadAllMasterMeshes();

  // Initialize core ThreeJS components
  const camera = new PerspectiveCamera();
  const renderer = new WebGLRenderer({ antialias: true });
  
  // Set up camera
  camera.position.set((numCols - 1) / 2, 10, numRows - 1);

  // Set up renderer, canvas, and minor CSS adjustments
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputEncoding = THREE.sRGBEncoding;
  const canvas = renderer.domElement;
  canvas.style.display = "block"; // Removes padding below canvas
  document.body.style.margin = 0; // Removes margin around page
  document.body.style.overflow = "hidden"; // Fix scrolling
  document.body.appendChild(canvas);

  // Set up orbit controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 4;
  controls.maxDistance = 16;
  controls.target.set((numCols - 1) / 2, 0, (numRows - 1) / 2);
  controls.update();

  let currentScene;

  const switchToWelcome = () => {
    if (currentScene) {
      currentScene.destroy();
    }
    currentScene = new WelcomeScene({
      onStart: switchToGame
    });
  };

  const switchToGame = () => {
    if (currentScene) {
      currentScene.destroy();
    }
    currentScene = new GameScene(switchToWelcome, switchToGame);
  };

  // Start with welcome scene
  switchToWelcome();
  
  // Render loop
  const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(currentScene, camera);
    currentScene.update && currentScene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
  };
  window.requestAnimationFrame(onAnimationFrameHandler);

  // Resize Handler
  const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  };
  windowResizeHandler();
  window.addEventListener("resize", windowResizeHandler, false);
  window.addEventListener("keydown", (e) => currentScene && currentScene.handleKeyDown && currentScene.handleKeyDown(e));
  window.addEventListener("keyup", (e) => currentScene && currentScene.handleKeyUp && currentScene.handleKeyUp(e));
}
await startGame();