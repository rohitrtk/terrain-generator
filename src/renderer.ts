import * as THREE from "three";

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("scene") as HTMLCanvasElement
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

export default renderer;