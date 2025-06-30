
import Commons from "./Commons";
import PostProcessing from "./PostProcessing";
import WebGLText from "./WebGLText";
import * as THREE from "three";

export default class WebGLApp {
  private commons!: Commons;
  private postProcessing!: PostProcessing;
  private texts!: Array<WebGLText>;

  scene!: THREE.Scene;

  constructor() {
    this.init();
  }

  private async init() {
    await document.fonts.ready;

    this.commons = Commons.getInstance();
    this.commons.init();

    this.createScene();
    this.createWebGLTexts();
    this.createPostProcessing();
    this.addEventListeners();

    this.update();
  }

  private createScene() {
    this.scene = new THREE.Scene();
  }

  private createWebGLTexts() {
    const texts = document.querySelectorAll('[data-animation="webgl-text"]');

    if (texts) {
      this.texts = Array.from(texts).map((el) => {
        return new WebGLText({
          element: el as HTMLElement,
          scene: this.scene,
        });
      });
    }
  }

  private createPostProcessing() {
    this.postProcessing = new PostProcessing({ scene: this.scene });
  }

  private update() {
    this.commons.update();

    if (this.texts) {
      this.texts.forEach((el) => el.update());
    }

    this.postProcessing.update();

    window.requestAnimationFrame(this.update.bind(this));
  }

  private addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
  }

  private onResize() {
    this.commons.onResize();

    if (this.texts) {
      this.texts.forEach((el) => el.onResize());
    }

    this.postProcessing.onResize();
  }

  destroy() {
    window.removeEventListener("resize", this.onResize.bind(this));
    if (this.commons.renderer.domElement.parentNode) {
      this.commons.renderer.domElement.parentNode.removeChild(
        this.commons.renderer.domElement
      );
    }
  }
}
