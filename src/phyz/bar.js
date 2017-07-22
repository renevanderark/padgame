class Bar { 

	constructor(x, y, radius, rotation, thickness) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.rotation = rotation;
		this.thickness = thickness;
		this.setRotation(rotation);
	}
	
	setRotation(rot) {
		this.ang = rot * (Math.PI / 180);
		this.ly = parseInt(Math.ceil(this.y - Math.sin(this.ang) * this.radius), 10);
		this.lx = parseInt(Math.ceil(this.x - Math.cos(this.ang) * this.radius), 10);
		this.rx = parseInt(Math.ceil(this.x + Math.cos(this.ang) * this.radius), 10);
		this.ry = parseInt(Math.ceil(this.y + Math.sin(this.ang) * this.radius), 10);
	}

	draw(ctx, scale) {
		ctx.beginPath();
		ctx.lineWidth = this.thickness * scale;
		ctx.strokeStyle = "rgb(128,128,0)";
		ctx.moveTo(this.lx * scale, this.ly * scale);
		ctx.lineTo(this.rx * scale, this.ry * scale);
		ctx.stroke();
	}

	getLineVector() {
		return [this.lx, this.ly, this.rx, this.ry];
	}
	
	getAngle() {
		return this.ang;
	}	
}

export default Bar;