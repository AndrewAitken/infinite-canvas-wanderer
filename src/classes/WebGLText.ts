
import Commons from "./Commons";
import * as THREE from "three";
import { Text } from "troika-three-text";
import { inView, animate } from "motion";

import fragmentShader from "../shaders/text/text.frag";
import vertexShader from "../shaders/text/text.vert";

interface Props {
  scene: THREE.Scene;
  element: HTMLElement;
}

export default class WebGLText {
  commons: Commons;
  scene: THREE.Scene;
  element: HTMLElement;

  computedStyle: CSSStyleDeclaration;
  font!: string;
  bounds!: DOMRect;
  color!: THREE.Color;
  material!: THREE.ShaderMaterial;
  mesh!: Text;

  weightToFontMap: Record<string, string> = {
    "900": "/YS Text-Black.ttf",
    "800": "/YS Text-Heavy.ttf",
    "700": "/YS Text-Bold.ttf",
    "500": "/YS Text-Medium.ttf",
    "400": "/YS Text-Regular.ttf",
    "300": "/YS Text-Light.ttf",
    "100": "/YS Text-Thin.ttf",
  };
  
  private y: number = 0;
  private isVisible: boolean = false;

  constructor({ scene, element }: Props) {
    this.commons = Commons.getInstance();
    this.scene = scene;
    this.element = element;

    this.computedStyle = window.getComputedStyle(this.element);

    this.createFont();
    this.createColor();
    this.createBounds();
    this.createMaterial();
    this.createMesh();
    this.setStaticValues();
    this.addEventListeners();

    this.element.style.color = "transparent";
  }

  private createFont() {
    this.font =
      this.weightToFontMap[this.computedStyle.fontWeight] ||
      "/YS Text-Regular.ttf";
  }

  private createColor() {
    this.color = new THREE.Color(this.computedStyle.color);
  }

  private createBounds() {
    this.bounds = this.element.getBoundingClientRect();
    this.y = this.bounds.top + this.commons.lenis.actualScroll;
  }

  private createMaterial() {
    this.material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
        uProgress: new THREE.Uniform(0),
        uHeight: new THREE.Uniform(this.bounds.height),
        uColor: new THREE.Uniform(this.color),
      },
    });
  }

  private createMesh() {
    this.mesh = new Text();
    this.mesh.text = this.element.innerText;
    this.mesh.font = this.font;
    this.mesh.anchorX = "0%";
    this.mesh.anchorY = "50%";
    this.mesh.material = this.material;

    this.scene.add(this.mesh);
  }

  private setStaticValues() {
    const { fontSize, letterSpacing, lineHeight, whiteSpace, textAlign } =
      this.computedStyle;

    const fontSizeNum = window.parseFloat(fontSize);

    this.mesh.fontSize = fontSizeNum;
    this.mesh.textAlign = textAlign;
    this.mesh.letterSpacing = parseFloat(letterSpacing) / fontSizeNum;
    this.mesh.lineHeight = parseFloat(lineHeight) / fontSizeNum;
    this.mesh.maxWidth = this.bounds.width;
    this.mesh.whiteSpace = whiteSpace;
  }

  private addEventListeners() {
    inView(this.element, () => {
      this.show();
      return () => this.hide();
    });
  }

  show() {
    this.isVisible = true;
    animate(
      this.material.uniforms.uProgress,
      { value: 1 },
      { duration: 1.8, ease: [0.25, 1, 0.5, 1] }
    );
  }

  hide() {
    animate(
      this.material.uniforms.uProgress,
      { value: 0 },
      { duration: 1.8, onComplete: () => (this.isVisible = false) }
    );
  }

  update() {
    if (this.isVisible) {
      this.mesh.position.y =
        -this.y +
        this.commons.lenis.animatedScroll +
        this.commons.sizes.screen.height / 2 -
        this.bounds.height / 2;

      this.mesh.position.x =
        this.bounds.left - this.commons.sizes.screen.width / 2;
    }
  }

  onResize() {
    this.computedStyle = window.getComputedStyle(this.element);
    this.createBounds();
    this.setStaticValues();
    this.material.uniforms.uHeight.value = this.bounds.height;
  }
}
