import { Engine } from "@babylonjs/core";
import createStartScene from "./createStartScene";
import './main.css';
import {createCharacterController} from "./createCharacterController";
import { gui } from "./gui";
import { setupCollisions } from "./collisions";




export default async function start(eng: Engine) {
 const startScene = await createStartScene(eng);
    createCharacterController(startScene.scene);
    setupCollisions(startScene);
    gui(startScene.scene);
    return startScene;
}