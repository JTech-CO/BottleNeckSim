import { scene, camera, renderer, controls } from './scene.js';
import { initParticles, updateParticles } from './particles.js';
import { buildPipes } from './pipes.js';
import { calculateBottleneck, simState } from './simulation.js';
import { initUI } from './ui.js';

// 1. 초기화
initParticles();
initUI();

// 2. 초기 계산 및 모델 생성
calculateBottleneck();
buildPipes(simState.cpuRadius, simState.gpuRadius);

// 3. 애니메이션 루프
function animate() {
    requestAnimationFrame(animate);
    
    controls.update();     // 카메라 컨트롤
    updateParticles();     // 입자 이동
    
    renderer.render(scene, camera);
}

animate();