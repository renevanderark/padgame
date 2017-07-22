export default (canvases, ...listeners) => {
	function rescaleGame(width, height) {
		canvases.forEach(canvas => {
			canvas.width = width;
			canvas.height = height;
		});
	}

	return [rescaleGame].concat(listeners);
};