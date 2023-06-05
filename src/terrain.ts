import * as THREE from "three";
import { generateHeightmap, NoiseParams } from "./heightmap";

import vertexShader from "./shaders/vs.glsl";
import fragmentShader from "./shaders/fs.glsl";

interface TerrainParams {
  width: number;
  height: number;
  widthSegments: number,
  heightSegments: number;
  displacementScale: number;
}

export default class Terrain {
  private geometry: THREE.PlaneGeometry;
  private material: THREE.MeshStandardMaterial | THREE.ShaderMaterial;
  private mesh: THREE.Mesh;

  private terrainParams: TerrainParams;
  private noiseParams: NoiseParams;

  constructor(params: TerrainParams = { width: 100, height: 100, widthSegments: 100, heightSegments: 100, displacementScale: 20 }) {
    const { width, height, widthSegments, heightSegments, displacementScale } = params;

    this.terrainParams = {
      width,
      height,
      widthSegments,
      heightSegments,
      displacementScale,
    }

    this.noiseParams = {
      octaves: 3,
      persistance: 1,
      lacunarity: 4,
      exponent: 2
    }

    this.Generate();
  }

  public Generate(): THREE.Mesh {
    this._GenerateGeometry();
    this._GenerateMaterial();
    this._GenerateMesh();

    return this.mesh;
  }

  private _GenerateGeometry(): void {
    const { width, height, widthSegments, heightSegments } = this.terrainParams;
    this.geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
  }

  private _GenerateMaterial(): void {
    const { displacementScale } = this.terrainParams;
    const displacementMap = generateHeightmap(512, 512, this.noiseParams);

    // For debugging
    const useStandardMaterial = false;

    // ==================== MESH STANDARD MATERIAL ====================
    if (useStandardMaterial) {
      this.material = new THREE.MeshStandardMaterial({
        color: 0xC1F376,
        //wireframe: false,
        bumpMap: displacementMap,
        displacementMap,
        bumpScale: 2,
        displacementScale,
        side: THREE.FrontSide,
      });
    }
    // ==================== SHADER MATERIAL ====================
    else {
      const uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib["lights"],
        {
          heightmapTexture: { value: displacementMap },
          heightmapScale: { value: displacementScale }
        }
      ]);
      console.log(uniforms);

      this.material = new THREE.ShaderMaterial({
        side: THREE.FrontSide,
        uniforms,
        vertexShader,
        fragmentShader,
        lights: true,
      });
    }
  }

  private _GenerateMesh(): void {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.y = -2;
    this.mesh.scale.set(1, 1, 2);

    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
  }

  public Get(): THREE.Mesh {
    return this.mesh;
  }

  public GetMaterial(): THREE.MeshStandardMaterial | THREE.ShaderMaterial {
    return this.material;
  }

  public GetGeometry(): THREE.PlaneGeometry {
    return this.geometry;
  }

  public GetNoiseParams(): NoiseParams {
    return this.noiseParams;
  }

  public GetParams(): TerrainParams {
    return this.terrainParams;
  }
}
