import * as THREE from 'three';
import { sphereVertexShader } from '../shaders/sphereVertex.glsl.js';
import { sphereFragmentShader } from '../shaders/sphereFragment.glsl.js';

export function createSphere() {
  const geometry = new THREE.SphereGeometry(1, 64, 64);

  const material = new THREE.ShaderMaterial({
    vertexShader: sphereVertexShader,
    fragmentShader: sphereFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uHover: { value: 0 },
      uExplosion: { value: 0 },
    },
    side: THREE.FrontSide,
    wireframe: false,
  });

  const sphere = new THREE.Mesh(geometry, material);
  sphere.userData.originalPositions = geometry.attributes.position.array.slice();
  return sphere;
}

export function updateSphere(sphere, elapsedTime) {
  sphere.material.uniforms.uTime.value = elapsedTime;
}

export function setSphereMouse(sphere, mouse) {
  sphere.material.uniforms.uMouse.value.copy(mouse);
}

export function setSphereHover(sphere, value) {
  sphere.material.uniforms.uHover.value = value;
}

export function setSphereExplosion(sphere, value) {
  sphere.material.uniforms.uExplosion.value = value;
}
