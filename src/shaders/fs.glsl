#define MAX_DIR_LIGHTS 1

struct DirectionLight {
  vec3 direction;
  vec3 color;
};

uniform DirectionLight directionalLights[MAX_DIR_LIGHTS];
uniform vec3 ambientLightColor;

varying float vAmount;
varying vec3 vPosition;
varying vec3 vNormal;

vec4 terrainColours() {
  return vec4(0.5, 0.5, 0.0, 1.0);

  vec3 goldenBrown  = vec3(0.62, 0.54, 0.28);
  vec3 green        = vec3(0.21, 0.33, 0.19);
  vec3 brown        = vec3(0.40, 0.32, 0.34);
  vec3 pink         = vec3(0.69, 0.55, 0.57);

  vec3 plains = (smoothstep(0.0, 0.35, vAmount)  - smoothstep(0.34, 0.35, vAmount)) * goldenBrown;
  vec3 grass  = (smoothstep(0.3, 0.32, vAmount)   - smoothstep(0.30, 0.40, vAmount)) * green;
  vec3 rock   = (smoothstep(0.30, 0.46, vAmount)  - smoothstep(0.33, 0.05, vAmount)) * brown;
  vec3 peak   = (smoothstep(0.43, 0.8, vAmount)) * pink;

  return vec4(plains + grass + rock + peak, 1.0);
}

void main() {
  // Directional Light
  vec4 directionalLightTotal = vec4(0.0, 0.0, 0.0, 1.0);

  for(int i = 0; i < MAX_DIR_LIGHTS; i++) {
    float lightDirection = dot(directionalLights[i].direction, vNormal);
    directionalLightTotal.rgb += clamp(lightDirection, 0.0, 1.0) * directionalLights[i].color;
  }

  // Ambient Light
  vec4 ambientLightTotal = vec4(ambientLightColor, 1.0);
  gl_FragColor = terrainColours() * directionalLightTotal * ambientLightTotal;
}