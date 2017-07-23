import uuid from "uuid";

class Marble {

	constructor({ x, y, angle, fill, stroke, radius, collidesWithBar, collidesWithMarble }) {
		this._id = uuid();
		this._x = x;
		this._y = y;
		this.acc = 12.0;
		this.ang = angle;
		this.radius = radius;
		this.fill = fill || "red";
		this.stroke = stroke || "red";
		this.collidesWithMarble = collidesWithMarble;
	}

	accelerate() {
		this._y += Math.sin(this.ang) * this.acc;
		this._x += Math.cos(this.ang) * this.acc;

		if (this._x + this.radius > 1000 || this._x - this.radius < 0) {
			const xDeg = 90;
			const yDeg = this.ang / (Math.PI / 180);
			const zDeg = Math.PI + (2*xDeg) - yDeg;
			this._x = this._x + this.radius > 1000 ? 1000 - this.radius : this.radius;
			this.ang = zDeg * (Math.PI / 180);
		}

		if (this._y + this.radius > 1000 || this._y - this.radius  < 0) {
			const xDeg = 0;
			const yDeg = this.ang / (Math.PI / 180);
			const zDeg = Math.PI + (2*xDeg) - yDeg;
			this._y = this._y + this.radius > 1000 ? 1000 - this.radius : this.radius;
			this.ang = zDeg * (Math.PI / 180);
		}

		this.collidesWithMarble(this, this.onCollision);
	}

	onCollision(otherMarble, distance) {
		//console.log(otherMarble);
	}


	draw(ctx, scale) {
		ctx.beginPath();
		ctx.fillStyle = this.fill;
		ctx.lineWidth = 2;
		ctx.strokeStyle = this.stroke;
		ctx.arc(
			this._x * scale, this._y * scale,
			this.radius * scale,  0, 2 * Math.PI, false
		)
		ctx.stroke();
		ctx.fill();
	};
}

export default Marble;
