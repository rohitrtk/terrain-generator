import * as THREE from "three";

import { FlyControls } from "three/addons/controls/FlyControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default class Controls {
  private orbitControls: OrbitControls;
  private flyControls: FlyControls;

  movementSpeed: number = 50;

  constructor(camera: THREE.PerspectiveCamera, renderDomElement: HTMLCanvasElement) {
    this.orbitControls = new OrbitControls(camera, renderDomElement);
    this.orbitControls.enablePan = false;

    this.flyControls = new FlyControls(camera, renderDomElement);
    this.flyControls.movementSpeed = this.movementSpeed;
    this.flyControls.dragToLook = true;
  }

  public Update(deltaTime: number) {
    this.flyControls.update(deltaTime);
    this.orbitControls.update();
  }

  public GetOrbitControls(): OrbitControls {
    return this.orbitControls;
  }

  public GetFlyControls(): FlyControls {
    return this.flyControls;
  }
}
