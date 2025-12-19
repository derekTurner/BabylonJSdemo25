import { ActionManager, CubeTexture, Mesh } from "@babylonjs/core";
import { SceneData } from "./interfaces";
import { keyActionManager, keyDownMap } from "./keyActionManager";
import { characterActionManager } from "./characterActionManager";

export default function createRunScene(runScene: SceneData) {
  runScene.scene.actionManager = new ActionManager(runScene.scene);
  keyActionManager(runScene);
  let character = runScene.player!;
  characterActionManager(runScene.scene, character as Mesh);

  const environmentTexture = new CubeTexture(
    "assets/textures/industrialSky.env",
    runScene.scene
  );
  const skybox = runScene.scene.createDefaultSkybox(
    environmentTexture,
    true,
    10000,
    0.1
  );

  runScene.scene.onBeforeRenderObservable.add(() => {
    
    if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
      character.position.x -= 0.1;
      character.rotation.y = (3 * Math.PI) / 2;
    }
    if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
      character.position.z -= 0.1;
      character.rotation.y = (2 * Math.PI) / 2;
    }
    if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
      character.position.x += 0.1;
      character.rotation.y = (1 * Math.PI) / 2;
    }
    if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
      character.position.z += 0.1;
      character.rotation.y = (0 * Math.PI) / 2;
    }
  });

  runScene.scene.onAfterRenderObservable.add(() => {});
}
