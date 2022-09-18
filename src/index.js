import { ThreeDScene } from "./3d-scene";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const threeDScene = new ThreeDScene();

//------------------------------------------------------
// HELPERS
//------------------------------------------------------
//For getting the right value to execute the parabolic movement (i.e the curving at to the side)
function quadraticEquation(x, highestYValue = 30) {
	const y = -(highestYValue * 5 * x * x) + highestYValue * 5 * x;
	return y;
}

//For getting the right value to execute the linear movement (i.e zooming)
function linearEquation(value, lowerlimit, upperLimit) {
	return lowerlimit + (upperLimit - lowerlimit) * value;
}

//------------------------------------------------------
// ANIMATIONS
//------------------------------------------------------
function initAnimations() {
	// ANIMATION STAGES
	const firstStage = { value: 0 };
	const secondStage = { value: 0 };

	// TIMELINE
	const tl = gsap.timeline({
		scrollTrigger: {
			trigger: ".section.two",
			toggleActions: "restart pause reverse pause",
			start: "top top",
			end: "bottom bottom",
			pin: "#canvas-wrapper",
			scrub: true,
		},
	});

	tl.to(firstStage, {
		value: 1,
		onUpdate: () => {
			const { sceneLaptop } = threeDScene;
			if (sceneLaptop) {
				const { value } = firstStage;

				const zvalue = 3.3 - linearEquation(value, 0.8, 2.5);
				sceneLaptop.position.z = zvalue;
			}
		},
	}).to(secondStage, {
		value: 1,
		onUpdate: () => {
			const { sceneLaptop, scenePhone } = threeDScene;
			if (sceneLaptop && scenePhone) {
				const { value } = secondStage;
				const { sceneLaptop, scenePhone, sceneRenderer, sceneLightOne, sceneLightTwo, sceneLightThree } = threeDScene;

				//LAPTOP
				const laptopzoomValue = -19.2 - linearEquation(value, -20, 0.8);
				const laptopyRotation = linearEquation(value, 0, 2);
				const laptopxDisplacement = quadraticEquation(value, 1.5);
				sceneLaptop.position.z = laptopzoomValue;
				sceneLaptop.position.x = laptopxDisplacement;
				sceneLaptop.rotation.y = laptopyRotation;

				if (value > 0.7) {
					//RENDERER
					sceneRenderer.toneMappingExposure = 4;
					//LIGHTS
					sceneLightOne.position.set(-3.5, 2.5, 9);
					sceneLightTwo.position.set(3.5, 2.5, 9);
					sceneLightThree.position.set(0, 0, -20);
				} else {
					//RENDERER
					sceneRenderer.toneMappingExposure = 1.3;
					//LIGHTS
					sceneLightOne.position.set(2, 1, 1);
					sceneLightTwo.position.set(-2, 1, 1);
					sceneLightThree.position.set(-1, 10, 1);
				}

				//PHONE
				const phonezoomValue = linearEquation(value, -20, 2);
				const phoneyRotation = linearEquation(value, -3, 0);
				const phonexDisplacement = quadraticEquation(value, -1.5);
				scenePhone.position.z = phonezoomValue;
				scenePhone.position.x = phonexDisplacement;
				scenePhone.rotation.y = phoneyRotation;
			}
		},
	});
}

//------------------------------------------------------
// REMOVE LOADER
//------------------------------------------------------
function removeLoader() {
	const loader = document.querySelector(".loader");
	const body = document.querySelector("body");
	loader.style.display = "none";
	body.classList.remove("block-scrolling");
}

function initApplication() {
	removeLoader();
	initAnimations();
}

document.onreadystatechange = () => {
	if (document.readyState === "complete") {
		initApplication();
	}
};
