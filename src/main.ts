import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";

const canvas = document.createElement("canvas");

canvas.style.width = "100%";
canvas.style.height = "100%";

document.body.style.margin = "0";

document.body.appendChild(canvas);

const engine = new BABYLON.Engine(canvas, true);

const scene = new BABYLON.Scene(engine);

scene.clearColor = new BABYLON.Color4(
    0.9,
    0.9,
    0.95,
    1
);

// CAMERA
const camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 3,
    20,
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
        width: 30,
        height: 30
    },
    scene
);

// TABLE
const table = BABYLON.MeshBuilder.CreateBox(
    "table",
    {
        width: 14,
        depth: 8,
        height: 1
    },
    scene
);

table.position.y = 1;

const tableMat =
    new BABYLON.StandardMaterial(
        "tableMat",
        scene
    );

tableMat.diffuseColor =
    new BABYLON.Color3(0.4, 0.2, 0.1);

table.material = tableMat;

// BATTERY
const battery = BABYLON.MeshBuilder.CreateBox(
    "battery",
    {
        width: 3,
        height: 1,
        depth: 1
    },
    scene
);

battery.position =
    new BABYLON.Vector3(-5, 2, 0);

const batteryMat =
    new BABYLON.StandardMaterial(
        "batteryMat",
        scene
    );

batteryMat.diffuseColor =
    new BABYLON.Color3(1, 0, 0);

battery.material = batteryMat;

// RESISTOR MATERIAL
const resistorMat =
    new BABYLON.StandardMaterial(
        "resistorMat",
        scene
    );

resistorMat.diffuseColor =
    new BABYLON.Color3(1, 0.8, 0.2);

// CREATE RESISTOR
function createResistor(z: number) {

    const resistor =
        BABYLON.MeshBuilder.CreateCylinder(
            "resistor",
            {
                height: 3,
                diameter: 0.5
            },
            scene
        );

    resistor.rotation.z = Math.PI / 2;

    resistor.position =
        new BABYLON.Vector3(0, 2, z);

    resistor.material = resistorMat;

    return resistor;
}

createResistor(-2);
createResistor(0);
createResistor(2);

// WIRES
function createWire(
    points: BABYLON.Vector3[]
) {

    const wire =
        BABYLON.MeshBuilder.CreateLines(
            "wire",
            {
                points: points
            },
            scene
        );

    wire.color =
        new BABYLON.Color3(0, 0, 1);
}

// CONNECTIONS
createWire([
    new BABYLON.Vector3(-3.5, 2, 0),
    new BABYLON.Vector3(-2, 2, 0),
    new BABYLON.Vector3(0, 2, -2)
]);

createWire([
    new BABYLON.Vector3(-2, 2, 0),
    new BABYLON.Vector3(0, 2, 0)
]);

createWire([
    new BABYLON.Vector3(-2, 2, 0),
    new BABYLON.Vector3(0, 2, 2)
]);

createWire([
    new BABYLON.Vector3(2, 2, -2),
    new BABYLON.Vector3(5, 2, -2),
    new BABYLON.Vector3(5, 2, 0),
    new BABYLON.Vector3(-5, 2, 0)
]);

createWire([
    new BABYLON.Vector3(2, 2, 0),
    new BABYLON.Vector3(5, 2, 0)
]);

createWire([
    new BABYLON.Vector3(2, 2, 2),
    new BABYLON.Vector3(5, 2, 2),
    new BABYLON.Vector3(5, 2, 0)
]);

// CURRENT PARTICLES
function createCurrentParticle(
    z: number
) {

    const particle =
        BABYLON.MeshBuilder.CreateSphere(
            "particle",
            {
                diameter: 0.25
            },
            scene
        );

    const mat =
        new BABYLON.StandardMaterial(
            "mat",
            scene
        );

    mat.emissiveColor =
        new BABYLON.Color3(0, 1, 0);

    particle.material = mat;

    let x = -3;

    scene.onBeforeRenderObservable.add(() => {

        x += 0.05;

        if (x > 2) {
            x = -3;
        }

        particle.position =
            new BABYLON.Vector3(
                x,
                2,
                z
            );
    });
}

createCurrentParticle(-2);

createCurrentParticle(0);

createCurrentParticle(2);

// LABELS
function createLabel(
    text: string,
    position: BABYLON.Vector3
) {

    const plane =
        BABYLON.MeshBuilder.CreatePlane(
            "label",
            {
                size: 2
            },
            scene
        );

    plane.position = position;

    const texture =
        GUI.AdvancedDynamicTexture
            .CreateForMesh(plane);

    const textBlock =
        new GUI.TextBlock();

    textBlock.text = text;

    textBlock.color = "black";

    textBlock.fontSize = 80;

    texture.addControl(textBlock);
}

createLabel(
    "BATTERY",
    new BABYLON.Vector3(-5, 4, 0)
);

createLabel(
    "100Ω",
    new BABYLON.Vector3(0, 4, -2)
);

createLabel(
    "220Ω",
    new BABYLON.Vector3(0, 4, 0)
);

createLabel(
    "470Ω",
    new BABYLON.Vector3(0, 4, 2)
);

// --------------------
// DYNAMIC VALUES
// --------------------

let voltage = 12;

const R1 = 100;

const R2 = 220;

const R3 = 470;

// UI
const ui =
    GUI.AdvancedDynamicTexture
        .CreateFullscreenUI("UI");

// TITLE
const title =
    new GUI.TextBlock();

title.text =
    "KIRCHHOFF LAW VIRTUAL LAB";

title.color = "black";

title.fontSize = 32;

title.top = "-320px";

ui.addControl(title);

// INSTRUCTION
const instruction =
    new GUI.TextBlock();

instruction.text =
    "Move slider to vary voltage and observe current distribution";

instruction.color = "black";

instruction.fontSize = 18;

instruction.top = "-280px";

ui.addControl(instruction);

// SMALL PANEL
const panel =
    new GUI.Rectangle();

panel.width = "220px";

panel.height = "170px";

panel.cornerRadius = 15;

panel.color = "black";

panel.thickness = 2;

panel.background = "white";

panel.horizontalAlignment =
    GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

panel.verticalAlignment =
    GUI.Control.VERTICAL_ALIGNMENT_TOP;

panel.top = "10px";

panel.left = "-10px";

ui.addControl(panel);

// TEXT
const text =
    new GUI.TextBlock();

text.color = "black";

text.fontSize = 16;

panel.addControl(text);

// SLIDER HEADER
const header =
    new GUI.TextBlock();

header.text =
    "Voltage Control";

header.height = "30px";

header.color = "black";

header.top = "90px";

ui.addControl(header);

// SLIDER
const slider =
    new GUI.Slider();

slider.minimum = 1;

slider.maximum = 30;

slider.value = 12;

slider.height = "20px";

slider.width = "200px";

slider.top = "120px";

slider.color = "blue";

slider.background = "gray";

ui.addControl(slider);

// UPDATE FUNCTION
function updateCircuit() {

    const I1 = voltage / R1;

    const I2 = voltage / R2;

    const I3 = voltage / R3;

    text.text =
        "KCL LAW\n\n" +
        "V = " +
        voltage.toFixed(1) +
        " V\n\n" +
        "I1 = " +
        I1.toFixed(2) +
        " A\n" +
        "I2 = " +
        I2.toFixed(2) +
        " A\n" +
        "I3 = " +
        I3.toFixed(2) +
        " A\n\n" +
        "ΣI = " +
        (I1 + I2 + I3).toFixed(2);
}

// SLIDER CHANGE
slider.onValueChangedObservable.add(
    (value) => {

        voltage = value;

        updateCircuit();
    }
);

// INITIAL UPDATE
updateCircuit();

// BATTERY INTERACTION
battery.actionManager =
    new BABYLON.ActionManager(scene);

battery.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager
            .OnPickTrigger,
        () => {

            batteryMat.diffuseColor =
                new BABYLON.Color3(
                    Math.random(),
                    Math.random(),
                    Math.random()
                );
        }
    )
);

// RENDER LOOP
engine.runRenderLoop(() => {

    scene.render();
});

// RESIZE
window.addEventListener(
    "resize",
    () => {

        engine.resize();
    }
);