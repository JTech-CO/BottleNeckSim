import { calculateBottleneck, simState } from './simulation.js';
import { buildPipes } from './pipes.js';
import { setOpacity } from './materials.js';

export function initUI() {
    // 업데이트 버튼
    const btn = document.getElementById('btn-update');
    if(btn) {
        btn.addEventListener('click', () => {
            calculateBottleneck(); // 상태 업데이트
            buildPipes(simState.cpuRadius, simState.gpuRadius); // 파이프 재생성
        });
    }

    // 투명도 슬라이더
    const slider = document.getElementById('opacity-slider');
    if(slider) {
        slider.addEventListener('input', (e) => {
            setOpacity(e.target.value / 100);
        });
    }
}