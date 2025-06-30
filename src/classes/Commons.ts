
import { PerspectiveCamera, WebGLRenderer, Clock } from "three";
import Lenis from "lenis";

export interface Screen {
  width: number;
  height: number;
  aspect: number;
}

export interface Sizes {
  screen: Screen;
  pixelRatio: number;
}

export default class Commons {
  private constructor() {}
  
  private static instance: Commons;

  lenis!: Lenis;
  camera!: PerspectiveCamera;
  renderer!: WebGLRenderer;

  private time: Clock = new Clock();
  elapsedTime!: number;

  sizes: Sizes = {
    screen: {
      width: window.innerWidth,
      height: window.innerHeight,
      aspect: window.innerWidth / window.innerHeight,
    },
    pixelRatio: this.getPixelRatio(),
  };

  private distanceFromCamera: number = 1000;

  static getInstance() {
    if (this.instance) return this.instance;

    this.instance = new Commons();
    return this.instance;
  }

  init() {
    this.createLenis();
    this.createCamera();
    this.createRenderer();
  }

  private createLenis() {
    this.lenis = new Lenis({ autoRaf: true, duration: 2 });
  }

  private createCamera() {
    this.camera = new PerspectiveCamera(
      70,
      this.sizes.screen.aspect,
      200,
      2000
    );
    this.camera.position.z = this.distanceFromCamera;
    this.syncDimensions();
    this.camera.updateProjectionMatrix();
  }

  private createRenderer() {
    this.renderer = new WebGLRenderer({
      alpha: true,
    });

    this.renderer.setSize(this.sizes.screen.width, this.sizes.screen.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);

    document.body.appendChild(this.renderer.domElement);
  }

  private syncDimensions() {
    this.camera.fov =
      2 *
      Math.atan(this.sizes.screen.height / 2 / this.distanceFromCamera) *
      (180 / Math.PI);
  }

  getPixelRatio() {
    return Math.min(window.devicePixelRatio, 2);
  }

  onResize() {
    this.sizes.screen = {
      width: window.innerWidth,
      height: window.innerHeight,
      aspect: window.innerWidth / window.innerHeight,
    };
    this.sizes.pixelRatio = this.getPixelRatio();

    this.renderer.setSize(this.sizes.screen.width, this.sizes.screen.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);

    this.onResizeCamera();
  }

  private onResizeCamera() {
    this.syncDimensions();
    this.camera.aspect = this.sizes.screen.aspect;
    this.camera.updateProjectionMatrix();
  }

  update() {
    this.elapsedTime = this.time.getElapsedTime();
  }
}
