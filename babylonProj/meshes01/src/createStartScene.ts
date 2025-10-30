//import "@babylonjs/core/Debug/debugLayer";
//import "@babylonjs/inspector";
import {
    Scene,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    Mesh,
    Light,
    Camera,
    Engine,
  } from "@babylonjs/core";
  
    function createSphere(scene: Scene) {
    let sphere = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 2, segments: 32 },
      scene,
    );
    sphere.position.x = 0;
    sphere.position.y = 1;
    return sphere;
  }

  function createBox(scene: Scene) {
    let box = MeshBuilder.CreateBox("box",{size: 1}, scene);
    box.position.x = 3;
    box.position.y = 1;
    return box;
  }

  function createCylinder(scene: Scene) {
    const cylinder = MeshBuilder.CreateCylinder("cylinder",{diameter: 1,tessellation:24}, scene);
    cylinder.position.x = 5;
    cylinder.position.y = 1;
    return cylinder;
  }  

  function createCone(scene: Scene) {
    const cone = MeshBuilder.CreateCylinder("cone",{diameterTop:0, height:2, tessellation:24, arc:0.5}, scene);
    cone.position.x = 7;
    cone.position.y = 1;
    return cone;
  }

  function createTriangle(scene: Scene) {
  const cone = MeshBuilder.CreateCylinder("tri",{height:2, tessellation:3}, scene);
    cone.position.x = 9;
    cone.position.y = 1;
    return cone;
  }
  
  
  
  function createLight(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    return light;
  }
  

  
  function createGround(scene: Scene) {
    let ground = MeshBuilder.CreateGround(
      "ground",
      { width: 6, height: 6 },
      scene,
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
      scene,
    );
    camera.attachControl(true);
    return camera;
  }
  
  export default function createStartScene(engine: Engine) {
    interface SceneData {
      scene: Scene;
      box?: Mesh;
      sphere?: Mesh;
      cylinder?: Mesh;
      cone?: Mesh;
      triangle?: Mesh;
      light?: Light;
      
      ground?: Mesh;
      camera?: Camera;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    //that.scene.debugLayer.show();
  
    that.box = createBox(that.scene);
    that.sphere = createSphere(that.scene);
    that.cylinder = createCylinder(that.scene);
    that.cone = createCone(that.scene);
    that.triangle = createTriangle(that.scene);
    that.light = createLight(that.scene);
    that.ground = createGround(that.scene);
    that.camera = createArcRotateCamera(that.scene);
    return that;
  }