import getFrameRenderer from "./can/frame-renderer";
import getResizeListeners from "./can/resize-listeners";
import initViewPort from "./can/viewport";
import getEventListeners from "./can/event-listeners";

import Launcher from "./phyz/launcher";
import { putLauncher, getLaunchers, getLauncher } from "./phyz/launcher";
import Marble from "./phyz/marble";
import getColliders from "./phyz/colliders";
import { addMarble, clearMarbles, getMarbles } from "./phyz/marbles";
import { initPadEvents } from "padevents";

const VIRT_WIDTH = 1000;
const eventListeners = getEventListeners(VIRT_WIDTH);
const can = document.getElementById("can");
const ctx = can.getContext('2d');
const textCan = document.getElementById("text-can");
// const textCtx = textCan.geftContext('2d');
const frameRenderer = getFrameRenderer(ctx, VIRT_WIDTH);
// const textRenderer = getFrameRenderer(textCtx, 380);

const colliders = getColliders(getMarbles);


const renderLoop = () => {
	frameRenderer.render(getMarbles().concat(getLaunchers()));
	requestAnimationFrame(renderLoop);
};

initViewPort(getResizeListeners([can /*, textCan*/],
	frameRenderer.onResize, /*textRenderer.onResize,*/
	eventListeners.onResize));

renderLoop();

const baseMarbleOpts = {
  x: 54,
  y: 54,
  radius: 15,
	collidesWithMarble: colliders.marbleCollidesWithMarble
};

/*
window.addEventListener("gamepad-a-pressed", () =>
  addMarble(new Marble({...baseMarbleOpts,
		x: 50,
		angle: (Math.random() * 90) * (Math.PI / 180)})));

*/
window.setInterval(
  () => getLaunchers().forEach(l => l.accelerate()),
  20
);


window.addEventListener("gamepad-l-axis-x-change", ({detail: {force, controllerIndex}}) => {
	getLauncher(controllerIndex).acc = Math.abs(force) === 100 ?
		force * 0.001 : 0;
});

const updateLaunchers = (controllerIndices) => {
	controllerIndices
		.forEach(idx => putLauncher(idx, new Launcher({})));
}


console.log(initPadEvents({ onControllersChange: updateLaunchers}));
