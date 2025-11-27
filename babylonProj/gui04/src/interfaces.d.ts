import {
  Scene,
  StaticSound,
  Mesh,
  HemisphericLight,
  Camera,
  AbstractMesh,
  AssetsManager,
} from "@babylonjs/core";

export interface SceneData {
  scene: Scene;
  arcade: StaticSound;
  lightHemispheric: HemisphericLight;
  camera: Camera;
  box1: Mesh;
  box2: Mesh;
  assetManager: AssetsManager;
  ground: Mesh;
}
