import * as THREE from 'three';
import { sphereVertexShader } from '../shaders/sphereVertex.glsl.js';
import { sphereFragmentShader } from '../shaders/sphereFragment.glsl.js';

export function createSphere() {
  const geometry = new THREE.SphereGeometry(1, 128, 128);

  const material = new THREE.ShaderMaterial({
    vertexShader: sphereVertexShader,
    fragmentShader: sphereFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uHover: { value: 0 },
      uClick: { value: 0 },
    },
  });

  return new THREE.Mesh(geometry, material);
}
