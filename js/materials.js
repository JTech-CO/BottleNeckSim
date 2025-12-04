export const materials = {
    wire: new THREE.MeshBasicMaterial({ 
        color: 0x00FFFF, 
        wireframe: true,
        opacity: 0.15,
        transparent: true
    }),
    solid: new THREE.MeshPhongMaterial({ 
        color: 0x103050, 
        emissive: 0x001020,
        shininess: 90,
        transparent: true,
        opacity: 0.4, // 기본값
        side: THREE.DoubleSide,
        flatShading: false
    })
};

export function setOpacity(val) {
    materials.solid.opacity = val;
}