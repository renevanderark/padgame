import VIRT_WIDTH from "./virt-width";

const maxAcc = 0.1;
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

	accelerate() {
		if (this.acc < maxAcc && this.acc > -maxAcc) {
			this.acc += 0.0005 * this.accDir;
		}
		this.ang += this.acc;
		this.updated = true;
		if (this.marble) {
			this.marble.updated = true;
		}
	}

	draw(ctx, scale) {
		ctx.beginPath();
		ctx.strokeStyle = "rgba(255, 128, 128, 0.9)";
		ctx.moveTo(this._x * scale, this._y * scale);
		ctx.lineTo((this._x * scale) + Math.cos(this.ang - (90 * (Math.PI / 180))) * VIRT_WIDTH,
			(this._y * scale) + Math.sin(this.ang - (90 * (Math.PI / 180))) * VIRT_WIDTH)
		ctx.stroke();

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
			0, 0, VIRT_WIDTH * scale, VIRT_WIDTH * scale
		);
	}
}

let launchers = {};

const getLaunchers = () =>
	Object.keys(launchers).map(k => launchers[k]);

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
