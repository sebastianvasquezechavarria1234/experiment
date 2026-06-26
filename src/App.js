import * as THREE from 'three';
import { createScene } from './components/Scene.js';
import { createCamera } from './components/Camera.js';
import { createRenderer } from './components/Renderer.js';
import { createControls } from './components/Controls.js';
import {
  createSphere,
  updateSphere,
  setSphereMouse,
  setSphereHover,
  setSphereExplosion,
} from './components/Sphere.js';

export class App {
  constructor() {
    this.scene = createScene();
    this.camera = createCamera();
    this.renderer = createRenderer();
    this.controls = createControls(this.camera, this.renderer.domElement);

    this.sphere = createSphere();
    this.scene.add(this.sphere);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.mouseWorld = new THREE.Vector3();
    this.hoverValue = 0;
    this.explosionValue = 0;
    this.isHovering = false;
    this.clickTime = 0;

    this.clock = new THREE.Clock();
    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mousedown', () => this.onMouseDown());
  }

  onMouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.sphere);

    if (intersects.length > 0) {
      this.isHovering = true;
      this.mouseWorld.copy(intersects[0].point);
      setSphereMouse(this.sphere, this.mouse);
    } else {
      this.isHovering = false;
    }
  }

  onMouseDown() {
    if (this.isHovering) {
      this.clickTime = this.clock.getElapsedTime();
    }
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

    // Smooth hover interpolation
    const targetHover = this.isHovering ? 1.0 : 0.0;
    this.hoverValue += (targetHover - this.hoverValue) * 0.08;
    setSphereHover(this.sphere, this.hoverValue);

    // Explosion: decay after click
    const timeSinceClick = elapsedTime - this.clickTime;
    const targetExplosion = this.isHovering && timeSinceClick < 1.5
      ? Math.max(0, 1.0 - timeSinceClick / 1.5)
      : 0;
    this.explosionValue += (targetExplosion - this.explosionValue) * 0.06;
    setSphereExplosion(this.sphere, this.explosionValue);

    this.controls.update();
    updateSphere(this.sphere, elapsedTime);

    this.renderer.render(this.scene, this.camera);
  }
}
