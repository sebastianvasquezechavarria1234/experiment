export const sphereVertexShader = /* glsl */ `
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    vec3 pos = position;

    pos += normal * sin(pos.x * 4.0 + uTime) * 0.05;
    pos += normal * sin(pos.y * 4.0 + uTime * 1.3) * 0.05;
    pos += normal * sin(pos.z * 4.0 + uTime * 0.7) * 0.05;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;
