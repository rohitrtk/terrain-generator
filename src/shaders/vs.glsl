uniform sampler2D heightmapTexture;
uniform float heightmapScale;

varying float vAmount;
varying vec3 vNormal;

void main() {
  vec4 heightmapData = texture2D(heightmapTexture, uv);
  vAmount = heightmapData.r;

  vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

  vec3 newPosition = position + normal * heightmapScale * vAmount;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}