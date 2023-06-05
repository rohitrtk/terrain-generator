import "./style/style.css";

import * as THREE from "three";
import { GUI } from "dat.gui";

import Controls from "./controls";
import Terrain from "./terrain";
import renderer from "./renderer";

// Scene, camera, and renderer initilization
const scene = new THREE.Scene();
const clock = new THREE.Clock();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(30);

const mainGroup = new THREE.Group();
// Terrain
let terrain = new Terrain();
mainGroup.add(terrain.Get());

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
ambientLight.position.set(10, 25, 10);
mainGroup.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(100, -100, 40);
directionalLight.lookAt(terrain.Get().position);
mainGroup.add(directionalLight);
terrain.Get().add(directionalLight);

// Helpers
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
const axesHelper = new THREE.AxesHelper(5);
mainGroup.add(directionalLightHelper, axesHelper);

// Controls
const controls = new Controls(camera, renderer.domElement);

// GUI Controls
const gui = new GUI();

const terrainParams = terrain.GetParams();
const terrainFolder = gui.addFolder("Terrain");
terrainFolder.add(terrainParams, "widthSegments", 1, 1000);
terrainFolder.add(terrainParams, "heightSegments", 1, 1000);
terrainFolder.add(terrainParams, "width", 1, 1000);
terrainFolder.add(terrainParams, "height", 1, 1000);
terrainFolder.add(terrainParams, "displacementScale", 1, 50);
terrainFolder.add({ wireframe: false }, "wireframe").onChange(val => terrain.GetMaterial().wireframe = val);

const noiseParams = terrain.GetNoiseParams();
const noiseFolder = gui.addFolder("Noise");
noiseFolder.add(noiseParams, "octaves", 1, 100);
noiseFolder.add(noiseParams, "persistance", 1, 20);
noiseFolder.add(noiseParams, "lacunarity", 1, 10);
noiseFolder.add(noiseParams, "exponent", 1, 10);

const lightingFolder = gui.addFolder("Lighting");
lightingFolder.add(directionalLight.position, "x", -500, 500, 1);
lightingFolder.add(directionalLight.position, "y", -500, 500, 1);
lightingFolder.add(directionalLight.position, "z", -500, 500, 1);

gui.add({
  generate: function () {
    scene.remove(terrain.Get());
    terrain.Generate();
    renderer.shadowMap.needsUpdate = true;
    scene.add(terrain.Get());
  }
}, "generate").name("Generate Terrain");

scene.add(mainGroup);

// Render loop
const animate = () => {
  requestAnimationFrame(animate);
  renderer.setClearColor(0x949494)

  controls.Update(clock.getDelta());
  renderer.render(scene, camera);
}

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = () => animate();

animate();
