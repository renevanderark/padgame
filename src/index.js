import getFrameRenderer from "./can/frame-renderer";
import getResizeListeners from "./can/resize-listeners";
import initViewPort from "./can/viewport";
import getEventListeners from "./can/event-listeners";

import Marble from "./phyz/marble";
import Bar from "./phyz/bar";
import getColliders from "./phyz/colliders";
import { addBar, clearBars, getBars } from "./phyz/bars";
import { addMarble, clearMarbles, getMarbles } from "./phyz/marbles";
import { initPadEvents } from "padevents";



const VIRT_WIDTH = 1000;
const eventListeners = getEventListeners(VIRT_WIDTH);
const can = document.getElementById("can");
const ctx = can.getContext('2d');
const textCan = document.getElementById("text-can");
// const textCtx = textCan.getContext('2d');
const frameRenderer = getFrameRenderer(ctx, VIRT_WIDTH);
// const textRenderer = getFrameRenderer(textCtx, 380);

const colliders = getColliders(getBars, getMarbles);


const renderLoop = () => {
	frameRenderer.render(getMarbles().concat(getBars()));
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
  collidesWithBar: colliders.marbleCollidesWithBar,
	collidesWithMarble: colliders.marbleCollidesWithMarble
};

window.addEventListener("gamepad-a-pressed", () =>
  addMarble(new Marble({...baseMarbleOpts,
		x: 50,
		angle: (Math.random() * 90) * (Math.PI / 180)})));

addBar([
  new Bar(5, 500, 500, 90, 10),
  new Bar(995, 500, 500, 90, 10),
  new Bar(500, 5, 500, 0, 10),
  new Bar(500, 995, 500, 0, 10),
]);

window.setInterval(
  () => getMarbles().forEach(m => m.accelerate()),
  20
);

console.log(initPadEvents());
