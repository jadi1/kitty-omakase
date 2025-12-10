import { Scene, Color } from 'three';
import { BasicLights } from 'lights';
import { Floor, ToonCat} from 'objects';

class KitchenScene extends Scene {
	constructor() {
		// Call parent Scene() constructor
		super();

		// Init state
		this.state = {
				updateList: [],
		};

		// Set background to a nice color
		this.background = new Color(0x7ec0ee);
		// Add meshes to scene
		this.player = new ToonCat(this);
		this.player.scale.set(2,2,2);
		this.player.position.set(0,.25,1);
		const floor = new Floor;
		floor.rotation.set(0,Math.PI/2,0);
		floor.position.set(0,0,-1);

		const lights = new BasicLights();
		this.add(floor, this.player, lights);

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
		const { updateList } = this.state;

		// Call update for each object in the updateList
		for (const obj of updateList) {
				obj.update(timeStamp);
		}
	}
}

export default KitchenScene;
