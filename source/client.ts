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
let user: any;
// let controls: any;
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function addBoxes() {
  let boxX: number = 0.4;
  const boxY: number = 1;
  let boxZ: number = 0.4;
  let colorBlue: number = 0;
  let colorGreen: number = 0;
  let colorRed: number = 0;
  let boxGeometry: any;
  let boxMaterial: any;
  let boxMesh: any;
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
function init() {
  container = document.createElement('div');
  document.body.appendChild(container);
  // @ts-ignore
  scene = new THREE.Scene();
  // @ts-ignore
  scene.background = new THREE.Color(0x444444);
  // @ts-ignore
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  // @ts-ignore
  user = new THREE.Group();
  scene.add(user);
  user.add(camera);
  user.position.set(-1, 0, -1);
  user.rotation.y = (Math.PI * 1.25);
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
  // controllers
  controller1 = renderer.xr.getController(0);
  user.add(controller1);
  controller2 = renderer.xr.getController(1);
  user.add(controller2);
  // @ts-ignore
  const controllerModelFactory = new XRControllerModelFactory();
  // @ts-ignore
  const handModelFactory = new XRHandModelFactory();
  // Hand 1
  controllerGrip1 = renderer.xr.getControllerGrip(0);
  controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
  user.add(controllerGrip1);
  hand1 = renderer.xr.getHand(0);
  hand1.add(handModelFactory.createHandModel(hand1));
  user.add(hand1);
  // Hand 2
  controllerGrip2 = renderer.xr.getControllerGrip(1);
  controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
  user.add(controllerGrip2);
  hand2 = renderer.xr.getHand(1);
  hand2.add(handModelFactory.createHandModel(hand2));
  user.add(hand2);
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
  const axisHelper = new THREE.AxisHelper(1);
  scene.add(axisHelper);
  // add boxes
  addBoxes();
  window.addEventListener('resize', onWindowResize);
  // this.renderer.xr.addEventListener('sessionstart', async () => {
  //   this.user = new THREE.Group()
  //   this.scene.add(this.user)
  //   this.user.add(this.camera)
  //   this.user.position.set(-1, 1.8, -1)
  // });
  // this.renderer.xr.addEventListener('sessionend', function (event) {
  //     this.user.remove(this.camera)
  //     this.scene.remove(this.user)
  //     this.user = null
  //     this.camera.position.set(-1, 1.8, -1)
  // });
}
function render() {
  renderer.render(scene, camera);
}
function animate() {
  renderer.setAnimationLoop(render);
}
init();
animate();
