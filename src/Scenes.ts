import * as BABYLON from "@babylonjs/core";

export class SceneCreator {
    public async createScene(
        engine: BABYLON.Engine,
        canvas: HTMLCanvasElement
    ): Promise<BABYLON.Scene> {

        const scene = new BABYLON.Scene(engine);

        // CAMERA
        const camera = new BABYLON.ArcRotateCamera(
            "camera",
            Math.PI / 2,
            Math.PI / 3,
            10,
            new BABYLON.Vector3(0, 0, 0),
            scene
        );

        camera.attachControl(canvas, true);

        // LIGHT
        new BABYLON.HemisphericLight(
            "light",
            new BABYLON.Vector3(0, 1, 0),
            scene
        );

        // GROUND
        BABYLON.MeshBuilder.CreateGround(
            "ground",
            {
                width: 10,
                height: 10
            },
            scene
        );

        // BATTERY BOX
       

        battery.position.y = 0.5;

        return scene;
    }
}