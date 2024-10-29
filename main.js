import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { ARButton } from "three/examples/jsm/Addons.js";

let scene,
  camera,
  renderer,
  scaleBar,
  ball,
  cubes = [];
let leftWeight = 0,
  isDragging = false,
  previousTouch = { x: 0, y: 0 };
const ballWeight = 10;
const cubeWeight = 3;

function init() {
  // Renderer dengan WebXR
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);

  // Tombol AR
  document.body.appendChild(
    ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] })
  );

  // Scene dan kamera
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

  // Batang timbangan
  const barGeometry = new THREE.BoxGeometry(0.5, 0.02, 0.02);
  const barMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  scaleBar = new THREE.Mesh(barGeometry, barMaterial);
  scaleBar.position.y = 0.05;
  scene.add(scaleBar);

  // Poros timbangan
  const pivotGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.02);
  const pivotMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
  const pivot = new THREE.Mesh(pivotGeometry, pivotMaterial);
  pivot.position.y = 0;
  scene.add(pivot);

  // Bola di kanan
  const ballGeometry = new THREE.SphereGeometry(0.03, 32, 32);
  const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(0.25, 0.05, 0);
  scene.add(ball);

  // Event listeners untuk touch gestures
  window.addEventListener("touchstart", onTouchStart);
  window.addEventListener("touchmove", onTouchMove);
  window.addEventListener("touchend", onTouchEnd);

  renderer.setAnimationLoop(animate);
}

// Fungsi untuk menambah kubus saat tap
function onTouchStart(event) {
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    previousTouch = { x: touch.clientX, y: touch.clientY };
    isDragging = true;
  } else if (event.touches.length === 2) {
    addCube(); // Tambahkan kubus jika ada 2 jari yang menyentuh layar
  }
}

// Fungsi untuk menggerakkan timbangan saat drag
function onTouchMove(event) {
  if (!isDragging || event.touches.length !== 1) return;

  const touch = event.touches[0];
  const deltaMove = {
    x: touch.clientX - previousTouch.x,
    y: touch.clientY - previousTouch.y,
  };

  // Rotasi timbangan berdasarkan gerakan jari
  scaleBar.rotation.y += deltaMove.x * 0.01;
  previousTouch = { x: touch.clientX, y: touch.clientY };
}

// Fungsi untuk menghentikan drag
function onTouchEnd() {
  isDragging = false;
}

// Fungsi untuk menambah kubus ke sisi kiri
function addCube() {
  const cubeGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
  const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  // Tempatkan kubus bertumpuk di sisi kiri
  cube.position.set(-0.25, 0.05 + cubes.length * 0.06, 0);
  scene.add(cube);
  cubes.push(cube);

  leftWeight += cubeWeight; // Tambah berat kubus
  updateScale(); // Update rotasi timbangan
}

// Fungsi untuk memperbarui rotasi timbangan
function updateScale() {
  const difference = leftWeight - ballWeight;
  scaleBar.rotation.z = THREE.MathUtils.degToRad(difference * 2);
}

// Loop animasi
function animate() {
  renderer.render(scene, camera);
}

window.addEventListener("load", init);
