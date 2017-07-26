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
const launcherLayerCtx = launcherLayer.getContext("2d");
const textLayer = document.getElementById("text-layer");
const textLayerCtx = textLayer.getContext("2d");
const pointBar = document.getElementById("point-bar");
const pointBarVert = document.getElementById("point-bar-vert");

const ballFrameRenderer = getFrameRenderer(ballLayerCtx, VIRT_WIDTH);
const snapFrameRenderer = getFrameRenderer(snapLayerCtx, VIRT_WIDTH);
const launcherFrameRenderer = getFrameRenderer(launcherLayerCtx, VIRT_WIDTH);
const textFrameRenderer = getFrameRenderer(textLayerCtx, VIRT_WIDTH);

const colliders = getColliders(getMarbles);
const getNeighboursImpl = getNeighbours(getMarbles, addLevelPoints);

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

initViewPort(getResizeListeners([ballLayer, snapLayer, launcherLayer, textLayer],
	ballFrameRenderer.onResize,
	snapFrameRenderer.onResize,
	launcherFrameRenderer.onResize,
	textFrameRenderer.onResize,
	forceRedraw,
	(w, h) => {
		if (w > h) {
			pointBar.style.display = "none";
			pointBarVert.style.display = "block";
			pointBarVert.style.height = `${h - 10}px`;
			pointBarVert.style.left = `${h + 20}px`;
		} else {
			pointBar.style.display = "block";
			pointBarVert.style.display = "none";
			pointBar.style.width = `${w}px`;
			pointBar.style.top = `${w + 20}px`;
		}
	}
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
		});
		getMarbles().forEach(m => {
			m.accelerate();
			if (m.snapped && !m.readyToBeRemoved && !m.markedForRemoval &&  m._y > VIRT_WIDTH - m.radius * 2) {
				gameOver();
			}
		});
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
			clearScreen: forceRedraw,
			addPoints: addLevelPoints
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
	addPoints: addLevelPoints,
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
let levelTarget = 500;
let level = 0;
let levelPoints = 0;

const setLevelPoints = (amt) => {
	if (levelPoints > levelTarget) {
		pointBar.querySelector("div").style.width = "100%";
		pointBarVert.querySelector("div").style.height = "100%"
		levelTarget += 500;

		textFrameRenderer
			.drawText("Well done!", {x: 360, y: 500, fill: "white", timeout: 1250});
		setTimeout(() => startLevel(level + 1), 1250);
	} else {
		pointBar.querySelector("div").style.width =
			`${(amt / levelTarget) * 100}%`;
		pointBarVert.querySelector("div").style.height =
			`${(amt / levelTarget) * 100}%`;
		levelPoints = amt;
	}
}

function addLevelPoints(amt) {
	setLevelPoints(levelPoints + amt);
}

const startLevel = (lvl) => {
	level = lvl;
	clearMarbles();
	setLevelPoints(0);
	if (addRowInterval !== null) {
		window.clearInterval(addRowInterval);
	}

	textFrameRenderer
		.drawText(`Level ${lvl}!`, {x: 360, y: 500, fill: "white", timeout: 1250});

	addRows(5);
	addRowInterval = window
		.setInterval(() => addRows(2), lvl < 25 ? 30000 - (lvl * 1000) : 5000);
};

let clearWelcome = textFrameRenderer.drawText("Press start", {
	x: 350,
	y: 500,
	fill: "white"
});

function gameOver() {
	level = 0;
	levelPoints = 0;
	textLayer.style.backgroundColor = "#6666";

	if (addRowInterval !== null) {
		window.clearInterval(addRowInterval);
	}

	window.removeEventListener("gamepad-l-axis-x-change", onAxis);
	window.removeEventListener("gamepad-a-pressed", onAPressed);


	clearWelcome = textFrameRenderer.drawText("Game over! Press start", {
		x: 150,
		y: 500,
		fill: "white"
	});
	window.addEventListener("gamepad-start-pressed", startGame);
}

function onAxis({detail: {force, controllerIndex}}) {
	if (force === -100) {
		getLauncher(controllerIndex).accDir = -1;
	} else if (force === 100) {
		getLauncher(controllerIndex).accDir = 1;
	} else {
		getLauncher(controllerIndex).acc = 0;
		getLauncher(controllerIndex).accDir = 0;
	}
}

function onAPressed({detail: { controllerIndex }}) {
	launchMarble(controllerIndex);
}

function startGame() {
	clearMarbles();
	forceRedraw();
	clearWelcome();
	textLayer.style.backgroundColor = "rgba(0,0,0,0)";
	window.removeEventListener("gamepad-start-pressed", startGame);
	window.addEventListener("gamepad-l-axis-x-change", onAxis);
	window.addEventListener("gamepad-a-pressed", onAPressed);

	startLevel(1);
}

window.addEventListener("gamepad-start-pressed", startGame);

initPadEvents({ onControllersChange: reinitLaunchers});
