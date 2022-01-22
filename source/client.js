let container;
let camera;
let scene;
let renderer;
let hand1;
let hand2;
let controller1;
let controller2;
let controllerGrip1;
let controllerGrip2;
let controls;
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
  camera.position.set(-2, 1.8, -2);
  // camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
  // controls = new THREE.PointerLockControls(camera, document.body);
  // locationRotation = {
  //   xPos: -4.0,
  //   yPos: 1.8,
  //   zPos: -4.0,
  //   xRot: 0.0,
  //   yRot: -2.356194525,
  //   zRot: 0.0
  // };
  // controls.getObject().position.set(locationRotation.xPos,
  // locationRotation.yPos, locationRotation.zPos);
  // controls.getObject().rotation.order = 'YXZ';
  // controls.getObject().rotation.set(locationRotation.xRot, locationRotation.yRot,
  controls = new OrbitControls(camera, container);
  controls.target.set(0, 1.6, 0);
  controls.update();
  const floorGeometry = new THREE.PlaneGeometry(4, 4);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  scene.add(new THREE.HemisphereLight(0x808080, 0x606060));
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 6, 0);
  light.castShadow = true;
  light.shadow.camera.top = 2;
  light.shadow.camera.bottom = -2;
  light.shadow.camera.right = 2;
  light.shadow.camera.left = -2;
  light.shadow.mapSize.set(4096, 4096);
  scene.add(light);
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
  const controllerModelFactory = new XRControllerModelFactory();
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
  const tempVector1 = new THREE.Vector3(0, 0, 0);
  const tempVector2 = new THREE.Vector3(0, 0, -1);
  const geometry = new THREE.BufferGeometry().setFromPoints([tempVector1, tempVector2]);
  const line = new THREE.Line(geometry);
  line.name = 'line';
  line.scale.z = 5;
  controller1.add(line.clone());
  controller2.add(line.clone());
  // add cuboid
  const boxX = 0.1;
  const boxY = 0.2;
  const boxZ = 0.3;
  const boxGeometry = new THREE.BoxGeometry(boxX, boxY, boxZ);
  const boxMaterial = new THREE.MeshStandardMaterial();
  boxMaterial.color.setRGB(0.5, 0.5, 0.5);
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.position.x = 1;
  boxMesh.position.y = 1;
  boxMesh.position.z = 0;
  boxMesh.name = 'testing';
  scene.add(boxMesh);
  // add axis
  const axisHelper = new THREE.AxisHelper(0.1);
  scene.add(axisHelper);
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
