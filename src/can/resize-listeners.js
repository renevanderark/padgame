export default (canvases, ...listeners) => {
	function rescaleGame(width, height) {
		canvases.forEach(canvas => {
			canvas.width = width > height ? height : width;
			canvas.height = width > height ? height : width;
		});
	}

	return [rescaleGame].concat(listeners);
};
