import { Group } from 'three';

class Floor extends Group {
    constructor() {
        // Call parent Group() constructor
        super();
        this.name = 'Floor';
        
        const floorGeometry = new PlaneGeometry(1, 1);


        const floorMaterial = new MeshStandardMaterial({
            color: 0x00ff00,  // green
            roughness: 0.5,
            metalness: 0.1,
            side: DoubleSide, // visible from both sides
        });

        // create mesh s
        const floorMesh = new Mesh(floorGeometry, floorMaterial);

        // rotate to lie flat 
        floorMesh.rotation.x = -Math.PI / 2;

        // 5. Add mesh to this Group
        this.add(floorMesh);
        
    }
}

export default Floor;
