import { Engine} from "@babylonjs/core";
import menuScene from "./menuScene";
import gameScene from "./gameScene";
import "./main.css";

const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("background-canvas");
document.body.appendChild(canvas);

let currentSceneIndex = 0;
let scenes: any[] = [];

let eng = new Engine(canvas, true, {}, true);

scenes[0] = menuScene(eng);
scenes[1] = await gameScene(eng);


// Single render loop
eng.runRenderLoop(() => {
  scenes[currentSceneIndex].scene.render();
});

export default function setSceneIndex(i: number) {
  console.log("setSceneIndex", i);
  
  // Dispose previous scene
  if (scenes[currentSceneIndex]) {
    scenes[currentSceneIndex].scene.dispose();
  }
  
  currentSceneIndex = i;
}
