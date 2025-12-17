import { ExecuteCodeAction } from "@babylonjs/core/Actions";
import { ActionManager } from "@babylonjs/core/Actions/actionManager";
import { SceneData } from "./interfaces";

export let keyDownMap: { [key: string]: boolean } = {};
let keyDown: number = 0;
let soundPlayedForKey: { [key: string]: boolean } = {};

export function keyDownHeld() { keyDown = 2 }
export function getKeyDown(): number { return keyDown }

export function keyActionManager(runscene: SceneData) {
  runscene.scene.actionManager.registerAction(
    new ExecuteCodeAction(
      {
        trigger: ActionManager.OnKeyDownTrigger,
      },
      function (evt) {
        const key = evt.sourceEvent.key;
        
        // Play sound only on first key down (not on repeat)
        if (!keyDownMap[key] && !soundPlayedForKey[key]) {
          runscene.sounds.click.play();
          soundPlayedForKey[key] = true;
        }
        
        if (keyDown === 0) { keyDown++ }
        keyDownMap[key] = true;
      }
    )
  );
  runscene.scene.actionManager.registerAction(
    new ExecuteCodeAction(
      {
        trigger: ActionManager.OnKeyUpTrigger,
      },
      function (evt) {
        const key = evt.sourceEvent.key;
        keyDown = 0;
        keyDownMap[key] = false;
        soundPlayedForKey[key] = false;
      }
    )
  );
  return runscene.scene.actionManager;
}
