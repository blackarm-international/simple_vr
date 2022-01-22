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
// let controls: any;
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
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
  for (let xloop = 0; xloop < 7; xloop += 1) {
    for (let yloop = 0; yloop < 7; yloop += 1) {
      boxX = 1 + (xloop * 1.0);
      boxZ = 1 + (yloop * 2.0);
      boxGeometry = new THREE.BoxGeometry(0.95, 2, 0.95);
      boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
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
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x444444);
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  player = new THREE.Group();
  scene.add(player);
  player.add(camera);
  player.position.set(-1, 0, 0);
  player.rotation.y = (Math.PI * 1.5);
  const floorGeometry = new THREE.PlaneGeometry(8, 14);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.x = 4;
  floor.position.z = 7;
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
  //
  headset = renderer.xr.getCamera();
  // controllers
  controller1 = renderer.xr.getController(0);
  player.add(controller1);
  controller2 = renderer.xr.getController(1);
  player.add(controller2);
  const controllerModelFactory = new XRControllerModelFactory();
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
  const tempVector1 = new THREE.Vector3(0, 0, 0);
  const tempVector2 = new THREE.Vector3(0, 0, -1);
  const geometry = new THREE.BufferGeometry().setFromPoints([tempVector1, tempVector2]);
  const line = new THREE.Line(geometry);
  line.name = 'line';
  line.scale.z = 5;
  controller1.add(line.clone());
  controller2.add(line.clone());
  // add axis
  const axisHelper = new THREE.AxisHelper(1);
  scene.add(axisHelper);
  // add boxes
  addBoxes();
  window.addEventListener('resize', onWindowResize);
}
function render() {
  renderer.render(scene, camera);
  const session = renderer.xr.getSession();
  // check if the session exists
  if (session) {
    const sources = session.inputSources;
    // check if the session has input sources
    if (sources) {
      const controllerLeft = sources[0];
      // check that input source zero exists
      if (controllerLeft) {
        const gamepad = controllerLeft.gamepad;
        // check that input source zero has a gamepad
        if (gamepad) {
          const axes = gamepad.axes;
          // check that gamepad has axes
          if (axes) {
            // snap turn
            if (axes[2] < -0.8 && turnEnabled == true) {
              player.rotation.y += Math.PI * 0.25;
              turnEnabled = false;
            }
            if (axes[2] > 0.8 && turnEnabled == true) {
              player.rotation.y -= Math.PI * 0.25;
              turnEnabled = false;
            }
            if (axes[2] > -0.2 && axes[2] < 0.2) {
              turnEnabled = true;
            }
          }
        }
      }
      // right hand controller
      const controllerRight = sources[1];
      // check that input source zero exists
      if (controllerLeft) {
        const gamepad = controllerRight.gamepad;
        // check that input source zero has a gamepad
        if (gamepad) {
          const axes = gamepad.axes;
          // check that gamepad has axes
          if (axes) {
            // strafe
            if (axes[2] < -0.05 || axes[2] > 0.05) {
              const direction = new THREE.Vector3();
              headset.getWorldDirection(direction);
              const yAxis = new THREE.Vector3(0, 1, 0);
              const angle = Math.PI * -0.5;
              direction.applyAxisAngle(yAxis, angle);
              player.position.x += (direction.x * axes[2] * 0.01);
              player.position.z += (direction.z * axes[2] * 0.01);
            }
          }
        }
      }
    }
  }
}
function animate() {
  renderer.setAnimationLoop(render);
}
init();
animate();
