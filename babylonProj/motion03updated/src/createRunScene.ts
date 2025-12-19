import { ActionManager, CubeTexture, Mesh, Quaternion, Vector3 } from "@babylonjs/core";
import { SceneData } from "./interfaces";
import { keyActionManager, keyDownMap } from "./keyActionManager";
import { characterActionManager } from "./characterActionManager";

export default function createRunScene(runScene: SceneData) {
  const axis: Vector3 = new Vector3(0, 1, 0).normalize();
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

  // Get instantiated animation groups from the scene
  const idle = runScene.scene.animationGroups.find(
    (ag) => ag.name === "idle"
  );
  const walk = runScene.scene.animationGroups.find(
    (ag) => ag.name === "walk"
  );

  console.log("Available animations:", runScene.scene.animationGroups.map(ag => ag.name));
  console.log("Idle animation:", idle);
  console.log("Walk animation:", walk);

  let isWalking = false;

  //Play the idle animation
  idle?.start(true, 1.0, idle.from, idle.to, false);

  runScene.scene.onBeforeRenderObservable.add(() => {
    const isMoving = keyDownMap["w"] || keyDownMap["ArrowUp"] ||
                     keyDownMap["a"] || keyDownMap["ArrowLeft"] ||
                     keyDownMap["s"] || keyDownMap["ArrowDown"] ||
                     keyDownMap["d"] || keyDownMap["ArrowRight"];

    if (isMoving && !isWalking) {
      idle?.stop();
      walk?.start(true, 1.0, walk.from, walk.to, false);
      isWalking = true;
    } else if (!isMoving && isWalking) {
      walk?.stop();
      idle?.start(true, 1.0, idle.from, idle.to, false);
      isWalking = false;
    }
    
    if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
      character.position.x -= 0.1;
      let angle = 0.75 * 2 * Math.PI;
        character.rotationQuaternion = Quaternion.RotationAxis(axis, angle);
    }
    if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
      character.position.z -= 0.1;
      let angle = 0.50 * 2 * Math.PI;
        character.rotationQuaternion = Quaternion.RotationAxis(axis, angle);
    }
    if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
      character.position.x += 0.1;
      let angle = 0.25 * 2 * Math.PI;
        character.rotationQuaternion = Quaternion.RotationAxis(axis, angle);
    }
    if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
      character.position.z += 0.1;
      let angle = 1.00 * 2 * Math.PI;
        character.rotationQuaternion = Quaternion.RotationAxis(axis, angle);
    }
  });

  runScene.scene.onAfterRenderObservable.add(() => {});
}
