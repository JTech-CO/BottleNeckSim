import { CONFIG } from './constants.js';

// 시뮬레이션 상태 저장 객체
export const simState = {
    cpuRadius: 15,
    gpuRadius: 15,
    flowSpeedCPU: 1.0,
    flowSpeedGPU: 1.0,
};

// 로그 출력 헬퍼
export function log(msg, type='') {
    const display = document.getElementById('status-display');
    if (!display) return;
    const div = document.createElement('div');
    div.className = 'log-entry ' + type;
    div.innerText = `> ${msg}`;
    display.appendChild(div);
    display.scrollTop = display.scrollHeight;
}

// 병목 계산 및 상태 업데이트
export function calculateBottleneck() {
    log("CALCULATING...", "log-entry");

    const cpuCores = parseFloat(document.getElementById('cpu-cores').value) || 6;
    const cpuClock = parseFloat(document.getElementById('cpu-clock').value) || 3.5;
    const cpuIPC = parseFloat(document.getElementById('cpu-ipc').value) || 1.0;
    const gpuCores = parseFloat(document.getElementById('gpu-cores').value) || 3500;
    const gpuClock = parseFloat(document.getElementById('gpu-clock').value) || 1700;
    const resFactor = parseFloat(document.getElementById('sim-res').value) || 1;

    const cpuScore = (cpuClock * 1000) * cpuIPC * (Math.sqrt(cpuCores) * 2.0);
    const gpuRaw = (gpuCores * gpuClock) / 150;
    const gpuEffective = gpuRaw / resFactor;

    log(`CPU: ${Math.floor(cpuScore)} | GPU: ${Math.floor(gpuEffective)}`);

    const ratio = cpuScore / gpuEffective;
    const indicator = document.getElementById('bottleneck-indicator');

    // 반지름 계산 (시각화용)
    let cRad = (cpuScore / 25000) * 20;
    let gRad = (gpuEffective / 25000) * 20;
    simState.cpuRadius = Math.max(6, Math.min(28, cRad));
    simState.gpuRadius = Math.max(6, Math.min(28, gRad));

    // 병목 판정 로직
    if (ratio < 0.85) {
        log(">> CPU BOTTLENECK", "log-err");
        if(indicator) {
            indicator.style.display = 'block';
            indicator.innerText = "WARNING: CPU BOTTLENECK";
            indicator.style.color = '#ff3333';
            indicator.style.borderColor = '#ff3333';
        }
        simState.flowSpeedCPU = 0.5 * ratio;
        simState.flowSpeedGPU = 2.5;
    } else if (ratio > 1.25) {
        log(">> GPU BOTTLENECK", "log-warn");
        if(indicator) {
            indicator.style.display = 'block';
            indicator.innerText = "WARNING: GPU BOTTLENECK";
            indicator.style.color = '#ffcc00';
            indicator.style.borderColor = '#ffcc00';
        }
        simState.flowSpeedCPU = 2.5;
        simState.flowSpeedGPU = 0.6 / ratio;
    } else {
        log("SYSTEM BALANCED.", "log-entry");
        if(indicator) indicator.style.display = 'none';
        simState.flowSpeedCPU = 1.5;
        simState.flowSpeedGPU = 1.5;
    }
}