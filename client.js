// @ts-ignore
import * as THREE from 'three';
let container;
let camera;
let scene;
let renderer;
let hand1;
let hand2;
let headset;
let controller1;
let controller2;
let controllerGrip1;
let controllerGrip2;
let player;
let turnEnabled = true;
//
function addBoxes() {
    let boxX = 0.4;
    const boxY = 1;
    let boxZ = 0.4;
    let colorBlue = 0;
    let colorGreen = 0;
    let colorRed = 0;
    let boxGeometry;
    let boxMaterial;
    let boxMesh;
    // @ts-ignore
    for (let xloop = 0; xloop < 7; xloop += 1) {
        for (let yloop = 0; yloop < 7; yloop += 1) {
            boxX = 1 + (xloop * 1.0);
            boxZ = 1 + (yloop * 2.0);
            // @ts-ignore
            boxGeometry = new THREE.BoxGeometry(0.95, 2, 0.95);
            // @ts-ignore
            boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
            // @ts-ignore
            boxMaterial = new THREE.MeshStandardMaterial();
            colorBlue = 0.5 + (Math.random() * 0.5);
            colorGreen = 0.5 + (Math.random() * 0.5);
            colorRed = 0.5 + (Math.random() * 0.5);
            boxMaterial.color.setRGB(colorRed, colorGreen, colorBlue);
            boxMesh.position.x = boxX;
            boxMesh.position.y = boxY;
            boxMesh.position.z = boxZ;
            boxMesh.name = 'testing';
            scene.add(boxMesh);
        }
    }
}
const pageResizeDivs = () => {
    let divElement;
    // the four div dimensions
    let threeHeight;
    let threeLeft;
    let threeTop;
    let threeWidth;
    let textHeight;
    let textLeft;
    let textTop;
    let textWidth;
    // threejs div
    divElement = document.getElementById('threejs');
    if (divElement) {
        threeHeight = (window.innerHeight * 0.8);
        threeLeft = 0;
        threeTop = 0;
        threeWidth = window.innerWidth;
        divElement.style.height = `${threeHeight}px`;
        divElement.style.left = `${threeLeft}px`;
        divElement.style.top = `${threeTop}px`;
        divElement.style.width = `${threeWidth}px`;
        camera.aspect = threeWidth / threeHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(threeWidth, threeHeight);
    }
    // text div
    divElement = document.getElementById('text');
    if (divElement) {
        textHeight = (window.innerHeight * 0.2);
        textLeft = 0;
        textTop = (window.innerHeight * 0.8);
        textWidth = window.innerWidth;
        divElement.style.height = `${textHeight}px`;
        divElement.style.left = `${textLeft}px`;
        divElement.style.top = `${textTop}px`;
        divElement.style.width = `${textWidth}px`;
    }
};
function init() {
    container = document.getElementById('threejs');
    // document.body.appendChild(container);
    // @ts-ignore
    scene = new THREE.Scene();
    // @ts-ignore
    scene.background = new THREE.Color(0x444444);
    // @ts-ignore
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    // @ts-ignore
    player = new THREE.Group();
    scene.add(player);
    player.add(camera);
    player.position.set(-1, 0, 0);
    player.rotation.y = (Math.PI * 1.5);
    // @ts-ignore
    const floorGeometry = new THREE.PlaneGeometry(8, 14);
    // @ts-ignore
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    // @ts-ignore
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.x = 4;
    floor.position.z = 7;
    floor.receiveShadow = true;
    scene.add(floor);
    // @ts-ignore
    scene.add(new THREE.HemisphereLight(0x808080, 0x606060));
    // @ts-ignore
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 6, 0);
    light.castShadow = true;
    light.shadow.camera.top = 2;
    light.shadow.camera.bottom = -2;
    light.shadow.camera.right = 2;
    light.shadow.camera.left = -2;
    light.shadow.mapSize.set(4096, 4096);
    scene.add(light);
    // @ts-ignore
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // @ts-ignore
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);
    // @ts-ignore
    document.body.appendChild(VRButton.createButton(renderer));
    //
    headset = renderer.xr.getCamera();
    // controllers
    controller1 = renderer.xr.getController(0);
    player.add(controller1);
    controller2 = renderer.xr.getController(1);
    player.add(controller2);
    // @ts-ignore
    const controllerModelFactory = new XRControllerModelFactory();
    // @ts-ignore
    const handModelFactory = new XRHandModelFactory();
    // Hand 1
    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    player.add(controllerGrip1);
    hand1 = renderer.xr.getHand(0);
    hand1.add(handModelFactory.createHandModel(hand1));
    player.add(hand1);
    // Hand 2
    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    player.add(controllerGrip2);
    hand2 = renderer.xr.getHand(1);
    hand2.add(handModelFactory.createHandModel(hand2));
    player.add(hand2);
    // @ts-ignore
    const tempVector1 = new THREE.Vector3(0, 0, 0);
    // @ts-ignore
    const tempVector2 = new THREE.Vector3(0, 0, -1);
    // @ts-ignore
    const geometry = new THREE.BufferGeometry().setFromPoints([tempVector1, tempVector2]);
    // @ts-ignore
    const line = new THREE.Line(geometry);
    line.name = 'line';
    line.scale.z = 5;
    controller1.add(line.clone());
    controller2.add(line.clone());
    // add axis
    // @ts-ignore
    const axisHelper = new THREE.AxesHelper(1);
    scene.add(axisHelper);
    // add boxes
    addBoxes();
    window.addEventListener('resize', pageResizeDivs);
    pageResizeDivs();
}
function render() {
    // @ts-ignore
    const direction = new THREE.Vector3();
    renderer.render(scene, camera);
    // @ts-ignore
    const session = renderer.xr.getSession();
    // snap turns with left joystick horizontal
    if (session) {
        const joystickLeftHoriz = session.inputSources[0].gamepad.axes[2];
        if (joystickLeftHoriz) {
            if (joystickLeftHoriz < -0.7 && turnEnabled === true) {
                player.rotation.y += Math.PI * 0.25;
                turnEnabled = false;
            }
            if (joystickLeftHoriz > 0.7 && turnEnabled === true) {
                player.rotation.y -= Math.PI * 0.25;
                turnEnabled = false;
            }
            if (joystickLeftHoriz > -0.4 && joystickLeftHoriz < 0.4) {
                turnEnabled = true;
            }
        }
    }
    // forward/backward with right joystick horizontal
    if (session) {
        const joystickRightHoriz = session.inputSources[1].gamepad.axes[2];
        if (joystickRightHoriz < -0.01 || joystickRightHoriz > 0.01) {
            headset.getWorldDirection(direction);
            player.position.x += (direction.x * joystickRightHoriz * 0.04);
            player.position.z += (direction.z * joystickRightHoriz * 0.04);
        }
    }
}
function animate() {
    renderer.setAnimationLoop(render);
}
init();
animate();
