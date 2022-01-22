let container: any;
let camera: any;
let scene: any;
let renderer: any;
let hand1: any;
let hand2: any;
let controller1: any;
let controller2: any;
let controllerGrip1: any;
let controllerGrip2: any;
let controls: any;
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function addBoxes() {
  let boxX: number = 0.0;
  const boxY: number = 1.8;
  const boxZ: number = 0.0;
  let boxGeometry: any;
  // @ts-ignore
  const boxMaterial: any = new THREE.MeshStandardMaterial();
  let boxMesh: any;
  // @ts-ignore
  for (let loop = 0; loop < 10; loop += 1) {
    boxX = loop;
    // @ts-ignore
    boxGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
    // @ts-ignore
    boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMaterial.color.setRGB(0.5, 0.5, 0.5);
    boxMesh.position.x = boxX;
    boxMesh.position.y = boxY;
    boxMesh.position.z = boxZ;
    boxMesh.name = 'testing';
    scene.add(boxMesh);
  }
}
function init() {
  container = document.createElement('div');
  document.body.appendChild(container);
  // @ts-ignore
  scene = new THREE.Scene();
  // @ts-ignore
  scene.background = new THREE.Color(0x444444);
  // @ts-ignore
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
  camera.position.set(-2, 1.8, -2);
  // camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
  // // @ts-ignore
  // controls = new THREE.PointerLockControls(camera, document.body);
  // locationRotation = {
  //     xPos: -4.0,
  //     yPos: 1.8,
  //     zPos: -4.0,
  //     xRot: 0.0,
  //     yRot: -2.356194525,
  //     zRot: 0.0
  // };
  // controls.getObject().position.set(locationRotation.xPos,
  // locationRotation.yPos, locationRotation.zPos);
  // controls.getObject().rotation.order = 'YXZ';
  // controls.getObject().rotation.set(locationRotation.xRot, locationRotation.yRot,
  // @ts-ignore
  controls = new OrbitControls(camera, container);
  controls.target.set(0, 1.6, 0);
  controls.update();
  // @ts-ignore
  const floorGeometry = new THREE.PlaneGeometry(4, 4);
  // @ts-ignore
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
  // @ts-ignore
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
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
  // controllers
  controller1 = renderer.xr.getController(0);
  scene.add(controller1);
  controller2 = renderer.xr.getController(1);
  scene.add(controller2);
  // @ts-ignore
  const controllerModelFactory = new XRControllerModelFactory();
  // @ts-ignore
  const handModelFactory = new XRHandModelFactory();
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
  const axisHelper = new THREE.AxisHelper(0.1);
  scene.add(axisHelper);
  // add boxes
  addBoxes();
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
