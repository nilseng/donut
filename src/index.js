import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import "./styles/styles.scss";

import donutModel from "./3DModels/Donut.glb";

var container, stats;
var camera, scene, renderer;
var controls;
var mesh;

init();
animate();

function render() {
  var time = performance.now() * 0.001;

  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function init() {
  container = document.getElementById("container");

  //

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  //

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    1,
    20000
  );
  camera.position.set(0, 2, 2);

  //

  controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI / (3 / 2);
  controls.target.set(0, 0, 0);
  controls.minDistance = 0.001;
  controls.maxDistance = 10000.0;
  controls.update();

  //

  stats = new Stats();
  container.appendChild(stats.dom);

  // Loading and adding donut
  loadDonut();

  // Adding plane
  const planeGeometry = new THREE.PlaneBufferGeometry(10, 10);
  const planeMaterial = new THREE.MeshStandardMaterial({ color: "#1c2e3f" });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.set(0, -0.15, 0);
  plane.rotateX(-Math.PI / 2);
  plane.receiveShadow = true;
  scene.add(plane);

  // Adding light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 10, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  //Set up shadow properties for the light
  directionalLight.shadow.mapSize.width = 5000;
  directionalLight.shadow.mapSize.height = 5000;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 500;

  window.addEventListener("resize", onWindowResize, false);
}

function loadDonut() {
  var loader = new GLTFLoader();

  loader.load(donutModel, function (gltf) {
    mesh = gltf.scene.children[0];
    mesh.castShadow = true;
    scene.add(mesh);
    mesh.scale.set(10, 10, 10);
  });
}
