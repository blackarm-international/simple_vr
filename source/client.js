"use strict";
var container;
var camera;
var scene;
var renderer;
var hand1;
var hand2;
var controller1;
var controller2;
var controllerGrip1;
var controllerGrip2;
var controls;
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function init() {
    container = document.createElement('div');
    document.body.appendChild(container);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x444444);
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
    camera.position.set(0, 1.6, 3);
    controls = new OrbitControls(camera, container);
    controls.target.set(0, 1.6, 0);
    controls.update();
    var floorGeometry = new THREE.PlaneGeometry(4, 4);
    var floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    scene.add(new THREE.HemisphereLight(0x808080, 0x606060));
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 6, 0);
    light.castShadow = true;
    light.shadow.camera.top = 2;
    light.shadow.camera.bottom = -2;
    light.shadow.camera.right = 2;
    light.shadow.camera.left = -2;
    light.shadow.mapSize.set(4096, 4096);
    scene.add(light);
    //
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));
    // controllers
    controller1 = renderer.xr.getController(0);
    scene.add(controller1);
    controller2 = renderer.xr.getController(1);
    scene.add(controller2);
    var controllerModelFactory = new XRControllerModelFactory();
    var handModelFactory = new XRHandModelFactory();
    // Hand 1
    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);
    hand1 = renderer.xr.getHand(0);
    hand1.add(handModelFactory.createHandModel(hand1));
    scene.add(hand1);
    // Hand 2
    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);
    hand2 = renderer.xr.getHand(1);
    hand2.add(handModelFactory.createHandModel(hand2));
    scene.add(hand2);
    //
    var tempVector1 = new THREE.Vector3(0, 0, 0);
    var tempVector2 = new THREE.Vector3(0, 0, -1);
    var geometry = new THREE.BufferGeometry().setFromPoints([tempVector1, tempVector2]);
    var line = new THREE.Line(geometry);
    line.name = 'line';
    line.scale.z = 5;
    controller1.add(line.clone());
    controller2.add(line.clone());
    window.addEventListener('resize', onWindowResize);
}
function render() {
    renderer.render(scene, camera);
}
function animate() {
    renderer.setAnimationLoop(render);
}
init();
animate();
