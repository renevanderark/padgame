(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["padEvents"] = factory();
	else
		root["padEvents"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _frameRenderer = __webpack_require__(1);

	var _frameRenderer2 = _interopRequireDefault(_frameRenderer);

	var _resizeListeners = __webpack_require__(2);

	var _resizeListeners2 = _interopRequireDefault(_resizeListeners);

	var _viewport = __webpack_require__(3);

	var _viewport2 = _interopRequireDefault(_viewport);

	var _eventListeners = __webpack_require__(4);

	var _eventListeners2 = _interopRequireDefault(_eventListeners);

	var _launcher = __webpack_require__(5);

	var _launcher2 = _interopRequireDefault(_launcher);

	var _marble = __webpack_require__(7);

	var _marble2 = _interopRequireDefault(_marble);

	var _colliders = __webpack_require__(15);

	var _colliders2 = _interopRequireDefault(_colliders);

	var _colors = __webpack_require__(13);

	var _marbles = __webpack_require__(16);

	var _neighbours = __webpack_require__(14);

	var _padevents = __webpack_require__(17);

	var _virtWidth = __webpack_require__(6);

	var _virtWidth2 = _interopRequireDefault(_virtWidth);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var eventListeners = (0, _eventListeners2.default)(_virtWidth2.default);
	var ballLayer = document.getElementById("ball-layer");
	var ballLayerCtx = ballLayer.getContext('2d');
	var snapLayer = document.getElementById("snap-layer");
	var snapLayerCtx = snapLayer.getContext("2d");
	var launcherLayer = document.getElementById("launcher-layer");
	var launcherLayerCtx = launcherLayer.getContext("2d");
	var textLayer = document.getElementById("text-layer");
	var textLayerCtx = textLayer.getContext("2d");
	var infoDiv = document.getElementById("info");
	var pointBar = document.getElementById("point-bar");
	var pointBarContainer = document.getElementById("point-bar-container");
	var pointBarVert = document.getElementById("point-bar-vert");
	var pointBarVertContainer = document.getElementById("point-bar-vert-container");
	var ballFrameRenderer = (0, _frameRenderer2.default)(ballLayerCtx, _virtWidth2.default);
	var snapFrameRenderer = (0, _frameRenderer2.default)(snapLayerCtx, _virtWidth2.default);
	var launcherFrameRenderer = (0, _frameRenderer2.default)(launcherLayerCtx, _virtWidth2.default);
	var textFrameRenderer = (0, _frameRenderer2.default)(textLayerCtx, _virtWidth2.default);

	var colliders = (0, _colliders2.default)(_marbles.getMarbles);
	var getNeighboursImpl = (0, _neighbours.getNeighbours)(_marbles.getMarbles, addLevelPoints);
	var mus1 = new Audio("./mus1.ogg");
	var crack = new Audio("./crack.ogg");
	var crack2 = new Audio("./crack2.ogg");
	var plock = new Audio("./plock.ogg");

	window.addEventListener("load", function () {
		return setTimeout(function () {
			return window.scrollTo(0, 1);
		}, 0);
	});

	function getBallLayerDrawables() {
		return (0, _marbles.getMarbles)().filter(function (m) {
			return !m.snapped;
		}).concat((0, _launcher.getLaunchers)().map(function (l) {
			return l.marble;
		}).filter(function (m) {
			return m !== null;
		}));
	}

	function getLauncherLayerDrawables() {
		return (0, _launcher.getLaunchers)();
	}

	function getSnapLayerDrawables() {
		return (0, _marbles.getMarbles)().filter(function (m) {
			return m.snapped;
		});
	}

	var getDrawables = function getDrawables() {
		return getBallLayerDrawables().concat(getSnapLayerDrawables()).concat(getLauncherLayerDrawables());
	};

	var forceRedraw = function forceRedraw() {
		[ballFrameRenderer, snapFrameRenderer, launcherFrameRenderer].forEach(function (frame) {
			return frame.clear();
		});
		getDrawables().forEach(function (d) {
			return d.updated = true;
		});
	};

	(0, _viewport2.default)((0, _resizeListeners2.default)([ballLayer, snapLayer, launcherLayer, textLayer], ballFrameRenderer.onResize, snapFrameRenderer.onResize, launcherFrameRenderer.onResize, textFrameRenderer.onResize, eventListeners.onResize, forceRedraw, function (w, h) {
		if (w > h) {
			pointBarContainer.style.display = "none";
			pointBarVertContainer.style.display = "block";
			pointBarVertContainer.style.height = h + "px";
			pointBarVertContainer.style.left = h + 20 + "px";
			infoDiv.style.left = h + 70 + "px";
			infoDiv.style.top = "10px";
			infoDiv.style.width = w - h - 60 + "px";
			infoDiv.style.height = h / 2 + "px";
			infoDiv.style.fontSize = h / 15 + "px";
		} else {
			pointBarVertContainer.style.display = "none";
			pointBarContainer.style.display = "block";
			pointBarContainer.style.width = w + "px";
			pointBarContainer.style.top = w + 20 + "px";
			infoDiv.style.top = w + 70 + "px";
			infoDiv.style.width = w + "px";
			infoDiv.style.left = "10px";
			infoDiv.style.height = h - w - 60 + "px";
			infoDiv.style.fontSize = w / 15 + "px";
		}
	}));

	var renderLoop = function renderLoop() {
		ballFrameRenderer.render(getBallLayerDrawables());
		snapFrameRenderer.render(getSnapLayerDrawables());
		launcherFrameRenderer.render(getLauncherLayerDrawables());
		requestAnimationFrame(renderLoop);
	};

	renderLoop();

	window.setInterval(function () {
		(0, _marbles.removeReadyMarbles)();
		(0, _launcher.getLaunchers)().forEach(function (l) {
			l.accelerate();
		});
		(0, _marbles.getMarbles)().forEach(function (m) {
			m.accelerate();
			if (m.snapped && !m.readyToBeRemoved && !m.markedForRemoval && m._y > _virtWidth2.default - m.radius * 2) {
				gameOver();
			}
		});
	}, 10);

	function getColorCount() {
		return level < 6 ? 3 : level < 16 ? 4 : 5;
	}

	var marbleRadius = 30;
	var baseMarbleOpts = {
		radius: marbleRadius,
		angle: 90 * (Math.PI / 180),
		snapped: true,
		collidesWithMarble: colliders.marbleCollidesWithMarble,
		getNeighbours: getNeighboursImpl.getNeighbours,
		detectFall: getNeighboursImpl.detectFall,
		addPoints: addLevelPoints,
		clearScreen: forceRedraw
	};

	var makeSwapBall = function makeSwapBall() {
		var colorCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
		return _extends({}, baseMarbleOpts, {
			snapped: false,
			angle: 0,
			x: 0,
			y: 0,
			color: parseInt(Math.random() * colorCount) + 1
		});
	};

	var swapBall = makeSwapBall();
	var drawSwapBall = function drawSwapBall() {
		document.querySelectorAll(".swap-ball").forEach(function (bc) {
			var ctx = bc.getContext('2d');
			ctx.clearRect(0, 0, 40, 40);
			ctx.beginPath();
			ctx.fillStyle = _colors.fills[swapBall.color];
			ctx.arc(marbleRadius * 0.5 + 5, marbleRadius * 0.5 + 5, marbleRadius * 0.5, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = _colors.strokes[swapBall.color];
			ctx.arc(marbleRadius * 0.5 + 5, marbleRadius * 0.5 + 5, (marbleRadius - 4) * 0.5, Math.PI, Math.PI * 1.5, false);
			ctx.fill();
			ctx.closePath();
		});
	};
	drawSwapBall();

	var makeSwapBallFromMarble = function makeSwapBallFromMarble(marble) {
		return _extends({}, baseMarbleOpts, {
			snapped: false,
			angle: 0,
			x: 0,
			y: 0,
			color: marble.color
		});
	};

	var swapBalls = function swapBalls(controllerIndex) {
		var l = (0, _launcher.getLauncher)(controllerIndex);
		var orig = l.marble;
		if (orig !== null) {
			var swap = new _marble2.default(_extends({}, swapBall, {
				x: l._x,
				y: l._y,
				angle: l.ang - 90 * (Math.PI / 180)
			}));
			swapBall = makeSwapBallFromMarble(orig);
			drawSwapBall();
			l.marble = swap;
			forceRedraw();
		}
	};

	var reloadLaucher = function reloadLaucher(lIdx) {
		var launcher = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		var l = launcher || (0, _launcher.getLauncher)(lIdx);
		if (!l.marble) {
			l.marble = new _marble2.default(_extends({}, swapBall, { x: l._x, y: l._y, angle: l.ang - 90 * (Math.PI / 180)
			}));
			swapBall = makeSwapBall(getColorCount());
			drawSwapBall();
		}
	};

	var launchMarble = function launchMarble(lIdx) {
		if ((0, _launcher.getLauncher)(lIdx).marble) {
			(0, _launcher.getLauncher)(lIdx).marble.ang = (0, _launcher.getLauncher)(lIdx).ang - 90 * (Math.PI / 180);
			(0, _marbles.addMarble)((0, _launcher.getLauncher)(lIdx).marble);
			(0, _launcher.getLauncher)(lIdx).marble = null;
			window.setTimeout(function () {
				return reloadLaucher(lIdx);
			}, 500);
		}
	};

	var addRows = function addRows(rows) {
		for (var row = 0; row < rows; row++) {
			(0, _marbles.getMarbles)().filter(function (m) {
				return m.snapped;
			}).forEach(function (m) {
				return m.descend();
			});
			for (var i = 0; i < _virtWidth2.default; i += marbleRadius * 2) {
				(0, _marbles.addMarble)(new _marble2.default(_extends({}, baseMarbleOpts, {
					x: i + marbleRadius, y: marbleRadius,
					color: parseInt(Math.random() * getColorCount()) + 1 })));
			}
		}
		getNeighboursImpl.detectFall();
	};

	var reinitLaunchers = function reinitLaunchers(controllerIndices) {
		controllerIndices.filter(function (c, idx) {
			return idx < 2;
		}).forEach(function (idx) {
			var l = (0, _launcher.getLauncher)(idx, new _launcher2.default({}), function () {
				return reloadLaucher(idx);
			});
			l.updated = true;
			if (l.marble) {
				l.marble.updated = true;
			}
		});

		if (controllerIndices.length === 1 && (0, _launcher.getLaunchers)().length > 1) {
			(0, _launcher.removeLauncherOtherThan)(controllerIndices);
		}

		if (controllerIndices.length === 1) {
			(0, _launcher.getLaunchers)()[0]._x = 500;
			if ((0, _launcher.getLaunchers)()[0].marble) {
				(0, _launcher.getLaunchers)()[0].marble._x = 500;
			}
		} else if (controllerIndices.length === 2) {
			(0, _launcher.getLaunchers)()[0]._x = 250;
			if ((0, _launcher.getLaunchers)()[0].marble) {
				(0, _launcher.getLaunchers)()[0].marble._x = 250;
			}
			(0, _launcher.getLaunchers)()[1]._x = 750;
			if ((0, _launcher.getLaunchers)()[1].marble) {
				(0, _launcher.getLaunchers)()[1].marble._x = 750;
			}
		}
	};

	var addRowInterval = null;
	var levelTarget = 0;
	var level = 0;
	var levelPoints = 0;
	var gamePoints = 0;
	var newRowTimer = 0;

	function finishLevel() {
		pointBar.querySelector("div").style.width = "100%";
		pointBarVert.querySelector("div").style.height = "100%";
		levelPoints = 0;
		textFrameRenderer.drawText("Well done!", { x: 360, y: 500, fill: "white", timeout: 1250 });
		setTimeout(function () {
			return startLevel(level + 1);
		}, 1250);
	}

	var setLevelPoints = function setLevelPoints(amt) {
		if (levelPoints >= levelTarget) {
			finishLevel();
		} else {
			pointBar.querySelector("div").style.width = parseInt(amt / levelTarget * 100) + "%";
			pointBarVert.querySelector("div").style.height = parseInt(amt / levelTarget * 100) + "%";
			levelPoints = amt;
		}
	};

	var setGamePoints = function setGamePoints(amt) {
		gamePoints = amt;
		document.getElementById("points").innerHTML = gamePoints;
	};

	function addLevelPoints(amt) {
		setLevelPoints(levelPoints + amt);
		setGamePoints(gamePoints + amt);
	}

	function resetNewRowTimer() {
		newRowTimer = 26;
	}

	window.setInterval(function () {
		newRowTimer = newRowTimer <= 0 ? 0 : newRowTimer - 1;
		if (newRowTimer <= 10 && newRowTimer > 0) {
			document.getElementById("new-row-timer").innerHTML = "" + newRowTimer;
		} else {
			document.getElementById("new-row-timer").innerHTML = "";
		}
	}, 1000);

	var startLevel = function startLevel(lvl) {
		document.getElementById("level").innerHTML = "Level " + lvl;
		level = lvl;
		levelTarget += 25;
		if (level === 1) {
			(0, _marbles.clearMarbles)();
		}
		setLevelPoints(0);
		forceRedraw();

		textFrameRenderer.drawText("Level " + lvl + "!", { x: 360, y: 500, fill: "white", timeout: 1250 });

		if (level === 1) {
			addRows(5);
			mus1.play();
		}
	};

	var clearWelcome = textFrameRenderer.drawText("Press start", {
		x: 350,
		y: 500,
		fill: "white"
	});

	var onTouchMove = function onTouchMove(name, ev, scale) {
		onMouseMove(name, {
			clientX: ev.touches[0].clientX,
			clientY: ev.touches[0].clientY
		}, scale);
	};

	var onMouseMove = function onMouseMove(name, _ref, scale) {
		var clientX = _ref.clientX,
		    clientY = _ref.clientY;

		var lX = (0, _launcher.getLauncher)("0")._x;
		var lY = (0, _launcher.getLauncher)("0")._y;
		var evX = clientX / scale;
		var evY = clientY / scale;

		(0, _launcher.getLauncher)("0").setAng(Math.atan2((evY - lY - marbleRadius / 2) / _virtWidth2.default, (evX - lX - marbleRadius / 2) / _virtWidth2.default) + 90 * (Math.PI / 180));
		(0, _launcher.getLauncher)("0").updated = true;
	};

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

	function onAxis(_ref2) {
		var _ref2$detail = _ref2.detail,
		    force = _ref2$detail.force,
		    controllerIndex = _ref2$detail.controllerIndex;

		if (force === -100) {
			(0, _launcher.getLauncher)(controllerIndex).accDir = -1;
		} else if (force === 100) {
			(0, _launcher.getLauncher)(controllerIndex).accDir = 1;
		} else {
			(0, _launcher.getLauncher)(controllerIndex).acc = 0;
			(0, _launcher.getLauncher)(controllerIndex).accDir = 0;
		}
	}

	function onAPressed(_ref3) {
		var controllerIndex = _ref3.detail.controllerIndex;

		launchMarble(controllerIndex);
	}

	function onBPressed(_ref4) {
		var controllerIndex = _ref4.detail.controllerIndex;

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

	function onRightPressed(_ref5) {
		var controllerIndex = _ref5.detail.controllerIndex;

		(0, _launcher.getLauncher)(controllerIndex).accDir = 1;
	}

	function onLeftPressed(_ref6) {
		var controllerIndex = _ref6.detail.controllerIndex;

		(0, _launcher.getLauncher)(controllerIndex).accDir = -1;
	}

	function onArrowReleased(_ref7) {
		var controllerIndex = _ref7.detail.controllerIndex;

		(0, _launcher.getLauncher)(controllerIndex).acc = 0;
		(0, _launcher.getLauncher)(controllerIndex).accDir = 0;
	}

	function onClick() {
		launchMarble("0");
	}

	function startGame() {
		level = 0;
		levelTarget = 250;
		setLevelPoints(0);
		setGamePoints(0);
		(0, _marbles.clearMarbles)();
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
		document.querySelectorAll(".swap-ball").forEach(function (bc) {
			eventListeners.add("click", onSwapBallClick, bc);
		});
		if ((0, _launcher.getLaunchers)().length === 0) {
			reinitLaunchers(["0"]);
		}

		resetNewRowTimer();
		addRowInterval = window.setInterval(function () {
			addRows(2);
			resetNewRowTimer();
			mus1.play();
		}, 26000);
		swapBall = makeSwapBall();
		drawSwapBall();
		(0, _launcher.getLaunchers)().forEach(function (l) {
			l.marble = null;
			reloadLaucher(null, l);
		});
		startLevel(1);
	}

	textLayer.style.backgroundColor = "rgba(96,96,96,0.6)";

	window.addEventListener("gamepad-start-pressed", startGame);
	window.addEventListener("click", startGame);
	window.addEventListener("touchstart", startGame);
	(0, _padevents.initPadEvents)({ onControllersChange: reinitLaunchers });

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (ctx, vWidth) {
		var width = void 0,
		    height = void 0,
		    scale = void 0;
		var clearRequested = false;

		return {
			onResize: function onResize(w, h) {
				width = w;
				height = h;
				scale = w < h ? w / vWidth : h / vWidth;
			},
			clear: function clear() {
				clearRequested = true;
			},
			render: function render(drawables) {
				if (clearRequested) {
					ctx.clearRect(0, 0, width, height);
					clearRequested = false;
				} else {
					drawables.filter(function (d) {
						return d.updated;
					}).forEach(function (d) {
						return d.clear(ctx, scale);
					});
				}
				drawables.filter(function (d) {
					return d.updated;
				}).forEach(function (d) {
					return d.draw(ctx, scale);
				});
			},
			drawText: function drawText(txt, _ref) {
				var _ref$x = _ref.x,
				    x = _ref$x === undefined ? 50 : _ref$x,
				    _ref$y = _ref.y,
				    y = _ref$y === undefined ? 50 : _ref$y,
				    _ref$timeout = _ref.timeout,
				    timeout = _ref$timeout === undefined ? null : _ref$timeout,
				    _ref$fill = _ref.fill,
				    fill = _ref$fill === undefined ? null : _ref$fill,
				    _ref$font = _ref.font,
				    font = _ref$font === undefined ? null : _ref$font,
				    _ref$shade = _ref.shade,
				    shade = _ref$shade === undefined ? false : _ref$shade,
				    _ref$shadeDistance = _ref.shadeDistance,
				    shadeDistance = _ref$shadeDistance === undefined ? null : _ref$shadeDistance;

				var _x = parseInt(Math.ceil(x * scale), 10);
				var _y = parseInt(Math.ceil(y * scale), 10);
				ctx.font = font || "bold " + 50 * scale + "px sans-serif";
				if (shade) {
					ctx.fillStyle = shade;
					ctx.fillText(txt, _x + (shadeDistance || 2), _y + (shadeDistance || 2));
				}
				ctx.fillStyle = fill || "#a00";
				ctx.fillText(txt, _x, _y);
				var width = ctx.measureText(txt).width;
				var doClear = function doClear() {
					return ctx.clearRect(_x, _y - 50 * scale, width + 5, 50 * scale);
				};
				if (timeout) {
					setTimeout(doClear, timeout || 500);
				}
				return doClear;
			}
		};
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (canvases) {
		for (var _len = arguments.length, listeners = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			listeners[_key - 1] = arguments[_key];
		}

		function rescaleGame(width, height) {
			canvases.forEach(function (canvas) {
				canvas.width = width > height ? height : width;
				canvas.height = width > height ? height : width;
			});
		}

		return [rescaleGame].concat(listeners);
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (listeners) {
		function onResize() {
			listeners.forEach(function (listener) {
				listener(window.innerWidth - 20, window.innerHeight - 20);
			});
		}

		onResize();
		window.addEventListener("resize", onResize);
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (vWidth) {
		var width = void 0,
		    height = void 0,
		    scale = void 0;
		var registered = [];

		return {
			onResize: function onResize(w, h) {
				width = w;
				height = h;
				scale = w < h ? w / vWidth : h / vWidth;
			},
			add: function add(eventName, onEvent) {
				var elem = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window;

				var fn = function fn(ev) {
					return onEvent(eventName, ev, scale);
				};

				registered.push({
					elem: elem,
					eventName: eventName,
					fn: fn
				});

				elem.addEventListener(eventName, fn);
			},
			clear: function clear() {
				registered.forEach(function (_ref) {
					var elem = _ref.elem,
					    eventName = _ref.eventName,
					    fn = _ref.fn;
					return elem.removeEventListener(eventName, fn);
				});
			}
		};
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.removeLauncherOtherThan = exports.getLauncher = exports.getLaunchers = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _virtWidth = __webpack_require__(6);

	var _virtWidth2 = _interopRequireDefault(_virtWidth);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var maxAcc = 0.1;
	var minAng = -1.5;
	var maxAng = 1.5;

	var launchers = {};

	var getLaunchers = function getLaunchers() {
		return Object.keys(launchers).map(function (k) {
			return launchers[k];
		});
	};

	var marbleRadius = 30;

	var Launcher = function () {
		function Launcher(_ref) {
			var x = _ref.x,
			    y = _ref.y,
			    fill = _ref.fill,
			    collidesWithMarble = _ref.collidesWithMarble;

			_classCallCheck(this, Launcher);

			this._x = x || _virtWidth2.default / 2;
			this._y = y || _virtWidth2.default - 50;
			this.ang = 0;
			this.fill = fill || "black";
			this.acc = 0;
			this.accDir = 0;
			this.marble = null;
			this.collidesWithMarble = collidesWithMarble;
			this.updated = true;
		}

		_createClass(Launcher, [{
			key: "setAng",
			value: function setAng(ang) {
				this.ang = ang;
				if (this.ang < minAng) {
					this.ang = minAng;
				}
				if (this.ang > maxAng) {
					this.ang = maxAng;
				}
			}
		}, {
			key: "accelerate",
			value: function accelerate() {
				var prevAng = this.ang;
				if (this.acc < maxAcc && this.acc > -maxAcc) {
					this.acc += 0.0005 * this.accDir;
				}
				this.ang += this.acc;
				if (this.ang < minAng) {
					this.ang = minAng;
				}
				if (this.ang > maxAng) {
					this.ang = maxAng;
				}

				if (this.ang !== prevAng) {
					getLaunchers().forEach(function (l) {
						l.updated = true;
						if (l.marble) {
							l.marble.updated = true;
						}
					});
				}
			}
		}, {
			key: "drawGuide",
			value: function drawGuide(ctx, scale, X, Y, ANG) {
				var x = X,
				    y = Y,
				    ang = ANG,
				    minX = X,
				    minY = Y,
				    maxX = X,
				    maxY = Y;
				ctx.beginPath();
				ctx.strokeStyle = "rgba(255, 128, 128, 0.2)";
				ctx.lineWidth = marbleRadius * 2 * scale;
				ctx.moveTo(x * scale, y * scale);

				while (y > 0) {
					x = x + Math.cos(ang);
					y = y + Math.sin(ang);
					minY = y - marbleRadius < minY ? y - marbleRadius : minY;
					maxY = y + marbleRadius > maxY ? y + marbleRadius : maxY;
					minX = x - marbleRadius < minX ? x - marbleRadius : minX;
					maxX = x + marbleRadius > maxX ? x + marbleRadius : maxX;
					if (x <= marbleRadius || x >= _virtWidth2.default - marbleRadius) {
						var xDeg = y >= _virtWidth2.default ? 0 : 90;
						var yDeg = ang / (Math.PI / 180);
						var zDeg = Math.PI + 2 * xDeg - yDeg;
						ang = zDeg * (Math.PI / 180);
						ctx.lineTo(x * scale, y * scale);
					}
				}
				ctx.lineTo(x * scale, y * scale);
				ctx.stroke();
				this.clearRect = [minX - 2, minY - 2, maxX - minX + 4, maxY - minY + 4];
			}
		}, {
			key: "draw",
			value: function draw(ctx, scale) {
				this.drawGuide(ctx, scale, this._x, this._y, this.ang - 90 * (Math.PI / 180));

				ctx.save();
				ctx.translate(this._x * scale, this._y * scale);
				ctx.rotate(this.ang);
				ctx.beginPath();
				ctx.lineWidth = 4;
				ctx.strokeStyle = this.fill;
				ctx.arc(0, 0, 32 * scale, 0, Math.PI, false);
				ctx.stroke();
				ctx.beginPath();
				ctx.fillStyle = this.fill;
				ctx.arc(0, 0, 32 * scale, 80 * (Math.PI / 180), 100 * (Math.PI / 180), false);
				ctx.lineTo(0, -50 * scale);
				ctx.fill();
				ctx.restore();

				this.updated = false;
				this.clearX = this._x;
				this.clearY = this._y;
			}
		}, {
			key: "clear",
			value: function clear(ctx, scale) {
				ctx.clearRect((this.clearX - 50) * scale, (this.clearY - 50) * scale, 100 * scale, 100 * scale);
				if (this.clearRect) {
					ctx.clearRect.apply(ctx, _toConsumableArray(this.clearRect.map(function (n) {
						return n * scale;
					})));
				}
			}
		}]);

		return Launcher;
	}();

	var putLauncher = function putLauncher(idx, launcher) {
		launchers[idx] = launchers[idx] || launcher;
	};

	var getLauncher = function getLauncher(idx, def) {
		var ifNotPresent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

		if (!launchers[idx]) {
			putLauncher(idx, def);
			ifNotPresent();
		}
		return launchers[idx];
	};

	var removeLauncherOtherThan = function removeLauncherOtherThan(indices) {
		Object.keys(launchers).filter(function (k) {
			return indices.indexOf(k) < 0;
		}).forEach(function (k) {
			launchers[k].marble = null;
			delete launchers[k];
		});
	};

	exports.default = Launcher;
	exports.getLaunchers = getLaunchers;
	exports.getLauncher = getLauncher;
	exports.removeLauncherOtherThan = removeLauncherOtherThan;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = 960;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _uuid = __webpack_require__(8);

	var _uuid2 = _interopRequireDefault(_uuid);

	var _colors = __webpack_require__(13);

	var _neighbours = __webpack_require__(14);

	var _virtWidth = __webpack_require__(6);

	var _virtWidth2 = _interopRequireDefault(_virtWidth);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var crack = new Audio("./crack.ogg");
	var crack2 = new Audio("./crack2.ogg");
	var cracks = [crack, crack2];
	var plock = new Audio("./plock.ogg");

	var Marble = function () {
		function Marble(_ref) {
			var x = _ref.x,
			    y = _ref.y,
			    snapped = _ref.snapped,
			    angle = _ref.angle,
			    color = _ref.color,
			    radius = _ref.radius,
			    detectFall = _ref.detectFall,
			    getNeighbours = _ref.getNeighbours,
			    collidesWithMarble = _ref.collidesWithMarble,
			    clearScreen = _ref.clearScreen,
			    addPoints = _ref.addPoints;

			_classCallCheck(this, Marble);

			this._id = (0, _uuid2.default)();
			this._x = x;
			this._y = y;
			this.acc = 16.0;
			this.ang = angle;
			this.radius = radius;
			this.color = color;
			this.collidesWithMarble = collidesWithMarble;
			this.getNeighbours = getNeighbours;
			this.detectFall = detectFall;
			this.updated = true;
			this.clearScreen = clearScreen;
			this.addPoints = addPoints;
			this.markedForRemoval = false;
			this.readyToBeRemoved = false;
			this.falling = false;
			this.snapped = snapped || false;
		}

		_createClass(Marble, [{
			key: "accelerate",
			value: function accelerate() {
				if (this.snapped) {
					return;
				}
				if (this.falling) {
					if (this._y > _virtWidth2.default - this.radius * 2) {
						this.markForRemoval(0);
						this._y = _virtWidth2.default + this.radius;
					} else {
						this.acc += 0.01;
					}
					this.updated = true;
				}

				this.updated = true;
				this._y += Math.sin(this.ang) * this.acc;
				this._x += Math.cos(this.ang) * this.acc;

				if (this._x + this.radius > _virtWidth2.default || this._x - this.radius < 0) {
					var xDeg = 90;
					var yDeg = this.ang / (Math.PI / 180);
					var zDeg = Math.PI + 2 * xDeg - yDeg;
					this._x = this._x + this.radius > _virtWidth2.default ? _virtWidth2.default - this.radius : this.radius;
					this.ang = zDeg * (Math.PI / 180);
				}

				if (this._y + this.radius > _virtWidth2.default) {
					var _xDeg = 0;
					var _yDeg = this.ang / (Math.PI / 180);
					var _zDeg = Math.PI + 2 * _xDeg - _yDeg;
					this._y = this._y + this.radius > _virtWidth2.default ? _virtWidth2.default - this.radius : this.radius;
					this.ang = _zDeg * (Math.PI / 180);
				}

				if (this._y - this.radius < 0) {
					this.snapToTop();
				}

				if (!this.falling) {
					var other = this.collidesWithMarble(this);
					if (other) {
						this.onCollision(other);
					}
				}
			}
		}, {
			key: "descend",
			value: function descend() {
				var deg = Math.round(this._x) % (this.radius * 2) === 0 ? 120 : 60;
				this._x = this._x + Math.cos(deg * Math.PI / 180) * (this.radius * 2);
				this._y = this._y + Math.sin(deg * Math.PI / 180) * (this.radius * 2);
				this.updated = true;
			}
		}, {
			key: "startFalling",
			value: function startFalling() {
				this.updated = true;
				this.falling = true;
				this.snapped = false;
				this.acc = 12;
				this.ang = 90 * (Math.PI / 180);
			}
		}, {
			key: "snapToTop",
			value: function snapToTop() {
				for (var i = 0; i < _virtWidth2.default; i += this.radius * 2) {
					if (i + this.radius * 2 >= this._x && i <= this._x) {
						this._x = i + this.radius;
						break;
					}
				}
				this._y = this.radius;

				this.finalizeSnap();
			}
		}, {
			key: "onCollision",
			value: function onCollision(otherMarble) {
				var _this = this;

				var opts = (0, _neighbours.getNeighbourCoordinates)(otherMarble).map(function (_ref2) {
					var x = _ref2.x,
					    y = _ref2.y;
					return {
						x: x,
						y: y,
						delta: Math.sqrt(Math.pow(_this._x - x, 2) + Math.pow(_this._y - y, 2))
					};
				}).sort(function (a, b) {
					return a.delta < b.delta ? -1 : 1;
				});
				this._x = opts[0].x;
				this._y = opts[0].y;
				this.finalizeSnap();
			}
		}, {
			key: "finalizeSnap",
			value: function finalizeSnap() {
				this.snapped = true;
				this.markNeighbours();
				this.clearScreen();
			}
		}, {
			key: "markNeighbours",
			value: function markNeighbours() {
				var _this2 = this;

				var nSameColor = this.getNeighbours(this, this.color);
				if (nSameColor.length > 2) {
					cracks[parseInt(Math.random() * cracks.length)].play();
					nSameColor.forEach(function (m) {
						m.markForRemoval();
					});
					this.addPoints(nSameColor.length * 5);
					setTimeout(function () {
						_this2.detectFall();
					}, 150);
				} else {
					plock.play();
				}
			}
		}, {
			key: "markForRemoval",
			value: function markForRemoval() {
				var _this3 = this;

				var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 150;

				this.markedForRemoval = true;
				this.color = _colors.colors.WHITE;
				this.updated = true;
				setTimeout(function () {
					_this3.readyToBeRemoved = true;
					setTimeout(_this3.clearScreen, 50);
				}, timeout);
			}
		}, {
			key: "draw",
			value: function draw(ctx, scale) {
				ctx.beginPath();
				ctx.fillStyle = _colors.fills[this.color];
				ctx.arc(this._x * scale, this._y * scale, this.radius * scale, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();

				ctx.beginPath();

				ctx.fillStyle = _colors.strokes[this.color];
				ctx.arc(this._x * scale, this._y * scale, this.radius * scale - 4, Math.PI, Math.PI * 1.5, false);
				ctx.fill();
				ctx.closePath();

				this.updated = false;
				this.clearX = this._x;
				this.clearY = this._y;
			}
		}, {
			key: "clear",
			value: function clear(ctx, scale) {
				ctx.clearRect(this.clearX * scale - this.radius * scale - 2, this.clearY * scale - this.radius * scale - 2, this.radius * scale * 2 + 4, this.radius * scale * 2 + 4);
			}
		}]);

		return Marble;
	}();

	exports.default = Marble;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var v1 = __webpack_require__(9);
	var v4 = __webpack_require__(12);

	var uuid = v4;
	uuid.v1 = v1;
	uuid.v4 = v4;

	module.exports = uuid;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var rng = __webpack_require__(10);
	var bytesToUuid = __webpack_require__(11);

	// **`v1()` - Generate time-based UUID**
	//
	// Inspired by https://github.com/LiosK/UUID.js
	// and http://docs.python.org/library/uuid.html

	// random #'s we need to init node and clockseq
	var _seedBytes = rng();

	// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	var _nodeId = [
	  _seedBytes[0] | 0x01,
	  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
	];

	// Per 4.2.2, randomize (14 bit) clockseq
	var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

	// Previous uuid creation time
	var _lastMSecs = 0, _lastNSecs = 0;

	// See https://github.com/broofa/node-uuid for API details
	function v1(options, buf, offset) {
	  var i = buf && offset || 0;
	  var b = buf || [];

	  options = options || {};

	  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

	  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

	  // Per 4.2.1.2, use count of uuid's generated during the current clock
	  // cycle to simulate higher resolution clock
	  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

	  // Time since last uuid creation (in msecs)
	  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

	  // Per 4.2.1.2, Bump clockseq on clock regression
	  if (dt < 0 && options.clockseq === undefined) {
	    clockseq = clockseq + 1 & 0x3fff;
	  }

	  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	  // time interval
	  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
	    nsecs = 0;
	  }

	  // Per 4.2.1.2 Throw error if too many uuids are requested
	  if (nsecs >= 10000) {
	    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	  }

	  _lastMSecs = msecs;
	  _lastNSecs = nsecs;
	  _clockseq = clockseq;

	  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	  msecs += 12219292800000;

	  // `time_low`
	  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	  b[i++] = tl >>> 24 & 0xff;
	  b[i++] = tl >>> 16 & 0xff;
	  b[i++] = tl >>> 8 & 0xff;
	  b[i++] = tl & 0xff;

	  // `time_mid`
	  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	  b[i++] = tmh >>> 8 & 0xff;
	  b[i++] = tmh & 0xff;

	  // `time_high_and_version`
	  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	  b[i++] = tmh >>> 16 & 0xff;

	  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	  b[i++] = clockseq >>> 8 | 0x80;

	  // `clock_seq_low`
	  b[i++] = clockseq & 0xff;

	  // `node`
	  var node = options.node || _nodeId;
	  for (var n = 0; n < 6; ++n) {
	    b[i + n] = node[n];
	  }

	  return buf ? buf : bytesToUuid(b);
	}

	module.exports = v1;


/***/ },
/* 10 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {// Unique ID creation requires a high quality random # generator.  In the
	// browser this is a little complicated due to unknown quality of Math.random()
	// and inconsistent support for the `crypto` API.  We do the best we can via
	// feature-detection
	var rng;

	var crypto = global.crypto || global.msCrypto; // for IE 11
	if (crypto && crypto.getRandomValues) {
	  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
	  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
	  rng = function whatwgRNG() {
	    crypto.getRandomValues(rnds8);
	    return rnds8;
	  };
	}

	if (!rng) {
	  // Math.random()-based (RNG)
	  //
	  // If all else fails, use Math.random().  It's fast, but is of unspecified
	  // quality.
	  var rnds = new Array(16);
	  rng = function() {
	    for (var i = 0, r; i < 16; i++) {
	      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	    }

	    return rnds;
	  };
	}

	module.exports = rng;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * Convert array of 16 byte values to UUID string format of the form:
	 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
	 */
	var byteToHex = [];
	for (var i = 0; i < 256; ++i) {
	  byteToHex[i] = (i + 0x100).toString(16).substr(1);
	}

	function bytesToUuid(buf, offset) {
	  var i = offset || 0;
	  var bth = byteToHex;
	  return bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]];
	}

	module.exports = bytesToUuid;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var rng = __webpack_require__(10);
	var bytesToUuid = __webpack_require__(11);

	function v4(options, buf, offset) {
	  var i = buf && offset || 0;

	  if (typeof(options) == 'string') {
	    buf = options == 'binary' ? new Array(16) : null;
	    options = null;
	  }
	  options = options || {};

	  var rnds = options.random || (options.rng || rng)();

	  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	  rnds[6] = (rnds[6] & 0x0f) | 0x40;
	  rnds[8] = (rnds[8] & 0x3f) | 0x80;

	  // Copy bytes to buffer, if provided
	  if (buf) {
	    for (var ii = 0; ii < 16; ++ii) {
	      buf[i + ii] = rnds[ii];
	    }
	  }

	  return buf || bytesToUuid(rnds);
	}

	module.exports = v4;


/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var colors = {
	  WHITE: 0,
	  YELLOW: 1,
	  GREEN: 2,
	  RED: 3
	};

	var fills = ["rgba(255, 255, 255, 0.85)", "rgba(255, 255, 50, 0.85)", "rgba(50, 255, 50, 0.85)", "rgba(255, 50, 50, 0.85)", "rgba(50, 255, 255, 0.85)", "rgba(255, 50, 255, 0.85)"];

	var strokes = ["rgba(196, 196, 196, 0.85)", "rgba(255, 255, 196, 0.4)", "rgba(196, 255, 196, 0.4)", "rgba(255, 196, 196, 0.4)", "rgba(196, 255, 255, 0.4)", "rgba(255, 196, 255, 0.4)"];

	exports.strokes = strokes;
	exports.fills = fills;
	exports.colors = colors;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getNeighbours = exports.getNeighbourCoordinates = undefined;

	var _virtWidth = __webpack_require__(6);

	var _virtWidth2 = _interopRequireDefault(_virtWidth);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var marbleRadius = 30;

	var getNeighbourCoordinates = function getNeighbourCoordinates(marble) {
	  return [0, 60, 120, 180, 240, 300].map(function (deg) {
	    return deg * (Math.PI / 180);
	  }).map(function (rad) {
	    return {
	      x: Math.round(marble._x + Math.cos(rad) * (marble.radius * 2)),
	      y: Math.round(marble._y + Math.sin(rad) * (marble.radius * 2))
	    };
	  });
	};

	var getNeighbours = function getNeighbours(getMarbles, addPoints) {

	  var isLocatedAround = function isLocatedAround(m, nC) {
	    return m._x > nC.x - m.radius && m._x < nC.x + m.radius && m._y > nC.y - m.radius && m._y < nC.y + m.radius;
	  };

	  var _markNeighbours = function _markNeighbours(root) {
	    var colorFilter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	    var altList = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	    var stack = [root];

	    var _loop = function _loop() {
	      var marble = stack.pop();
	      marble.marked = true;
	      var neighbourCoords = getNeighbourCoordinates(marble);
	      stack = stack.concat((altList || getMarbles()).filter(function (m) {
	        return !m.marked;
	      }).filter(function (m) {
	        return colorFilter === null ? true : m.color === colorFilter;
	      }).filter(function (m) {
	        return neighbourCoords.map(function (nC) {
	          return isLocatedAround(m, nC);
	        }).indexOf(true) > -1;
	      }));
	    };

	    while (stack.length > 0) {
	      _loop();
	    }
	  };

	  var markNeighbours = function markNeighbours(marble) {
	    var colorFilter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	    var altList = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	    _markNeighbours(marble, colorFilter, altList);
	    var marked = (altList || getMarbles()).filter(function (m) {
	      return m.marked;
	    });
	    marked.forEach(function (m) {
	      return m.marked = false;
	    });
	    return marked;
	  };

	  var detectFall = function detectFall() {
	    var snappedToTop = [];

	    var snappedFound = getMarbles().filter(function (m) {
	      return m.snapped && !(m.markedForRemoval || m.readyToBeRemoved);
	    });

	    var _loop2 = function _loop2(i) {
	      snappedToTop = snappedToTop.concat(snappedFound.filter(function (m) {
	        return isLocatedAround(m, {
	          x: i + marbleRadius,
	          y: marbleRadius
	        });
	      }));
	    };

	    for (var i = 0; i < _virtWidth2.default; i += marbleRadius * 2) {
	      _loop2(i);
	    }

	    for (var i = 0; i < snappedToTop.length; i++) {
	      if (!snappedToTop[i].marked) {
	        _markNeighbours(snappedToTop[i], null, snappedFound);
	      }
	    }

	    var neighboursOfTop = snappedFound.filter(function (m) {
	      return m.marked;
	    });
	    neighboursOfTop.forEach(function (m) {
	      m.marked = false;
	    });
	    var neighboursOfTopIds = neighboursOfTop.map(function (m) {
	      return m._id;
	    });

	    snappedFound.filter(function (m) {
	      return neighboursOfTopIds.indexOf(m._id) < 0;
	    }).forEach(function (m) {
	      m.startFalling();
	      addPoints(20);
	    });
	  };

	  return {
	    getNeighbours: markNeighbours,
	    detectFall: detectFall
	  };
	};

	exports.getNeighbourCoordinates = getNeighbourCoordinates;
	exports.getNeighbours = getNeighbours;

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (getMarbles) {
		return {
			marbleCollidesWithMarble: function marbleCollidesWithMarble(marble) {
				var found = getMarbles().filter(function (m) {
					return m._id !== marble._id && m.snapped;
				}).map(function (m) {
					return {
						distance: Math.sqrt(Math.pow(m._x - marble._x, 2) + Math.pow(m._y - marble._y, 2)),
						m: m
					};
				}).filter(function (obj) {
					return obj.distance < marble.radius + obj.m.radius;
				}).sort(function (a, b) {
					return a.distance < b.distance ? 1 : -1;
				});
				if (found.length > 0) {
					return found[0].m;
				}
				return null;
			}
		};
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var marbles = [];

	var addMarble = function addMarble() {
		var toAdd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

		marbles = marbles.concat(toAdd);
		return marbles.length - 1;
	};

	var clearMarbles = function clearMarbles() {
		return marbles = [];
	};

	var removeReadyMarbles = function removeReadyMarbles() {
		return marbles = marbles.filter(function (m) {
			return !m.readyToBeRemoved;
		});
	};

	var getMarbles = function getMarbles() {
		return marbles;
	};

	exports.addMarble = addMarble;
	exports.clearMarbles = clearMarbles;
	exports.getMarbles = getMarbles;
	exports.removeReadyMarbles = removeReadyMarbles;

/***/ },
/* 17 */
/***/ function(module, exports) {

	/*
	const padEvents = initPadEvents();
	console.log(padEvents);

	Object.keys(padEvents).forEach((cur) => {
	  window.addEventListener(`gamepad-${cur}-pressed`, (ev) => {
	    console.log(`Controller ${ev.detail.controllerIndex} pressed: ${cur}`)
	    console.log(JSON.stringify(controllers[0].buttons.map(b => b.pressed)))
	  });
	  window.addEventListener(`gamepad-${cur}-released`, (ev) =>
	    console.log(`Controller ${ev.detail.controllerIndex} released: ${cur}`));
	});
	*/
	const initPadEvents = ({
	    onUnmappedButton, onControllersChange
	  },
	  axisMappings = {
	    "0": ["l-axis", 0],
	    "1": ["l-axis", 1],
	    "2": ["r-axis", 0],
	    "3": ["r-axis", 1]
	  },
	  defaultMappings = {
	    "0": "x",
	    "1": "a",
	    "2": "b",
	    "3": "y",
	    "9": "start",
	    "8": "select",
	    "5": "rt-shoulder",
	    "7": "rb-shoulder",
	    "4": "lt-shoulder",
	    "6": "lb-shoulder",
	    "10": "l-axis",
	    "11": "r-axis",
	    "12": "up",
	    "13": "down",
	    "14": "left",
	    "15": "right"}) => {

	  const padEvents = [
	    "a", "b", "x", "y",
	    "start", "select", "up", "down", "left", "right",
	    "rt-shoulder", "rb-shoulder",
	    "lt-shoulder", "lb-shoulder",
	    "l-axis", "r-axis"
	  ].reduce((acc, cur) => {
	      acc[cur] = {
	        pressed: `gamepad-${cur}-pressed`,
	        released: `gamepad-${cur}-released`
	      };
	      return acc;
	  }, {});
	  let controllers = {};
	  let keymaps = {};
	  let buttonstates = {};
	  let axisStates = {};
	  let axisCalibrations = {};

	  const initButtonStates = (keymap) =>
	    Object.keys(keymap).reduce((acc, cur) => {
	      acc[keymap[cur]] = false;
	      return acc;
	    }, {});

	  const roundOffAxisValue = (axis) =>
	    Math.round(axis * 100);

	  const calibrateAxisValue = (axis, calib) => {
	    if (axis === 1.0) { return 100; }
	    if (axis === -1.0) { return -100; }
	    const rounded = roundOffAxisValue(axis) - calib;
	    if (rounded < 20 && rounded > -20) { return 0; }
	    return rounded < 0 ? -50 : 50;
	  }

	  const registerController = (ev) => {
	    controllers[ev.gamepad.index] = ev.gamepad;
	    keymaps[ev.gamepad.index] = Object.assign({}, defaultMappings);
	    buttonstates[ev.gamepad.index] = initButtonStates(keymaps[ev.gamepad.index]);
	    axisStates[ev.gamepad.index] = ev.gamepad.axes.map(axis => roundOffAxisValue(axis));
	    axisCalibrations[ev.gamepad.index] = [];
	    if (onControllersChange) {
	      onControllersChange(Object.keys(controllers));
	    }
	  }

	  const removeController = ({gamepad}) => {
	    delete controllers[gamepad.index];
	    delete keymaps[gamepad.index];
	    delete buttonstates[gamepad.index];
	    delete axisStates[gamepad.index];
	    delete axisCalibrations[gamepad.index];
	    if (onControllersChange) {
	      onControllersChange(Object.keys(controllers));
	    }
	  }

	  function dispatchPadEvents() {
	    for (let idx in controllers) {
	      const controller = controllers[idx];
	      if (axisCalibrations[idx].length === 0) {
	        axisCalibrations[idx] = controller.axes.map(axis => roundOffAxisValue(axis))
	        axisStates[idx] = controller.axes.map((axis, j) =>
	          calibrateAxisValue(axis,  axisCalibrations[idx][j]));
	      }

	      for (let i in controller.axes) {
	        const current = calibrateAxisValue(controller.axes[i],  axisCalibrations[idx][i]);
	        if (current !== axisStates[idx][i]) {
	          const [axName, dir] = axisMappings[i];
	          if (dir === 0) {
	            window.dispatchEvent(new CustomEvent(
	              `gamepad-${axName}-x-change`, { detail: {
	                  controllerIndex: idx,
	                  force: current,
	                  measured: controller.axes[i],
	                  rounded: roundOffAxisValue(controller.axes[i])
	                }
	              })
	            );
	          } else {
	            window.dispatchEvent(new CustomEvent(
	              `gamepad-${axName}-y-change`,
	              {detail: {controllerIndex: idx, force: Math.abs(current), measured: controller.axes[i]}}
	            ));
	          }
	          axisStates[idx][i] = current;

	        }
	      }

	      for (let i in controller.buttons) {
	        const { pressed } = controller.buttons[i];
	        const buttonMapping = keymaps[idx][i];

	        if (buttonMapping && buttonstates[idx][buttonMapping] !== pressed) {
	          buttonstates[idx][buttonMapping] = pressed;
	          window.dispatchEvent(new CustomEvent(
	            padEvents[buttonMapping][pressed ? "pressed" : "released"],
	            {detail: {controllerIndex: idx}}
	          ));
	        }

	        if (onUnmappedButton && pressed && !buttonMapping) {
	          onUnmappedButton(i);
	        }
	      }
	    }
	    requestAnimationFrame(dispatchPadEvents);
	  }

	  dispatchPadEvents();

	  function scangamepads() {
	    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
	    for (var i = 0; i < gamepads.length; i++) {
	      if (gamepads[i]) {
	        if (!(gamepads[i].index in controllers)) {
	          registerController({gamepad: gamepads[i]});
	        }
	      }
	    }
	  }
	  const haveEvents = 'ongamepadconnected' in window;
	  if (!haveEvents) {
	    setInterval(scangamepads, 50);
	  }

	  window.addEventListener("gamepadconnected", registerController);
	  window.addEventListener("gamepaddisconnected", removeController);
	  return Object.keys(padEvents)
	  .map(x => [`gamepad-${x}-pressed`, `gamepad-${x}-released`])
	  .reduce((a,b) => a.concat(b))
	  .concat([
	    "gamepad-l-axis-x-change", "gamepad-l-axis-y-change",
	    "gamepad-r-axis-x-change", "gamepad-r-axis-y-change"
	  ]);
	}

	module.exports = { initPadEvents: initPadEvents }


/***/ }
/******/ ])
});
;