import * as THREE from 'three';
import { createScene } from './components/Scene.js';
import { createCamera } from './components/Camera.js';
import { createRenderer } from './components/Renderer.js';
import { createControls } from './components/Controls.js';
import { createSphere } from './components/Sphere.js';

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

    this.hover = 0;
    this.click = 0;
    this.isHovering = false;
    this.clicked = false;

    this.clock = new THREE.Clock();
    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('click', () => this.onClick());
  }

  onMouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.isHovering = this.raycaster.intersectObject(this.sphere).length > 0;
  }

  onClick() {
    if (this.isHovering) {
      this.clicked = true;
    }
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const t = this.clock.getElapsedTime();
    const dt = this.clock.getDelta();

    // Hover smooth
    const targetHover = this.isHovering ? 1 : 0;
    this.hover += (targetHover - this.hover) * 0.08;

    // Click pulse
    if (this.clicked) {
      this.click = 1;
      this.clicked = false;
    }
    this.click *= 0.92;

    // Rotate sphere
    this.sphere.rotation.y = t * 0.15;
    this.sphere.rotation.x = Math.sin(t * 0.1) * 0.1;

    // Push uniforms
    this.sphere.material.uniforms.uTime.value = t;
    this.sphere.material.uniforms.uHover.value = this.hover;
    this.sphere.material.uniforms.uClick.value = this.click;

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
