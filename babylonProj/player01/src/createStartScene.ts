//import "@babylonjs/core/Debug/debugLayer";
//import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF/2.0";
import HavokPhysics, { HavokPhysicsWithBindings } from "@babylonjs/havok";
import {
  Scene,
  ArcRotateCamera,
  AssetsManager,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Mesh,
  Camera,
  Engine,
  HavokPlugin,
  PhysicsCharacterController,
  Quaternion,
  CharacterSupportedState,
  KeyboardEventTypes,
} from "@babylonjs/core";
import { taaPixelShader } from "@babylonjs/core/Shaders/taa.fragment";

function createLight(scene: Scene) {
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;
  return light;
}

function createGround(scene: Scene) {
  let ground = MeshBuilder.CreateGround(
    "ground",
    { width: 16, height: 16 },
    scene
  );
  return ground;
}

function createArcRotateCamera(scene: Scene) {
  let camAlpha = -Math.PI / 2,
    camBeta = Math.PI / 2.5,
    camDist = 10,
    camTarget = new Vector3(0, 0, 0);
  let camera = new ArcRotateCamera(
    "camera1",
    camAlpha,
    camBeta,
    camDist,
    camTarget,
    scene
  );
  camera.attachControl(true);
  return camera;
}

function addAssets(scene: Scene) {
  // add assets here
  const assetsManager = new AssetsManager(scene);
  const tree1 = assetsManager.addMeshTask(
    "tree1 task",
    "",
    "./assets/nature/gltf/",
    "CommonTree_1.gltf"
  );
  tree1.onSuccess = function (task) {
    task.loadedMeshes[0].position = new Vector3(3, 0, 2);
    task.loadedMeshes[0].scaling = new Vector3(0.5, 0.5, 0.5);
    // Clone tree1
    const tree1Clone = task.loadedMeshes[0].clone("tree1_clone", null);
    tree1Clone!.position = new Vector3(0, 0, 5);
  };

  const tree2 = assetsManager.addMeshTask(
    "tree1 task",
    "",
    "./assets/nature/gltf/",
    "CommonTree_2.gltf"
  );
  tree2.onSuccess = function (task) {
    task.loadedMeshes[0].position = new Vector3(0, 0, 2);
    task.loadedMeshes[0].scaling = new Vector3(0.5, 0.5, 0.5);
    // Clone tree2
    const tree2Clone = task.loadedMeshes[0].clone("tree2_clone", null);
    tree2Clone!.position = new Vector3(-3, 0, 5);
  };

  const tree3 = assetsManager.addMeshTask(
    "tree1 task",
    "",
    "./assets/nature/gltf/",
    "CommonTree_3.gltf"
  );
  tree3.onSuccess = function (task) {
    task.loadedMeshes[0].position = new Vector3(-3, 0, 2);
    task.loadedMeshes[0].scaling = new Vector3(0.5, 0.5, 0.5);
    // Clone tree3
    const tree3Clone = task.loadedMeshes[0].clone("tree3_clone", null);
    tree3Clone!.position = new Vector3(3, 0, 5);
  };

  assetsManager.onTaskErrorObservable.add(function (task) {
    console.log(
      "task failed",
      task.errorObject.message,
      task.errorObject.exception
    );
  });
  return assetsManager;
}


function createCharacterController(scene: Scene) {
  // https://playground.babylonjs.com/#WO0H1U#13
  // Physics shape for the character
  let h = 1.8;
  let r = 0.6;
  let displayCapsule = MeshBuilder.CreateCapsule(
    "CharacterDisplay",
    { height: h, radius: r },
    scene
  );
  let characterPosition = new Vector3(3, 0.3, -8);
  let characterController = new PhysicsCharacterController(
    characterPosition,
    { capsuleHeight: h, capsuleRadius: r },
    scene
  );

  // Player/Character state
  var state = "IN_AIR";
  var inAirSpeed = 8.0;
  var onGroundSpeed = 10.0;
  var jumpHeight = 1.5;
  var wantJump = false;
  var inputDirection = new Vector3(0, 0, 0);
  var forwardLocalSpace = new Vector3(0, 0, 1);
  let characterOrientation = Quaternion.Identity();
  let characterGravity = new Vector3(0, -18, 0);

  // State handling
  // depending on character state and support, set the new state
  var getNextState = function (supportInfo: {
    supportedState: CharacterSupportedState;
  }) {
    if (state == "IN_AIR") {
      if (supportInfo.supportedState == CharacterSupportedState.SUPPORTED) {
        return "ON_GROUND";
      }
      return "IN_AIR";
    } else if (state == "ON_GROUND") {
      if (supportInfo.supportedState != CharacterSupportedState.SUPPORTED) {
        return "IN_AIR";
      }

      if (wantJump) {
        return "START_JUMP";
      }
      return "ON_GROUND";
    } else if (state == "START_JUMP") {
      return "IN_AIR";
    }
  };

  // From aiming direction and state, compute a desired velocity
  // That velocity depends on current state (in air, on ground, jumping, ...) and surface properties
  var getDesiredVelocity = function (
    deltaTime: number,
    supportInfo: {
      supportedState: CharacterSupportedState;
      averageSurfaceNormal: Vector3;
      averageSurfaceVelocity: Vector3;
    },
    characterOrientation: Quaternion,
    currentVelocity: Vector3
  ): Vector3 {
    let nextState = getNextState(supportInfo);
    if (nextState != state) {
      state = nextState!;
    }

    let upWorld = characterGravity.normalizeToNew();
    upWorld.scaleInPlace(-1.0);
    let forwardWorld =
      forwardLocalSpace.applyRotationQuaternion(characterOrientation);
    if (state == "IN_AIR") {
      let desiredVelocity = inputDirection
        .scale(inAirSpeed)
        .applyRotationQuaternion(characterOrientation);
      let outputVelocity = characterController.calculateMovement(
        deltaTime,
        forwardWorld,
        upWorld,
        currentVelocity,
        Vector3.ZeroReadOnly,
        desiredVelocity,
        upWorld
      );
      // Restore to original vertical component
      outputVelocity.addInPlace(upWorld.scale(-outputVelocity.dot(upWorld)));
      outputVelocity.addInPlace(upWorld.scale(currentVelocity.dot(upWorld)));
      // Add gravity
      outputVelocity.addInPlace(characterGravity.scale(deltaTime));
      return outputVelocity;
    } else if (state == "ON_GROUND") {
      // Move character relative to the surface we're standing on
      // Correct input velocity to apply instantly any changes in the velocity of the standing surface and this way
      // avoid artifacts caused by filtering of the output velocity when standing on moving objects.
      let desiredVelocity = inputDirection
        .scale(onGroundSpeed)
        .applyRotationQuaternion(characterOrientation);

      let outputVelocity = characterController.calculateMovement(
        deltaTime,
        forwardWorld,
        supportInfo.averageSurfaceNormal,
        currentVelocity,
        supportInfo.averageSurfaceVelocity,
        desiredVelocity,
        upWorld
      );
      // Horizontal projection
      {
        outputVelocity.subtractInPlace(supportInfo.averageSurfaceVelocity);
        let inv1k = 1e-3;
        if (outputVelocity.dot(upWorld) > inv1k) {
          let velLen = outputVelocity.length();
          outputVelocity.normalizeFromLength(velLen);

          // Get the desired length in the horizontal direction
          let horizLen = velLen / supportInfo.averageSurfaceNormal.dot(upWorld);

          // Re project the velocity onto the horizontal plane
          let c = supportInfo.averageSurfaceNormal.cross(outputVelocity);
          outputVelocity = c.cross(upWorld);
          outputVelocity.scaleInPlace(horizLen);
        }
        outputVelocity.addInPlace(supportInfo.averageSurfaceVelocity);
        return outputVelocity;
      }
    } else if (state == "START_JUMP") {
      let u = Math.sqrt(2 * characterGravity.length() * jumpHeight);
      let curRelVel = currentVelocity.dot(upWorld);
      return currentVelocity.add(upWorld.scale(u - curRelVel));
    }
    return Vector3.Zero();
  };

  // before render loop, update character controller
  scene.onBeforeRenderObservable.add((scene) => {
    displayCapsule.position.copyFrom(characterController.getPosition());
  });

  // after physics step, update character controller
  scene.onAfterPhysicsObservable?.add(() => {
    if (scene.deltaTime == undefined) return;
    let dt = scene.deltaTime / 1000.0;
    if (dt == 0) return;

    let down = new Vector3(0, -1, 0);
    let support = characterController.checkSupport(dt, down);

    /*Quaternion.FromEulerAnglesToRef(
      0,
      camera.rotation.y,
      0,
      characterOrientation
    );
    */ // Not using a follow camera for now
    
    let desiredLinearVelocity = getDesiredVelocity(
      dt,
      support,
      characterOrientation,
      characterController.getVelocity()
    );
    characterController.setVelocity(desiredLinearVelocity);

    characterController.integrate(dt, support, characterGravity);
  });

  // keyboard input handling
  scene.onKeyboardObservable.add((kbInfo) => {
    switch (kbInfo.type) {
      case KeyboardEventTypes.KEYDOWN:
        if (kbInfo.event.key == "w" || kbInfo.event.key == "ArrowUp") {
          inputDirection.z = 1;
        } else if (kbInfo.event.key == "s" || kbInfo.event.key == "ArrowDown") {
          inputDirection.z = -1;
        } else if (kbInfo.event.key == "a" || kbInfo.event.key == "ArrowLeft") {
          inputDirection.x = -1;
        } else if (
          kbInfo.event.key == "d" ||
          kbInfo.event.key == "ArrowRight"
        ) {
          inputDirection.x = 1;
        } else if (kbInfo.event.key == " ") {
          wantJump = true;
        }
        break;
      case KeyboardEventTypes.KEYUP:
        if (
          kbInfo.event.key == "w" ||
          kbInfo.event.key == "s" ||
          kbInfo.event.key == "ArrowUp" ||
          kbInfo.event.key == "ArrowDown"
        ) {
          inputDirection.z = 0;
        }
        if (
          kbInfo.event.key == "a" ||
          kbInfo.event.key == "d" ||
          kbInfo.event.key == "ArrowLeft" ||
          kbInfo.event.key == "ArrowRight"
        ) {
          inputDirection.x = 0;
        } else if (kbInfo.event.key == " ") {
          wantJump = false;
        }
        break;
    }
  });

  return characterController;
}

export default async function createStartScene(engine: Engine) {
  interface SceneData {
    scene: Scene;
    light?: HemisphericLight;
    ground?: Mesh;
    camera?: Camera;
  }

  let that: SceneData = { scene: new Scene(engine) };

  let initializedHavok: any;

  HavokPhysics().then((havok) => {
    initializedHavok = havok;
  });

  const havokInstance: HavokPhysicsWithBindings = await HavokPhysics();
  const hk: HavokPlugin = new HavokPlugin(true, havokInstance);
  that.scene.enablePhysics(new Vector3(0, -9.81, 0), hk);



  //that.scene.debugLayer.show();

  that.light = createLight(that.scene);
  that.ground = createGround(that.scene);
  that.camera = createArcRotateCamera(that.scene);
  const assetsManager = addAssets(that.scene);
  assetsManager.load();
  createCharacterController(that.scene);
  return that;
}
