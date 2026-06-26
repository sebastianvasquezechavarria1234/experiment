import * as THREE from 'three';
import { createScene } from './components/Scene.js';
import { createCamera } from './components/Camera.js';
import { createRenderer } from './components/Renderer.js';
import { createControls } from './components/Controls.js';
import { createSphere, updateSphere } from './components/Sphere.js';

export class App {
  constructor() {
    this.scene = createScene();
    this.camera = createCamera();
    this.renderer = createRenderer();
    this.controls = createControls(this.camera, this.renderer.domElement);

    this.sphere = createSphere();
    this.scene.add(this.sphere);

    this.clock = new THREE.Clock();
    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    this.controls.update();
    updateSphere(this.sphere, elapsedTime);

    this.renderer.render(this.scene, this.camera);
  }
}
