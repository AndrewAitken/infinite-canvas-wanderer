
declare module "troika-three-text" {
  export class Text extends THREE.Mesh {
    text: string;
    font: string;
    fontSize: number;
    color: string | THREE.Color;
    anchorX: string | number;
    anchorY: string | number;
    textAlign: string;
    letterSpacing: number;
    lineHeight: number;
    maxWidth: number;
    whiteSpace: string;
    material: THREE.Material;
    sync(): void;
  }
}
