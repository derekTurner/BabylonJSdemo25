import {
  SetValueAction,
} from "@babylonjs/core/Actions";
import { ActionManager } from "@babylonjs/core/Actions/actionManager";
import { Scene } from "@babylonjs/core/scene";
import {
  ExecuteCodeAction,
  Mesh,
  Vector3,
  AbstractMesh,
  Quaternion,
} from "@babylonjs/core";

export function characterActionManager(scene: Scene, character: Mesh) {
  // setup values for character rotation
  const axis: Vector3 = new Vector3(0, 1, 0).normalize();
  const deltaAngle = 1 * ((2 * Math.PI) / 360);
  const delta = Quaternion.RotationAxis(axis, deltaAngle);

  //character.position = new Vector3(5, 0, 5);
  //character.isPickable = true;
  // Setuo action manager for character
  character.actionManager = new ActionManager(scene);
  let pickItem = { character: false };

  // Recursively find and make all meshes pickable
  function makeMeshesPickable(node: any) {
    if (node instanceof AbstractMesh) {
      node.isPickable = true;
      node.actionManager = new ActionManager(scene);

      // Register pick action on the mesh
      node.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickDownTrigger, function () {
          pickItem.character = true;
        })
      );

      node.actionManager.registerAction(
        new SetValueAction(
          ActionManager.OnLongPressTrigger,
          pickItem,
          "character",
          false
        )
      );
    }

    // Recurse into children
    const children = node.getChildren?.() || [];
    children.forEach((child: any) => {
      makeMeshesPickable(child);
    });
  }

  makeMeshesPickable(character);

  scene.onBeforeRenderObservable.add(() => {
    if(pickItem.character){character.rotationQuaternion =
      character.rotationQuaternion!.multiply(delta);}
  });
}
