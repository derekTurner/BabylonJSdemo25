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
  CreateAudioEngineAsync,
  CreateSoundAsync,
  CreateStreamingSoundAsync,
  StreamingSound,
  StaticSound,
  MeshAssetTask,
  Nullable
} from "@babylonjs/core";

// Load audio sounds into an associative array
async function loadSounds(): Promise<{ [key: string]: StreamingSound | StaticSound }> {
  const audioEngine = await CreateAudioEngineAsync();

  // Create sounds
  try {
    const arcade: StreamingSound = await CreateStreamingSoundAsync(
      "arcade",
      "./assets/audio/arcade-kid.mp3",
      { loop: true , volume: 0.1}
    );

    const click: StaticSound = await CreateSoundAsync(
      "click",
      "./assets/audio/mouseClick.mp3",
      { playbackRate: 0.9 }
    );

  // Unlock audio context on first user gesture
  document.addEventListener("click", async () => {
    await audioEngine.unlockAsync();
  }, { once: true });

    // Return associative array of sounds
    const sounds: { [key: string]: StreamingSound | StaticSound } = {
      arcade,
      click,
    };
    return sounds;
  } catch (error) {
    console.error("Failed to load sounds:", error);
    throw error;
  }
}

function createGround(scene: Scene) {
  const groundMaterial = new StandardMaterial("groundMaterial");
  const groundTexture = new Texture("./assets/textures/wood.jpg");
  groundTexture.uScale  = 4.0; //Repeat 4 times on the Vertical Axes
  groundTexture.vScale  = 4.0; //Repeat 4 times on the Horizontal Axes
  groundMaterial.diffuseTexture = groundTexture;
  groundMaterial.diffuseTexture.hasAlpha = true;

  groundMaterial.backFaceCulling = false;
  let ground = MeshBuilder.CreateGround(
    "ground",
    { width: 16, height: 16, subdivisions: 4 },
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

  // camera.attachControl(true);
  return camera;
}

function addAssets(scene: Scene): AbstractMesh | null {
  const assetsManager = new AssetsManager(scene);
  let player: AbstractMesh | null = null;
  
  const meshTask:MeshAssetTask = assetsManager.addMeshTask(
    "character",
    "",
    "./assets/models/men/",
    "dummy3.babylon"
  );



  meshTask.onSuccess = function (task) {
    if (task.loadedMeshes.length > 0) {
      let player = task.loadedMeshes[0];
      player.position.x = 0;
      player.position.y = 0;
      player.scaling = new Vector3(1, 1, 1);
      player.rotation = new Vector3(0, 1.5, 0);
    }
  };

  assetsManager.onTaskErrorObservable.add(function (task) {
    console.log(
      "task failed",
      task.errorObject.message,
      task.errorObject.exception
    );
  });
  assetsManager.load();
  return player;
}

export default async function createStartScene(engine: Engine) {
  let scene = new Scene(engine);
  let lightHemispheric = createHemisphericLight(scene);
  let camera = createArcRotateCamera(scene);
  let ground = createGround(scene);
  let sounds = await loadSounds();
  const player = addAssets(scene);
  
  sounds.arcade.play();

  let that: SceneData = {
    scene,
    sounds,
    lightHemispheric,
    camera,
    player,
    ground,
  };
  return that;
}

