import getFrameRenderer from "./can/frame-renderer";
import getResizeListeners from "./can/resize-listeners";
import initViewPort from "./can/viewport";
import getEventListeners from "./can/event-listeners";

import Launcher from "./phyz/launcher";
import { removeLauncherOtherThan, getLaunchers, getLauncher } from "./phyz/launcher";
import Marble from "./phyz/marble";
import getColliders from "./phyz/colliders";
import { colors } from "./phyz/colors";
import { addMarble, clearMarbles, getMarbles, removeReadyMarbles } from "./phyz/marbles";
import { getNeighbours } from "./phyz/neighbours";
import { initPadEvents } from "padevents";

import VIRT_WIDTH from "./phyz/virt-width";

const eventListeners = getEventListeners(VIRT_WIDTH);
const ballLayer = document.getElementById("ball-layer");
const ballLayerCtx = ballLayer.getContext('2d');
const snapLayer = document.getElementById("snap-layer");
const snapLayerCtx = snapLayer.getContext("2d");
const launcherLayer = document.getElementById("launcher-layer");
const launcherLayerCtx = launcherLayer.getContext("2d")

const ballFrameRenderer = getFrameRenderer(ballLayerCtx, VIRT_WIDTH);
const snapFrameRenderer = getFrameRenderer(snapLayerCtx, VIRT_WIDTH);
const launcherFrameRenderer = getFrameRenderer(launcherLayerCtx, VIRT_WIDTH);
const colliders = getColliders(getMarbles);
const getNeighboursImpl = getNeighbours(getMarbles);

function getBallLayerDrawables() {
	return getMarbles().filter(m => !m.snapped)
		.concat(getLaunchers().map(l => l.marble)
		.filter(m => m !== null))
}

function getLauncherLayerDrawables() {
	return getLaunchers();
}

function getSnapLayerDrawables() {
	return getMarbles().filter(m => m.snapped);
}


const getDrawables = () =>
	getBallLayerDrawables()
		.concat(getSnapLayerDrawables())
		.concat(getLauncherLayerDrawables());

const forceRedraw = () => {
	[ballFrameRenderer, snapFrameRenderer, launcherFrameRenderer]
		.forEach(frame => frame.clear());
	getDrawables().forEach(d => d.updated = true);
};

initViewPort(getResizeListeners([ballLayer, snapLayer, launcherLayer],
	ballFrameRenderer.onResize,
	snapFrameRenderer.onResize,
	launcherFrameRenderer.onResize,
	forceRedraw
));

const renderLoop = () => {
	ballFrameRenderer.render(
		getBallLayerDrawables()
	);
	snapFrameRenderer.render(
		getSnapLayerDrawables()
	);
	launcherFrameRenderer.render(
		getLauncherLayerDrawables()
	);
	requestAnimationFrame(renderLoop);
};

renderLoop();


window.setInterval(
  () => {
		removeReadyMarbles();
		getLaunchers().forEach(l => {
			l.accelerate();
		})
		getMarbles().forEach(m => m.accelerate());
	},
  10
);


const reloadLaucher = (lIdx) => {
	const l = getLauncher(lIdx);
	if (!l.marble) {
		l.marble = new Marble({
			x: l._x, y: l._y,
			color: parseInt(Math.random() * 3) + 1,
			radius: 30, angle: l.ang - (90 * (Math.PI / 180)),
			collidesWithMarble: colliders.marbleCollidesWithMarble,
			getNeighbours: getNeighboursImpl.getNeighbours,
			detectFall: getNeighboursImpl.detectFall,
			clearScreen: forceRedraw
		});
	}
}

const launchMarble = (lIdx) => {
	if (getLauncher(lIdx).marble) {
		getLauncher(lIdx).marble.ang = getLauncher(lIdx).ang - (90 * (Math.PI / 180));
		addMarble(getLauncher(lIdx).marble);
		getLauncher(lIdx).marble = null;
		window.setTimeout(() => reloadLaucher(lIdx), 500);
	}
}

const marbleRadius = 30;
const baseMarbleOpts = {
	radius: marbleRadius,
	angle: 90 * (Math.PI / 180),
	snapped: true,
	collidesWithMarble: colliders.marbleCollidesWithMarble,
	getNeighbours: getNeighboursImpl.getNeighbours,
	detectFall: getNeighboursImpl.detectFall,
	clearScreen: forceRedraw
};
const addRows = (rows) => {
	for (let row = 0; row < rows; row++) {
		getMarbles().filter(m => m.snapped)
			.forEach(m => m.descend())
		for (let i = 0; i < VIRT_WIDTH; i += marbleRadius * 2) {
			addMarble(new Marble({...baseMarbleOpts, x: i + marbleRadius, y: marbleRadius, color: parseInt(Math.random() * 3) + 1}));
		}
	}
	getNeighboursImpl.detectFall();
};

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

let addRowInterval = null;
const startLevel = (lvl) => {
	if (addRowInterval !== null) {
		window.clearInterval(addRowInterval);
	}
	addRows(5);
	addRowInterval = window
		.setInterval(() => addRows(2), lvl < 25 ? 30000 - (lvl * 1000) : 5000);
};

window.addEventListener("gamepad-start-pressed", startGame);
function startGame() {
	window.removeEventListener("gamepad-start-pressed", startGame);

	window.addEventListener("gamepad-l-axis-x-change", ({detail: {force, controllerIndex}}) => {
		if (force === -100) {
			getLauncher(controllerIndex).accDir = -1;
		} else if (force === 100) {
			getLauncher(controllerIndex).accDir = 1;
		} else {
			getLauncher(controllerIndex).acc = 0;
			getLauncher(controllerIndex).accDir = 0;
		}
	});

	window.addEventListener("gamepad-a-pressed", ({detail: { controllerIndex }}) => {
		launchMarble(controllerIndex);
	});

	startLevel(1);
}



initPadEvents({ onControllersChange: reinitLaunchers});
