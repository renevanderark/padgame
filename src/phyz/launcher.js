import VIRT_WIDTH from "./virt-width";

const maxAcc = 0.1;
const minAng = -1.5;
const maxAng = 1.5;

let launchers = {};

const getLaunchers = () =>
	Object.keys(launchers).map(k => launchers[k]);

const marbleRadius = 30;
class Launcher {

	constructor({ x, y, fill, collidesWithMarble }) {
		this._x = x || VIRT_WIDTH / 2;
		this._y = y || VIRT_WIDTH - 50;
		this.ang = 0;
		this.fill = fill || "black";
		this.acc = 0;
		this.accDir = 0;
		this.marble = null;
		this.collidesWithMarble = collidesWithMarble;
		this.updated = true;
	}

	setAng(ang) {
		this.ang = ang;
		if (this.ang < minAng) {
			this.ang = minAng;
		}
		if (this.ang > maxAng) {
			this.ang = maxAng;
		}

	}
	accelerate() {
		const prevAng = this.ang;
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
			getLaunchers().forEach(l => {
				l.updated = true
				if (l.marble) {
					l.marble.updated = true;
				}
			})
		}
	}

	drawGuide(ctx, scale, X, Y, ANG) {
		let x = X, y = Y, ang = ANG,
			minX = X, minY = Y, maxX = X, maxY = Y;
		ctx.beginPath();
		ctx.strokeStyle = "rgba(255, 128, 128, 0.4)";
		ctx.lineWidth = marbleRadius * 2 * scale;
		ctx.moveTo(x * scale, y * scale);

		while (y > 0) {
			x = x + Math.cos(ang);
			y = y + Math.sin(ang);
			minY = y - marbleRadius < minY ? y - marbleRadius: minY ;
			maxY = y + marbleRadius > maxY ? y + marbleRadius : maxY;
			minX = x - marbleRadius < minX ? x - marbleRadius : minX;
			maxX = x + marbleRadius > maxX ? x + marbleRadius : maxX;
			if (x <= marbleRadius || x >= VIRT_WIDTH - marbleRadius) {
				const xDeg = y >= VIRT_WIDTH ? 0 : 90;
				const yDeg = ang / (Math.PI / 180);
				const zDeg = Math.PI + (2*xDeg) - yDeg;
				ang = zDeg * (Math.PI / 180);
				ctx.lineTo(x * scale, y * scale);
			}
		}
		ctx.lineTo(x * scale, y * scale);
		ctx.stroke();
		this.clearRect = [minX - 2, minY - 2,
			 maxX - minX + 4, maxY - minY + 4];
	}

	draw(ctx, scale) {
		this.drawGuide(ctx, scale, this._x, this._y,
			this.ang - (90 * (Math.PI / 180)));

		ctx.save();
		ctx.translate(this._x * scale, this._y * scale);
		ctx.rotate(this.ang);
		ctx.beginPath();
		ctx.lineWidth = 4;
		ctx.strokeStyle = this.fill;
		ctx.arc(
			0, 0,
			32 * scale,  0, Math.PI, false
		)
		ctx.stroke();
		ctx.beginPath();
		ctx.fillStyle = this.fill;
		ctx.arc(0, 0, 32 * scale,
			80 * (Math.PI / 180), 100 * (Math.PI / 180), false);
		ctx.lineTo(0, -50 * scale);
		ctx.fill();
		ctx.restore();


		this.updated = false;
		this.clearX = this._x;
		this.clearY = this._y;
	};

	clear(ctx, scale) {
		ctx.clearRect(
			(this.clearX - 50) * scale,
			(this.clearY - 50) * scale,
			100 * scale, 100 * scale
		);
		if (this.clearRect) {
			ctx.clearRect(...(this.clearRect.map(n => n * scale)));
		}
	}
}


const putLauncher = (idx, launcher) => {
	launchers[idx] = launchers[idx] || launcher;
}

const getLauncher = (idx, def, ifNotPresent = () => {}) => {
	if (!launchers[idx]) {
		putLauncher(idx, def);
		ifNotPresent();
	}
	return launchers[idx];
}

const removeLauncherOtherThan = (indices) => {
	Object.keys(launchers)
		.filter(k => indices.indexOf(k) < 0)
		.forEach(k => {
			launchers[k].marble = null;
			delete launchers[k];
		})
}

export default Launcher;
export { getLaunchers, getLauncher, removeLauncherOtherThan }
