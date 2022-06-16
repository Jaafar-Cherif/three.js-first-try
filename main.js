import "./style.css";
import "./robin.png";
import "./space.jpeg";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//définir des outils pour le rendu
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);
//créer un anneau avec son enveloppe
const geometry = new THREE.TorusGeometry(20, 5, 16, 100);
const material = new THREE.MeshStandardMaterial({
  //basic material est un matériau qui ne prend pas de texture, standard peut recevoir de la lumière
  color: 0x007791,
});
const torus = new THREE.Mesh(geometry, material);

const eulNibor = new THREE.TextureLoader().load("./robin.png");
const geometry2 = new THREE.BoxGeometry(10, 10, 10);
const material2 = new THREE.MeshBasicMaterial({
  map: eulNibor,
});
const cube = new THREE.Mesh(geometry2, material2);

// ajouter ce mesh à la scene
scene.add(torus, cube);

//créer une source de lumière focalisée
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

//créer une source de lumière ambiante
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

//montrer la position d'une pointlight
// const lightHelper = new THREE.PointLightHelper(pointLight);

//montrer une grille de la scène que l'on regarde
// const gridHelper = new THREE.GridHelper(100, 20);
// scene.add(lightHelper, gridHelper);

//
const controls = new OrbitControls(camera, renderer.domElement);

//faire apparaître des étoiles dispersées aléatoirement
function addStars() {
  const geometry = new THREE.SphereGeometry(1, 16, 16);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  const sphere = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(1000));
  sphere.position.set(x, y, z);
  scene.add(sphere);
}

Array(1000).fill().forEach(addStars);

const spaceTexture = new THREE.TextureLoader().load("space.jpeg");
scene.background = spaceTexture;

// voir la scène en écrivant une fonction récursive plutôt qu'en appelant la fonction render à nouveau
function animate() {
  requestAnimationFrame(animate); //demander au navigateur d'appeler la méthode animate à chaque frame, équivalent d'un game loop
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.005;
  cube.rotation.z += 0.01;

  controls.update(); //actualiser les contrôles d'événement de la souris dans la scène

  renderer.render(scene, camera);
}

animate();
