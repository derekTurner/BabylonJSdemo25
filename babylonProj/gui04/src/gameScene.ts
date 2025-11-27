import { SceneData } from "./interfaces";

import {
  Scene,
  ArcRotateCamera,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  HemisphericLight,
  Color3,
  Engine,
  Texture,
  AssetsManager,
  AbstractMesh,
  Sound,
  ArcRotateCameraVRDeviceOrientationInput,
  CreateSoundAsync,
  CreateAudioEngineAsync,
  StaticSound,
} from "@babylonjs/core";
import createRunScene from "./createRunScene";

function backgroundMusic(scene: Scene): Sound {
  let music = new Sound("music", "./assets/audio/arcade-kid.mp3", scene, null, {
    loop: true,
    autoplay: true,
  });

  Engine.audioEngine!.useCustomUnlockedButton = true;

  // Unlock audio on first user interaction.
  window.addEventListener(
    "click",
    () => {
      if (!Engine.audioEngine!.unlocked) {
        Engine.audioEngine!.unlock();
      }
    },
    { once: true }
  );
  return music;
}

async function createStaticSound(): Promise<StaticSound> {
  const audioEngine = await CreateAudioEngineAsync();
  const arcade: StaticSound = await CreateSoundAsync(
    "arcade",
    "./assets/audio/arcade-kid.mp3"
  );
  // Wait until audio engine is ready to play sounds.
  await audioEngine.unlockAsync();

  return arcade;
}

function createGround(scene: Scene) {
  const groundMaterial = new StandardMaterial("groundMaterial");
  const groundTexture = new Texture("./assets/textures/wood.jpg");
  groundTexture.uScale = 4.0; //Repeat 5 times on the Vertical Axes
  groundTexture.vScale = 4.0; //Repeat 5 times on the Horizontal Axes
  groundMaterial.diffuseTexture = groundTexture;
  // groundMaterial.diffuseTexture = new Texture("./assets/textures/wood.jpg");
  groundMaterial.diffuseTexture.hasAlpha = true;

  groundMaterial.backFaceCulling = false;
  let ground = MeshBuilder.CreateGround(
    "ground",
    { width: 15, height: 15, subdivisions: 4 },
    scene
  );

  ground.material = groundMaterial;
  return ground;
}

function createHemisphericLight(scene: Scene) {
  const light = new HemisphericLight(
    "light",
    new Vector3(2, 1, 0), // move x pos to direct shadows
    scene
  );
  light.intensity = 0.7;
  light.diffuse = new Color3(1, 1, 1);
  light.specular = new Color3(1, 0.8, 0.8);
  light.groundColor = new Color3(0, 0.2, 0.7);
  return light;
}

function createArcRotateCamera(scene: Scene) {
  let camAlpha = -Math.PI / 2,
    camBeta = Math.PI / 2.5,
    camDist = 15,
    camTarget = new Vector3(0, 0, 0);
  let camera = new ArcRotateCamera(
    "camera1",
    camAlpha,
    camBeta,
    camDist,
    camTarget,
    scene
  );
  camera.lowerRadiusLimit = 9;
  camera.upperRadiusLimit = 25;
  camera.lowerAlphaLimit = 0;
  camera.upperAlphaLimit = Math.PI * 2;
  camera.lowerBetaLimit = 0;
  camera.upperBetaLimit = Math.PI / 2.02;

  camera.attachControl(true);
  return camera;
}

function createBox1(scene: Scene) {
  let box = MeshBuilder.CreateBox("box", { width: 1, height: 1 }, scene);
  box.position.x = -1;
  box.position.y = 4;
  box.position.z = 1;

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture(
    "./assets/textures/reflectivity.png",
    scene
  );
  texture.diffuseColor = new Color3(1, 1, 1);
  box.material = texture;
  return box;
}

function createBox2(scene: Scene) {
  let box = MeshBuilder.CreateBox("box", { width: 1, height: 1 }, scene);
  box.position.x = -0.7;
  box.position.y = 8;
  box.position.z = 1;

  var texture = new StandardMaterial("reflective", scene);
  texture.ambientTexture = new Texture(
    "./assets/textures/reflectivity.png",
    scene
  );
  texture.diffuseColor = new Color3(1, 1, 1);
  box.material = texture;
  return box;
}

function addAssets(scene: Scene, x: number, y: number, z: number) {
  const assetsManager = new AssetsManager(scene);
  
  const meshTask = assetsManager.addMeshTask(
    "character task",
    "",
    "./assets/models/men/",
    "dummy3.babylon"
  );

  let character: AbstractMesh | null = null;

  meshTask.onSuccess = function (task) {
    if (task.loadedMeshes.length > 0) {
      character = task.loadedMeshes[0];
      character.position = new Vector3(x,y,z);
      character.scaling = new Vector3(1, 1, 1);
      character.rotation = new Vector3(0, 1.5, 0);
    }
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

export default async function gameScene(engine: Engine) {
  let scene = new Scene(engine);
  let arcade: StaticSound = await createStaticSound();

  let lightHemispheric = createHemisphericLight(scene);
  let camera = createArcRotateCamera(scene);
  let box1 = createBox1(scene);
  let box2 = createBox2(scene);
  let assetManager = await addAssets(scene, 0, 0, 0);
  let ground = createGround(scene);

  let that: SceneData = {
    scene,
    arcade,
    lightHemispheric,
    camera,
    box1,
    box2,
    assetManager,
    ground,
  };

  

  return that;
}
