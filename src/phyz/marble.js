import uuid from "uuid";
import { fills, strokes, colors } from "./colors";
import { getNeighbourCoordinates } from "./neighbours";
import VIRT_WIDTH from "./virt-width";

class Marble {

	constructor({ x, y, angle, color, radius,
		getNeighbours, collidesWithMarble, clearScreen }) {
		this._id = uuid();
		this._x = x;
		this._y = y;
		this.acc = 16.0;
		this.ang = angle;
		this.radius = radius;
		this.color = color;
		this.collidesWithMarble = collidesWithMarble;
		this.getNeighbours = getNeighbours;
		this.updated = true;
		this.clearScreen = clearScreen;
	}

	accelerate() {
		if (this.snapped) { return; }
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

		const other = this.collidesWithMarble(this);
		if (other) {
			this.onCollision(other);
		}
	}

	finalizeSnap() {
		this.snapped = true;
		this.markNeighbours();
		this.clearScreen();
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

	markNeighbours() {
		const nSameColor = this.getNeighbours(this, this.color);
		if (nSameColor.length > 2) {
			nSameColor.forEach(m => {
				m.markForRemoval()
			})
		}
	}

	markForRemoval() {
		this.color = colors.WHITE;
		this.updated = true;
		setTimeout(() => {
			this.readyToBeRemoved = true;
			setTimeout(this.clearScreen, 50);
		}, 100);
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
