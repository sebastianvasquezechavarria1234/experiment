import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.minDistance = 2;
  controls.maxDistance = 6;
  return controls;
}
