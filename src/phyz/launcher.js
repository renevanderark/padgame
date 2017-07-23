class Launcher {

	constructor({ x, y, angle, fill }) {
		this._x = x || 500;
		this._y = y || 950;
		this.ang = angle || 45 * (Math.PI / 180);
		this.fill = fill || "red";
		this.acc = 0;
	}

	accelerate() {

		this.ang += this.acc;

	}

	draw(ctx, scale) {
		ctx.save();
		ctx.translate(this._x * scale, this._y * scale);
		ctx.rotate(this.ang);
		ctx.beginPath();
		ctx.lineWidth = 4;
		ctx.strokeStyle = this.fill;
		ctx.arc(
			0, 0,
			25 * scale,  0, Math.PI, false
		)
		ctx.stroke();
		ctx.beginPath();
		ctx.fillStyle = this.fill;
		ctx.arc(0, 0, 25 * scale,
			80 * (Math.PI / 180), 100 * (Math.PI / 180), false);
		ctx.lineTo(0, -50 * scale);
		ctx.fill();
		ctx.restore();
	};
}

let launchers = {};

const getLaunchers = () =>
	Object.keys(launchers).map(k => launchers[k]);

const getLauncher = (idx, def) => {
	if (!launchers[idx]) {
		putLauncher(idx, def);
	}
	return launchers[idx];
}

const putLauncher = (idx, launcher) => {
	launchers[idx] = launchers[idx] || launcher;
}

export default Launcher;
export { getLaunchers, putLauncher, getLauncher }
