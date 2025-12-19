import {
  IncrementValueAction,
  PredicateCondition,
  SetValueAction,
} from "@babylonjs/core/Actions";
import { ActionManager } from "@babylonjs/core/Actions/actionManager";
import { Scene } from "@babylonjs/core/scene";
import { Mesh, Vector3 } from "@babylonjs/core";

export function characterActionManager(scene: Scene, character: Mesh) {
  character.position = new Vector3(5,0,5);  
  character.actionManager = new ActionManager(scene);
  let pickItem = { flag: false };

  scene.actionManager.registerAction(
    new IncrementValueAction(
      ActionManager.OnEveryFrameTrigger,
      character,
      "position.y",//"rotation.y",
      0.1,
      new PredicateCondition(
        character.actionManager as ActionManager,
        function () {
          return pickItem.flag == true;
        }
      )
    )
      
  );


  character.actionManager.registerAction(
  new SetValueAction(ActionManager.OnPickDownTrigger, character.position, "y", character.position.y + 1)
);

  character.actionManager.registerAction(
    new SetValueAction(ActionManager.OnPickDownTrigger, pickItem, "flag", true)
  );

  character.actionManager.registerAction(
    new SetValueAction(
      ActionManager.OnLongPressTrigger,
      pickItem,
      "flag",
      false
    )
  );
}