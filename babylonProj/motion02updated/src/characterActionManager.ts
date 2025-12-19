import {
  IncrementValueAction,
  PredicateCondition,
  SetValueAction,
} from "@babylonjs/core/Actions";
import { ActionManager } from "@babylonjs/core/Actions/actionManager";
import { Scene } from "@babylonjs/core/scene";
import { ExecuteCodeAction, Mesh, Vector3, AbstractMesh, Quaternion } from "@babylonjs/core";

export function characterActionManager(scene: Scene, character: Mesh) {
  character.position = new Vector3(5,0,5);  
  character.isPickable = true;
  character.actionManager = new ActionManager(scene);
  let pickItem = { flag: false };

  // Recursively find and make all meshes pickable
  function makeMeshesPickable(node: any) {
    if (node instanceof AbstractMesh) {
      node.isPickable = true;
      node.actionManager = new ActionManager(scene);
      
      // Register pick action on the mesh
      node.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickDownTrigger, function() {
          console.log("Picked!");
          pickItem.flag = true;
        })
      );

      node.actionManager.registerAction(
        new SetValueAction(ActionManager.OnLongPressTrigger, pickItem, "flag", false)
      );
    }
    
    // Recurse into children
    const children = node.getChildren?.() || [];
    children.forEach((child: any) => {
      makeMeshesPickable(child);
    });
  }
  
  makeMeshesPickable(character);

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
}