import { scene } from './scene.js';
import { CONFIG } from './constants.js';
import { simState } from './simulation.js';

let particleSystem;
const particleCount = CONFIG.PARTICLE_COUNT;

export function initParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for(let i=0; i<particleCount*3; i+=3) {
        positions[i] = (Math.random() - 0.5) * 200; 
        positions[i+1] = 0; 
        positions[i+2] = 0; 
        colors[i] = 1; colors[i+1] = 1; colors[i+2] = 1;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({ size: 2.5, vertexColors: true });
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

// X 위치에 따른 파이프 반지름 계산
function getPipeRadiusAt(x) {
    const { X_FUNNEL1_START, X_CPU_START, X_CPU_END, X_FUNNEL2_START, X_GPU_START, INPUT_RADIUS } = CONFIG;
    const { cpuRadius, gpuRadius } = simState;

    if (x < X_FUNNEL1_START) return INPUT_RADIUS;
    if (x >= X_FUNNEL1_START && x < X_CPU_START) {
        const ratio = (x - X_FUNNEL1_START) / (X_CPU_START - X_FUNNEL1_START);
        return INPUT_RADIUS + (cpuRadius - INPUT_RADIUS) * ratio;
    }
    if (x >= X_CPU_START && x < X_CPU_END) return cpuRadius;
    if (x >= X_FUNNEL2_START && x < X_GPU_START) {
        const ratio = (x - X_FUNNEL2_START) / (X_GPU_START - X_FUNNEL2_START);
        return cpuRadius + (gpuRadius - cpuRadius) * ratio;
    }
    if (x >= X_GPU_START) return gpuRadius;
    return INPUT_RADIUS;
}

export function updateParticles() {
    if(!particleSystem) return;

    const pos = particleSystem.geometry.attributes.position.array;
    const col = particleSystem.geometry.attributes.color.array;
    const { flowSpeedCPU, flowSpeedGPU } = simState;
    const { X_CPU_START, X_FUNNEL2_START, X_END, X_START, INPUT_RADIUS } = CONFIG;

    for(let i=0; i<particleCount; i++) {
        const idx = i * 3;
        let x = pos[idx];
        let y = pos[idx+1];
        let z = pos[idx+2];

        // 1. 속도 및 색상 결정
        let speed = 1.0;
        if (x < X_CPU_START) { 
            speed = 1.8; 
            col[idx]=0.8; col[idx+1]=0.8; col[idx+2]=0.9; 
        } 
        else if (x >= X_CPU_START && x < X_FUNNEL2_START) {
            speed = flowSpeedCPU;
            if(flowSpeedCPU < 0.8) { col[idx]=1.0; col[idx+1]=0.2; col[idx+2]=0.2; }
            else { col[idx]=1.0; col[idx+1]=0.9; col[idx+2]=0.0; }
        } 
        else {
            speed = flowSpeedGPU;
            if(flowSpeedGPU < 0.8) { col[idx]=1.0; col[idx+1]=0.5; col[idx+2]=0.0; }
            else { col[idx]=0.0; col[idx+1]=1.0; col[idx+2]=0.5; }
        }

        x += speed;

        // 2. 파이프 벽 충돌 (가두기)
        const maxR = getPipeRadiusAt(x);
        const currentR = Math.sqrt(y*y + z*z);
        if (currentR > maxR) {
            const factor = maxR / currentR;
            y *= factor;
            z *= factor;
            x -= speed * 0.3; // 마찰
        }

        // 3. 순환
        if (x > X_END) {
            x = X_START;
            const r = (INPUT_RADIUS - 2) * Math.sqrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            y = r * Math.cos(theta);
            z = r * Math.sin(theta);
        }

        pos[idx] = x;
        pos[idx+1] = y;
        pos[idx+2] = z;
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleSystem.geometry.attributes.color.needsUpdate = true;
}