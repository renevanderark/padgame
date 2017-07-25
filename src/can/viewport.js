export default (listeners) => {
	function onResize() {
		listeners.forEach(function (listener) {
			listener(window.innerWidth - 20, window.innerHeight - 20);
		});
	}

	onResize();
	window.addEventListener("resize", onResize);
}
