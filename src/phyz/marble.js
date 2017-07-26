import uuid from "uuid";
import { fills, strokes, colors } from "./colors";
import { getNeighbourCoordinates } from "./neighbours";
import VIRT_WIDTH from "./virt-width";

class Marble {

	constructor({ x, y, snapped, angle, color, radius, detectFall,
		getNeighbours, collidesWithMarble, clearScreen, addPoints }) {
		this._id = uuid();
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

	accelerate() {
		if (this.snapped) { return; }
		if (this.falling) {
			if (this._y > VIRT_WIDTH - this.radius * 2) {
				this.markForRemoval(0);
				this._y = VIRT_WIDTH + this.radius;
			} else {
				this.acc += 0.01;
			}
			this.updated = true;
		}

		this.updated = true;
		this._y += Math.sin(this.ang) * this.acc;
		this._x += Math.cos(this.ang) * this.acc;

		if (this._x + this.radius > VIRT_WIDTH || this._x - this.radius < 0) {
			const xDeg = 90;
			const yDeg = this.ang / (Math.PI / 180);
			const zDeg = Math.PI + (2*xDeg) - yDeg;
			this._x = this._x + this.radius > VIRT_WIDTH ? VIRT_WIDTH - this.radius : this.radius;
			this.ang = zDeg * (Math.PI / 180);
		}

		if (this._y + this.radius > VIRT_WIDTH) {
			const xDeg = 0;
			const yDeg = this.ang / (Math.PI / 180);
			const zDeg = Math.PI + (2*xDeg) - yDeg;
			this._y = this._y + this.radius > VIRT_WIDTH ? VIRT_WIDTH - this.radius : this.radius;
			this.ang = zDeg * (Math.PI / 180);
		}

		if (this._y - this.radius  < 0) {
			this.snapToTop();
		}

		if (!this.falling) {
			const other = this.collidesWithMarble(this);
			if (other) {
				this.onCollision(other);
			}
		}
	}

	descend() {
		const deg = Math.round(this._x) % (this.radius * 2) === 0 ?
			120 : 60;
		this._x =
			this._x + Math.cos(deg * Math.PI / 180) * (this.radius * 2);
		this._y =
			this._y + Math.sin(deg * Math.PI / 180) * (this.radius * 2);
		this.updated = true;
	}

	startFalling() {
		this.updated = true;
		this.falling = true;
		this.snapped = false;
		this.acc = 12;
		this.ang = 90 * (Math.PI / 180);
	}

	snapToTop() {
		for (let i = 0; i < VIRT_WIDTH; i += this.radius * 2) {
			if (i + this.radius * 2 >= this._x &&
				i <= this._x) {
				this._x = i + this.radius;
				break;
			}
		}
		this._y = this.radius;

		this.finalizeSnap();
	}

	onCollision(otherMarble) {
		const opts = getNeighbourCoordinates(otherMarble)
			.map(({x, y}) => ({
				x: x,
				y: y,
				delta: Math.sqrt(
					Math.pow(this._x - x, 2) +
					Math.pow(this._y - y, 2)
				)
			}))
			.sort((a, b) => a.delta < b.delta ? -1 : 1);
		this._x = opts[0].x;
		this._y = opts[0].y;
		this.finalizeSnap();
	}

	finalizeSnap() {
		this.snapped = true;
		this.markNeighbours();
		this.clearScreen();
	}

	markNeighbours() {
		const nSameColor = this.getNeighbours(this, this.color);
		if (nSameColor.length > 2) {
			nSameColor.forEach(m => {
				m.markForRemoval()
			});
			this.addPoints(nSameColor.length * 5)
			setTimeout(() => {
				this.detectFall();
			}, 150);
		}
	}

	markForRemoval(timeout = 150) {
		this.markedForRemoval = true;
		this.color = colors.WHITE;
		this.updated = true;
		setTimeout(() => {
			this.readyToBeRemoved = true;
			setTimeout(this.clearScreen, 50);
		}, timeout);
	}

	draw(ctx, scale) {
		ctx.beginPath();
		ctx.fillStyle = fills[this.color];
		ctx.arc(
			this._x * scale, this._y * scale,
			this.radius * scale,  0, 2 * Math.PI, false
		)
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();

		ctx.fillStyle = strokes[this.color];
		ctx.arc(
			this._x * scale, this._y * scale,
			(this.radius * scale) - 4,  Math.PI,  Math.PI * 1.5, false
		);
		ctx.fill();
		ctx.closePath();

		this.updated = false;
		this.clearX = this._x;
		this.clearY = this._y;
	}

	clear(ctx, scale) {
		ctx.clearRect(
			this.clearX * scale - this.radius * scale - 2,
			this.clearY * scale - this.radius * scale - 2,
			this.radius * scale * 2 + 4,
			this.radius * scale * 2 + 4,
		);
	}
}

export default Marble;
