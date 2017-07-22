export default (listeners) => {
	function onResize() {
		listeners.forEach(function (listener) { 
			listener(window.innerWidth, window.innerHeight);
		});
	}
	
	onResize();
	window.addEventListener("resize", onResize);
}