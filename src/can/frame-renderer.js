export default (ctx, vWidth) => {
	let width, height, scale;

	return {
		onResize: (w, h) => {
			width = w;
			height = h;
			scale = w < h ? w / vWidth : h / vWidth;
		},
		render: (drawables) => {
			ctx.clearRect(0, 0, width, height);
			for (var i = 0; i < drawables.length; i++) {
				drawables[i].draw(ctx, scale);
			}
		},
		drawText: (txt, {x = 50, y = 50, timeout = null, fill = null, font = null, shade = false, shadeDistance = null}) => {
			const _x = parseInt(Math.ceil(x * scale), 10);
			const _y = parseInt(Math.ceil(y * scale), 10)
			ctx.font = font || "bold 12px sans-serif";
			if (shade) {
				ctx.fillStyle = shade;
				ctx.fillText(txt, _x + (shadeDistance || 2), _y + (shadeDistance || 2));
			}
			ctx.fillStyle = fill || "#a00";
			ctx.fillText(txt, _x, _y);
			const width = ctx.measureText(txt).width;
			const doClear = () => ctx.clearRect(_x, _y - 27, width + 5, 32);
			if (timeout) {
				setTimeout(doClear, timeout || 500);
			}
			return doClear;
		}
	}
}
