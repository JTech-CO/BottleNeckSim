import { scene } from './scene.js';
import { materials } from './materials.js';
import { CONFIG } from './constants.js';

const pipeGroup = new THREE.Group();
scene.add(pipeGroup);

export function buildPipes(cRad, gRad) {
    while(pipeGroup.children.length > 0){ 
        const obj = pipeGroup.children[0];
        if(obj.geometry) obj.geometry.dispose();
        pipeGroup.remove(obj); 
    }

    const segs = 48;
    const inputR = CONFIG.INPUT_RADIUS;
    
    // Geometry Helper
    const createPart = (rTop, rBot, height, transX, rotZ_PI_div) => {
        const geo = new THREE.CylinderGeometry(rTop, rBot, height, segs, 1, true);
        if(rotZ_PI_div) geo.rotateZ(Math.PI / rotZ_PI_div);
        geo.translate(transX, 0, 0);
        
        const mesh = new THREE.Mesh(geo, materials.solid);
        const wire = new THREE.Mesh(geo, materials.wire);
        pipeGroup.add(mesh);
        pipeGroup.add(wire);
    };

    // 1. INPUT
    createPart(inputR, inputR, 40, -60, 2);
    // 2. FUNNEL TO CPU
    createPart(inputR, cRad, 10, -35, -2);
    // 3. CPU
    createPart(cRad, cRad, 40, -10, 2);
    // 4. FUNNEL TO GPU
    createPart(cRad, gRad, 20, 20, -2);
    // 5. GPU
    createPart(gRad, gRad, 50, 55, 2);

}
