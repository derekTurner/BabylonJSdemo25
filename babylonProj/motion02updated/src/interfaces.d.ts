import {
  Scene,
  StreamingSound,
  StaticSound,
  Mesh,
  HemisphericLight,
  Camera,
  AbstractMesh,
} from "@babylonjs/core";

export interface SceneData {
  scene: Scene;
  sounds: { [key: string]: StreamingSound | StaticSound };
  lightHemispheric: HemisphericLight;
  camera: Camera;
  player: AbstractMesh | null;
  ground: Mesh;
}

