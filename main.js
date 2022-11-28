import './style.css'

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RingBufferGeometry } from 'three';


//Creating the scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#game'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(5);
camera.position.setY(2);

//User Input
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

let direction = "forward";
let speed = 0.1;

function keyDownHandler(e) {
  if(e.keyCode == "65") {
    direction = "left";
  }
  else if(e.keyCode == "68") {
    direction = "right";
  }
}

function keyUpHandler(e) {
  if(e.keyCode == "65") {
    direction = "forward";
  }
  else if(e.keyCode == "68") {
    direction = "forward";
  }
}

//Mobile touchscreen
document.getElementById("left").addEventListener('touchstart', () => {
  direction = "left"
})

document.getElementById("left").addEventListener('touchend', () => {
  direction = "forward"
})

document.getElementById("right").addEventListener('touchstart', () => {
  direction = "right"
})

document.getElementById("right").addEventListener('touchend', () => {
  direction = "forward"
})

//Background
const backgroundColour = new THREE.Color(0x111111);
scene.background = backgroundColour;

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff);
const pointLight = new THREE.PointLight(0xffffff, 4);
pointLight.position.set(5, 5, 5);
scene.add(ambientLight, pointLight);

//3D model directory
const models = [
  "./ambulance.glb",
  "./delivery.glb",
  "./deliveryFlat.glb",
  "./firetruck.glb",
  "./garbageTruck.glb",
  "./hatchbackSports.glb",
  "./police.glb",
  "./race.glb",
  "./raceFuture.glb",
  "./sedan.glb",
  "./sedanSports.glb",
  "./suv.glb",
  "./suvLuxury.glb",
  "./taxi.glb",
  "./tractor.glb",
  "./tractorShovel.glb",
  "./truck.glb",
  "./truckFlat.glb",
  "./van.glb"
]
let modelPath = models[Math.floor(Math.random() * models.length)];


//Loading manager
const manager = new THREE.LoadingManager();
manager

const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('./325.jpg')
const matcapMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

const loader = new GLTFLoader();
let loaded = 0;
let vehicle;
const vehicleBoundingBox = new THREE.Box3(); 

loader.load( modelPath, function ( gltf ) {
  vehicle = gltf.scene
  vehicle.traverse((o) => {
    if (o.isMesh) o.material = matcapMaterial;
  });
  scene.add(vehicle)
  loaded++;
  if(loaded > 2) {
    animate()
  }
}, undefined, function ( error ) {
	console.error( error );
} );

let flag
const flagBoundingBox = new THREE.Box3()

// const box3HelperFlag = new THREE.Box3Helper(flagBoundingBox, 0x00ffff)
// scene.add(box3HelperFlag)

loader.load( "./flag.glb", function ( gltf ) {
  flag = gltf.scene;
  flag.traverse((o) => {
    if (o.isMesh) o.material = matcapMaterial;
  });
  scene.add(flag);
  flag.position.set((Math.floor((Math.random() * 10) + 1)), 0, (Math.floor((Math.random() * 10) + 1)))
  flagBoundingBox.setFromObject(flag)
  loaded++;
  if(loaded > 2) {
    animate()
  }
}, undefined, function ( error ) {
	console.error( error );
} );

const ring = new THREE.Mesh(
  new THREE.RingGeometry(0.8, 1, 32),
  matcapMaterial
)
scene.add(ring)
ring.rotation.x = -(Math.PI / 2)

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 1000, 1000, 1000),
  new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true })
)
scene.add(floor)
floor.position.y = -0.5
floor.rotation.x = -(Math.PI / 2)

// const arrow = new THREE.Mesh(
//   new THREE.ConeGeometry( 0.1, 0.75, 32 ),
//   new THREE.MeshBasicMaterial( {color: 0xffcf12} )
// )
// scene.add(arrow)
// arrow.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2))

let arrow
loader.load( "./arrow.glb", function ( gltf ) {
  arrow = gltf.scene;
  arrow.traverse((o) => {
    if (o.isMesh) o.material = matcapMaterial;
  });
  scene.add(arrow);
  //arrow.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2))
  loaded++;
  if(loaded > 2) {
    animate()
  }
}, undefined, function ( error ) {
	console.error( error );
} );

let score = 0


//Animate the scene
function animate() {
  requestAnimationFrame(animate);

  vehicleBoundingBox.setFromObject(vehicle)
  //vehicleBoundingBox.expandByScalar(-0.5)
  if(direction == "left") {
    vehicle.rotation.y += 0.05;
  }
  else if(direction == "right") {
    vehicle.rotation.y -= 0.05;
  }

  ring.position.x = flag.position.x
  ring.position.z = flag.position.z

  arrow.lookAt(flag.position.x, flag.position.y, flag.position.z)
  arrow.position.set(vehicle.position.x, vehicle.position.y, vehicle.position.z)

  vehicle.translateZ(-speed);
  camera.lookAt(vehicle.position.x, vehicle.position.y, vehicle.position.z)

  if(vehicleBoundingBox.intersectsBox(flagBoundingBox)) {
    flag.position.set((Math.floor((Math.random() * 50) + 1) - 25), 0, (Math.floor((Math.random() * 50) + 1)-25))
    flagBoundingBox.setFromObject(flag)
    score++
    if(score > 3) {
      document.getElementById("instructions").style.display = 'none';
    }
    document.getElementById("score").innerText = score
    speed = speed + 0.01
  }

  renderer.render(scene, camera);
}