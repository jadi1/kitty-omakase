import { Scene } from "three";
import WelcomeScreen from "../ui/WelcomeScreen.js";
import { GameScene } from "./index.js"; // optional if you want to import here

class WelcomeScene extends Scene {
    constructor({ onStart } = {}) {
        super();
        this._onStart = onStart || (() => {});
        this.ui = new WelcomeScreen({
            onStart: () => this._handleStart(),
            onRules: () => this._handleRules(),
        });
        this.ui.show();
        // Provide no-op handlers so app-level listeners can call them safely
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    _handleStart() {
        // Clean up UI for leaving this scene
        this.ui.destroy();
        this._onStart();
    }

    _handleRules() {
        this.ui.openRules();
    }

    // Optional update() if you want any animation in the welcome scene
    update(/*timeStamp*/) {
        // no-op for now
    }

    handleKeyDown(/*evt*/) {
        // no-op (or add keyboard shortcuts to start/open rules)
    }

    handleKeyUp(/*evt*/) {
        // no-op
    }

    destroy() {
        // in case the scene is removed directly
        this.ui.destroy();
    }
}
export default WelcomeScene;