import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { ARButton } from "three/examples/jsm/Addons.js";

let scene,
  camera,
  renderer,
  scaleBar,
  ball,
  cubes = [],
  leftWeight = 0;
const ballWeight = 10;
const cubeWeight = 3;

function init() {
  // Inisialisasi renderer dengan dukungan XR
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true; // Mengaktifkan XR mode
  document.body.appendChild(renderer.domElement);

  // Tambahkan tombol AR
  document.body.appendChild(
    ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] })
  );

  // Buat scene dan kamera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );

  // Cahaya
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  // Bar timbangan
  const barGeometry = new THREE.BoxGeometry(0.5, 0.02, 0.02);
  const barMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  scaleBar = new THREE.Mesh(barGeometry, barMaterial);
  scaleBar.position.y = 0.05;
  scene.add(scaleBar);

  // Poros
  const pivotGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.02);
  const pivotMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const pivot = new THREE.Mesh(pivotGeometry, pivotMaterial);
  pivot.position.y = 0;
  scene.add(pivot);

  // Bola di kanan timbangan
  const ballGeometry = new THREE.SphereGeometry(0.03, 32, 32);
  const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(0.25, 0.05, 0);
  scene.add(ball);

  // Event untuk menambah kubus
  const addButton = document.createElement("button");
  addButton.innerText = "Tambah Kubus";
  document.body.appendChild(addButton);
  addButton.addEventListener("click", addCube);

  renderer.setAnimationLoop(animate);
}

// Fungsi menambah kubus
function addCube() {
  const cubeGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
  const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  // Atur posisi kubus agar terlihat bertumpuk
  cube.position.set(-0.25, 0.05 + cubes.length * 0.06, 0);
  scene.add(cube);
  cubes.push(cube);

  leftWeight += cubeWeight; // Tambah berat di kiri
  updateScale(); // Update rotasi timbangan
}

// Update rotasi timbangan berdasarkan perbandingan berat
function updateScale() {
  const difference = leftWeight - ballWeight;
  scaleBar.rotation.z = THREE.MathUtils.degToRad(difference * 2); // Miring berdasarkan selisih
}

// Loop animasi
function animate() {
  renderer.render(scene, camera);
}

window.addEventListener("load", init);
