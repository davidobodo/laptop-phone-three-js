import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { initApplication } from ".";

class ThreeDScene {
	constructor() {
		// RENDERER
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.physicallyCorrectLights = true;
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
		this.renderer.toneMappingExposure = 1.3;

		this.sceneRenderer = this.renderer;
		this.renderer.setClearColor(0x150c21, 1);
		// this.renderer.setClearColor(0xffffff, 1);

		document.getElementById("canvas-wrapper").appendChild(this.renderer.domElement);

		// SCENE
		this.scene = new THREE.Scene();

		// AXESHELPER
		// this.axesHelper = new THREE.AxesHelper(100);

		// CAMERA
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
		this.camera.position.z = 4;

		// LIGHT ONE
		const light = new THREE.DirectionalLight(0xffffff, 1);
		this.scene.add(light);
		light.position.set(2, 1, 1);
		this.sceneLightOne = light;

		// LIGHT TWO
		const light2 = new THREE.DirectionalLight(0xffffff, 1);
		this.scene.add(light2);
		light2.position.set(-2, 1, 1);
		this.sceneLightTwo = light2;

		// LIGHT THREE
		const light3 = new THREE.DirectionalLight(0xffffff, 1);
		this.scene.add(light3);
		light3.position.set(-1, 10, 1);
		this.sceneLightThree = light3;

		// LAPTOP MODEL
		this.gltfLoaderThree = new GLTFLoader();
		const rootFolder = "models";
		this.gltfLoaderThree.resourcePath = `/${rootFolder}/`;
		this.gltfLoaderThree.load(`/${rootFolder}/laptop.glb`, (gltf) => {
			const model = gltf.scene;

			model.opacity = 0;
			this.scene.add(model);
			this.sceneLaptop = model;
			model.position.y = -0.5;
			model.position.z = 2.5;

			initApplication();
		});

		// PHONE MODEL
		this.gltfLoaderFour = new GLTFLoader();
		const phoneRootFolder = "models";
		this.gltfLoaderFour.resourcePath = `/${phoneRootFolder}/`;
		this.gltfLoaderFour.load(`/${phoneRootFolder}/phone.glb`, (gltf) => {
			const model = gltf.scene;
			this.scene.add(model);
			this.scenePhone = model;
			model.position.z = -20;
			model.position.y = -0.5;
			model.rotation.y = -3;
		});

		this.addMesh();
		this.listeners();
		this.render();
	}

	listeners() {
		window.addEventListener("resize", () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.render();
		});
	}

	addMesh() {
		const planeGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
		const material = new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			wireframe: true,
		});
		const plane = new THREE.Mesh(planeGeometry, material);
		plane.rotateX(-Math.PI / 2);
	}

	render() {
		this.time++;
		this.renderer.render(this.scene, this.camera);
		window.requestAnimationFrame(this.render.bind(this));
	}
}

export { ThreeDScene };
