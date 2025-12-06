import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './toon_cat_free.glb';
import * as THREE from 'three';

class ToonCat extends Group {
    constructor(parent) {
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            isAnimating: false
        };

        // Load object
        const loader = new GLTFLoader();

        this.name = 'cat';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
            
            this.model = gltf.scene;
            
            // setting up animation mixer
            if (gltf.animations && gltf.animations.length > 0) {
                this.mixer = new THREE.AnimationMixer(this.model);
                this.animations = {};
                
                // Store all animations by name
                gltf.animations.forEach((clip) => {
                    console.log('Animation found:', clip.name);
                    this.animations[clip.name] = this.mixer.clipAction(clip);
                    // by default, don't play the animation
                    this.action = this.mixer.clipAction(gltf.animations[0]);
                    this.action.stop();
                });

            }
            
            window.addEventListener('keydown', (e) => this.handleKeyDown(e));
            window.addEventListener('keyup', (e) => this.handleKeyUp(e));
            // cat scale
            this.model.scale.set(0.001, 0.001, 0.001);
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);

    }
    handleKeyDown(event) {
        // Only start if not already animating (prevents retriggering)
        if ((event.code === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') 
            && !this.state.isAnimating) {
            this.startAnimation();
        }
    }

    handleKeyUp(event) {
        // Stop when key is released
        if (event.code === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            this.stopAnimation();
        }
    }

    startAnimation() {
        if (!this.action) return;
        this.action.play();
        this.state.isAnimating = true;
    }

    stopAnimation() {
        if (!this.action) return;
        this.action.stop();
        this.state.isAnimating = false;
    }


    update(timeStamp) {
        // Update animations if they exist
        if (this.mixer) {
            // deltaTime calculation - you might want to pass delta from parent instead
            const delta = 0.016; // ~60fps, or calculate properly
            this.mixer.update(delta);
        }

    }
}

export default ToonCat;