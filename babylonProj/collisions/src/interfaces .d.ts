import {
  Scene,
  Sound,
  Mesh,
  HemisphericLight,
  Camera,
  ISceneLoaderAsyncResult,
} from "@babylonjs/core";

export interface SceneData {
  scene: Scene;
  audio: Sound;
  lightHemispheric: HemisphericLight;
  box1:Mesh;
  box2:Mesh;
  camera: Camera;
  player: Promise<void | ISceneLoaderAsyncResult>;
  ground: Mesh;
}
