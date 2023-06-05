import { NoiseFunction2D, createNoise2D } from 'simplex-noise';
import { CanvasTexture, UVMapping, RepeatWrapping } from "three";

export type NoiseParams = {
  persistance: number;
  lacunarity: number;
  exponent: number;
  octaves: number;
}

export const generateHeightmap = (width: number, height: number, options: NoiseParams): CanvasTexture => {
  const canvas: HTMLCanvasElement = document.createElement("canvas") as HTMLCanvasElement;
  //const canvas: HTMLCanvasElement = document.getElementById("debug") as HTMLCanvasElement;

  const ctx = canvas!.getContext("2d");
  const imageData = ctx!.createImageData(width, height);
  const data = imageData.data;

  const noise2D: NoiseFunction2D = createNoise2D();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = x / width - 0.5;
      const ny = y / height - 0.5;

      const n = getNoise(nx, ny, noise2D, options);

      const index = (x + y * width) * 4;
      const c = n * 255;
      data[index] = c;
      data[index + 1] = c;
      data[index + 2] = c;
      data[index + 3] = 255;
    }
  }

  ctx!.putImageData(imageData, 0, 0);

  const texture: CanvasTexture =
    new CanvasTexture(canvas, UVMapping, RepeatWrapping, RepeatWrapping);
  canvas.remove();

  return texture;
}

const getNoise = (x: number, y: number, noiseFunc: NoiseFunction2D, options: NoiseParams): number => {
  const { persistance, lacunarity, exponent, octaves } = options;
  const G = Math.pow(2, -persistance);

  let amplitude = 1.0;
  let frequency = 1.0;
  let normalization = 0;
  let total = 0;
  for (let o = 0; o < octaves; o++) {
    const nv = noiseFunc(x * frequency, y * frequency) * 0.5 + 0.5;
    total += nv * amplitude;

    normalization += amplitude;
    amplitude *= G;
    frequency *= lacunarity;
  }

  return Math.pow(total / normalization, exponent);
}