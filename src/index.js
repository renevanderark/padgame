import getFrameRenderer from "./can/frame-renderer";
import getResizeListeners from "./can/resize-listeners";
import initViewPort from "./can/viewport";
import getEventListeners from "./can/event-listeners";

import Launcher from "./phyz/launcher";
import { removeLauncherOtherThan, getLaunchers, getLauncher } from "./phyz/launcher";
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
	frameRenderer.render(
		getMarbles()
		.concat(getLaunchers())
		.concat(getLaunchers().map(l => l.marble)
			.filter(m => m !== null))
	);
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
  () => {
		getLaunchers().forEach(l => {
			l.accelerate();
		})
		getMarbles().forEach(m => m.accelerate());
	},
  20
);

const reinitLaunchers = (controllerIndices) => {

	controllerIndices
		.filter((c,idx) => idx < 2)
		.forEach(idx => {
			getLauncher(idx, new Launcher({}), () => reloadLaucher(idx));
		});

	if (controllerIndices.length === 1 && getLaunchers().length > 1) {
		removeLauncherOtherThan(controllerIndices);
	}

	if (controllerIndices.length === 1) {
		getLaunchers()[0]._x = 500;
		if (getLaunchers()[0].marble) {
			getLaunchers()[0].marble._x = 500;
		}
	} else if (controllerIndices.length === 2) {
		getLaunchers()[0]._x = 250;
		if (getLaunchers()[0].marble) {
			getLaunchers()[0].marble._x = 250;
		}
		getLaunchers()[1]._x = 750;
		if (getLaunchers()[1].marble) {
			getLaunchers()[1].marble._x = 750;
		}
	}
}

const reloadLaucher = (lIdx) => {
	const l = getLauncher(lIdx);
	if (!l.marble) {
		l.marble = new Marble({
			x: l._x, y: l._y,
			stroke: "rgba(255, 255, 0, 0.8)",
			fill: "rgba(255, 255, 0, 0.95)",
			radius: 20, angle: l.ang - (90 * (Math.PI / 180)),
			collidesWithMarble: colliders.marbleCollidesWithMarble
		});
	}
}

const launchMarble = (lIdx) => {

	if (getLauncher(lIdx).marble) {
		getLauncher(lIdx).marble.ang = getLauncher(lIdx).ang - (90 * (Math.PI / 180));
		addMarble(getLauncher(lIdx).marble);
		getLauncher(lIdx).marble = null;
		window.setTimeout(() => reloadLaucher(lIdx), 1000);
	}
}

window.addEventListener("gamepad-l-axis-x-change", ({detail: {force, controllerIndex}}) => {
	//console.log(controllerIndex);
	getLauncher(controllerIndex).acc =
		Math.abs(force) === 100 ?
			force * 0.0002 : 0;
});

window.addEventListener("gamepad-a-pressed", ({detail: { controllerIndex }}) => {
	launchMarble(controllerIndex);
})
/*
window.addEventListener("keydown", (ev) => {
	reinitLaunchers(["1"]);
	if (ev.keyCode === 37) {
		getLauncher("1").acc = -0.01;
	}
	if (ev.keyCode === 39) {
		getLauncher("1").acc = 0.01;
	}
	if (ev.keyCode === 32) {
		launchMarble("1");
	}
});

window.addEventListener("keyup", (ev) => {
	if (ev.keyCode === 37 || ev.keyCode === 39) {
		getLauncher("1").acc = 0;
	}
});
*/


initPadEvents({ onControllersChange: reinitLaunchers});
