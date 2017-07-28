import getFrameRenderer from "./can/frame-renderer";
import getResizeListeners from "./can/resize-listeners";
import initViewPort from "./can/viewport";
import getEventListeners from "./can/event-listeners";

import Launcher from "./phyz/launcher";
import { removeLauncherOtherThan, getLaunchers, getLauncher } from "./phyz/launcher";
import Marble from "./phyz/marble";
import getColliders from "./phyz/colliders";
import { fills, strokes, colors } from "./phyz/colors";
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
const infoDiv = document.getElementById("info");
const pointBar = document.getElementById("point-bar");
const pointBarContainer = document.getElementById("point-bar-container");
const pointBarVert = document.getElementById("point-bar-vert");
const pointBarVertContainer = document.getElementById("point-bar-vert-container");
const ballFrameRenderer = getFrameRenderer(ballLayerCtx, VIRT_WIDTH);
const snapFrameRenderer = getFrameRenderer(snapLayerCtx, VIRT_WIDTH);
const launcherFrameRenderer = getFrameRenderer(launcherLayerCtx, VIRT_WIDTH);
const textFrameRenderer = getFrameRenderer(textLayerCtx, VIRT_WIDTH);

const colliders = getColliders(getMarbles);
const getNeighboursImpl = getNeighbours(getMarbles, addLevelPoints);
const mus1 = new Audio("./mus1.ogg");
const crack = new Audio("./crack.ogg");
const crack2 = new Audio("./crack2.ogg");
const plock = new Audio("./plock.ogg");

window.addEventListener("load", () => setTimeout(() => window.scrollTo(0, 1), 0));


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
	eventListeners.onResize,
	forceRedraw,
	(w, h) => {
		if (w > h) {
			pointBarContainer.style.display = "none";
			pointBarVertContainer.style.display = "block";
			pointBarVertContainer.style.height = `${h}px`;
			pointBarVertContainer.style.left = `${h + 20}px`;
			infoDiv.style.left = `${h + 70}px`;
			infoDiv.style.top = "10px";
			infoDiv.style.width = `${w - h - 60}px`;
			infoDiv.style.height = `${h / 2}px`;
			infoDiv.style.fontSize = `${h / 15}px`;
		} else {
			pointBarVertContainer.style.display = "none";
			pointBarContainer.style.display = "block";
			pointBarContainer.style.width = `${w}px`;
			pointBarContainer.style.top = `${w + 20}px`;
			infoDiv.style.top = `${w + 70}px`;
			infoDiv.style.width = `${w}px`;
			infoDiv.style.left = `10px`;
			infoDiv.style.height = `${h - w - 60}px`;
			infoDiv.style.fontSize = `${w / 15}px`;
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

function getColorCount() {
	return level < 6
		? 3 : (level < 16 ? 4 : 5);
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

const makeSwapBall = (colorCount = 3) => ({
	...baseMarbleOpts,
	snapped: false,
	angle: 0,
	x: 0,
	y: 0,
	color: parseInt(Math.random() * colorCount) + 1,
});


let swapBall = makeSwapBall();
const drawSwapBall = () => {
	document.querySelectorAll(".swap-ball").forEach(bc => {
		const ctx = bc.getContext('2d');
		ctx.clearRect(0, 0, 40, 40);
		ctx.beginPath();
		ctx.fillStyle = fills[swapBall.color];
		ctx.arc(
			marbleRadius * 0.5 + 5, marbleRadius * 0.5 + 5,
			marbleRadius * 0.5,  0, 2 * Math.PI, false
		)
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.fillStyle = strokes[swapBall.color];
		ctx.arc(
			marbleRadius * 0.5 + 5, marbleRadius * 0.5 + 5,
			(marbleRadius - 4) * 0.5,  Math.PI,  Math.PI * 1.5, false
		);
		ctx.fill();
		ctx.closePath();
	})

}
drawSwapBall();

const makeSwapBallFromMarble = (marble) => ({
	...baseMarbleOpts,
	snapped: false,
	angle: 0,
	x: 0,
	y: 0,
	color: marble.color
});

const swapBalls = (controllerIndex) => {
	const l = getLauncher(controllerIndex);
	const orig = l.marble;
	if (orig !== null) {
		const swap = new Marble({
			...swapBall,
			x: l._x,
			y: l._y,
			angle: l.ang - (90 * (Math.PI / 180))
		});
		swapBall = makeSwapBallFromMarble(orig);
		drawSwapBall();
		l.marble = swap;
		forceRedraw();
	}
}

const reloadLaucher = (lIdx, launcher = null) => {
	const l = launcher || getLauncher(lIdx);
	if (!l.marble) {
		l.marble = new Marble({
			...swapBall, x: l._x, y: l._y, angle: l.ang - (90 * (Math.PI / 180))
		});
		swapBall = makeSwapBall(getColorCount());
		drawSwapBall();
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



const addRows = (rows) => {
	for (let row = 0; row < rows; row++) {
		getMarbles().filter(m => m.snapped)
			.forEach(m => m.descend())
		for (let i = 0; i < VIRT_WIDTH; i += marbleRadius * 2) {
			addMarble(new Marble({...baseMarbleOpts,
				 x: i + marbleRadius, y: marbleRadius,
				 color: parseInt(Math.random() * getColorCount()) + 1}));
		}
	}
	getNeighboursImpl.detectFall();
};

const reinitLaunchers = (controllerIndices) => {
	controllerIndices
		.filter((c,idx) => idx < 2)
		.forEach(idx => {
			const l = getLauncher(idx, new Launcher({}), () => reloadLaucher(idx));
			l.updated = true;
			if (l.marble) {
				l.marble.updated = true;
			}
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
let levelTarget = 0;
let level = 0;
let levelPoints = 0;
let gamePoints = 0;
let newRowTimer = 0;

function finishLevel() {
	pointBar.querySelector("div").style.width = "100%";
	pointBarVert.querySelector("div").style.height = "100%";
	levelPoints = 0;
	textFrameRenderer
		.drawText("Well done!", {x: 360, y: 500, fill: "white", timeout: 1250});
	setTimeout(() => startLevel(level + 1), 1250);
}

const setLevelPoints = (amt) => {
	levelPoints = amt;
	if (amt >= levelTarget) {
		finishLevel();
	} else {
		const perc = amt / levelTarget;
		pointBar.querySelector("div").style.width =
			`${parseInt((perc > 1 ? 1 : perc) * 100)}%`;
		pointBarVert.querySelector("div").style.height =
			`${parseInt((perc > 1 ? 1 : perc)) * 100)}%`;
	}
}

const setGamePoints = (amt) => {
	gamePoints = amt;
	document.getElementById("points").innerHTML = gamePoints;
}

function addLevelPoints(amt) {
	setLevelPoints(levelPoints + amt);
	setGamePoints(gamePoints + amt);
}

function resetNewRowTimer() {
	newRowTimer = 26;
}

window.setInterval(() => {
	newRowTimer = newRowTimer <= 0 ? 0 : newRowTimer - 1;
	if (newRowTimer <= 10 && newRowTimer > 0) {
		document.getElementById("new-row-timer").innerHTML = `${newRowTimer}`
	} else {
		document.getElementById("new-row-timer").innerHTML = "";
	}
}, 1000);

const startLevel = (lvl) => {
	document.getElementById("level").innerHTML = `Level ${lvl}`;
	level = lvl;
	levelTarget += 25;
	if (level === 1) { clearMarbles(); }
	setLevelPoints(0);
	forceRedraw();

	textFrameRenderer
		.drawText(`Level ${lvl}!`, {x: 360, y: 500, fill: "white", timeout: 1250});

	if (level === 1) {
		addRows(5);
		mus1.play();
	}

};

let clearWelcome = textFrameRenderer.drawText("Press start", {
	x: 350,
	y: 500,
	fill: "white"
});

const onTouchMove = (name, ev, scale) => {
	onMouseMove(name, {
		clientX: ev.touches[0].clientX,
		clientY: ev.touches[0].clientY
	}, scale);
}

const onMouseMove = (name, {clientX, clientY}, scale) => {
	const lX = getLauncher("0")._x;
	const lY = getLauncher("0")._y;
	const evX = clientX / scale;
	const evY = clientY / scale;

	getLauncher("0").setAng(Math.atan2(
		(evY - lY - marbleRadius / 2) / VIRT_WIDTH,
		(evX - lX - marbleRadius / 2) / VIRT_WIDTH
	) + (90 * (Math.PI / 180)));
	getLauncher("0").updated = true;
}

function gameOver() {
	textLayer.style.backgroundColor = "rgba(96,96,96,0.6)";

	if (addRowInterval !== null) {
		window.clearInterval(addRowInterval);
	}

	window.removeEventListener("gamepad-l-axis-x-change", onAxis);
	window.removeEventListener("gamepad-a-pressed", onAPressed);
	window.removeEventListener("gamepad-b-pressed", onBPressed);
	window.removeEventListener("gamepad-left-pressed", onLeftPressed);
	window.removeEventListener("gamepad-left-released", onArrowReleased);
	window.removeEventListener("gamepad-right-pressed", onRightPressed);
	window.removeEventListener("gamepad-right-released", onArrowReleased);
	window.removeEventListener("contextmenu", onRightClick);
	eventListeners.clear();
	clearWelcome = textFrameRenderer.drawText("Game over! Press start", {
		x: 150,
		y: 500,
		fill: "white"
	});
	window.addEventListener("gamepad-start-pressed", startGame);
	window.addEventListener("click", startGame);
	window.addEventListener("touchstart", startGame);
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

function onBPressed({detail: { controllerIndex }}) {
	swapBalls(controllerIndex);
}

function onRightClick(ev) {
	ev.preventDefault();
	swapBalls("0");
	return false;
}

function onSwapBallClick() {
	swapBalls("0");
}

function onRightPressed({detail: { controllerIndex }}) {
	getLauncher(controllerIndex).accDir = 1;
}

function onLeftPressed({detail: { controllerIndex }}) {
	getLauncher(controllerIndex).accDir = -1;
}

function onArrowReleased({detail: { controllerIndex }}) {
	getLauncher(controllerIndex).acc = 0;
	getLauncher(controllerIndex).accDir = 0;
}

function onClick() {
	launchMarble("0");
}

function startGame() {
	level = 0;
	levelTarget = 250;
	setLevelPoints(0);
	setGamePoints(0);
	clearMarbles();
	forceRedraw();
	clearWelcome();
	textLayer.style.backgroundColor = "rgba(0,0,0,0)";
	window.removeEventListener("gamepad-start-pressed", startGame);
	window.removeEventListener("click", startGame);
	window.removeEventListener("touchstart", startGame);
	window.addEventListener("gamepad-l-axis-x-change", onAxis);
	window.addEventListener("gamepad-a-pressed", onAPressed);
	window.addEventListener("gamepad-b-pressed", onBPressed);
	window.addEventListener("gamepad-left-pressed", onLeftPressed);
	window.addEventListener("gamepad-left-released", onArrowReleased);
	window.addEventListener("gamepad-right-pressed", onRightPressed);
	window.addEventListener("gamepad-right-released", onArrowReleased);
	window.addEventListener("contextmenu", onRightClick);
	eventListeners.add("click", onClick, textLayer);
	eventListeners.add("touchend", onClick, textLayer);
	eventListeners.add("mousemove", onMouseMove, textLayer);
	eventListeners.add("touchmove", onTouchMove, textLayer);
	eventListeners.add("touchstart", onTouchMove, textLayer);
	document.querySelectorAll(".swap-ball").forEach(bc => {
		eventListeners.add("click", onSwapBallClick, bc);
	});
	if (getLaunchers().length === 0) {
		reinitLaunchers(["0"]);
	}

	resetNewRowTimer();
	addRowInterval = window
		.setInterval(() =>  {
			addRows(2);
			resetNewRowTimer();
			mus1.play();
		}, 26000
	);
	swapBall = makeSwapBall();
	drawSwapBall();
	getLaunchers().forEach(l => {
		l.marble = null;
		reloadLaucher(null, l);
	});
	startLevel(1);
}


textLayer.style.backgroundColor = "rgba(96,96,96,0.6)";

window.addEventListener("gamepad-start-pressed", startGame);
window.addEventListener("click", startGame);
window.addEventListener("touchstart", startGame);
initPadEvents({ onControllersChange: reinitLaunchers});
