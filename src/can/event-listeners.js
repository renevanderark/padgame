export default (vWidth) => {
	let width, height, scale;
	let registered = [];

	return {
		onResize: (w, h) => {
			width = w;
			height = h;
			scale = w < h ? w / vWidth : (w / 2) / vWidth;
		},
		add: (eventName, onEvent) => {
			const fn = ev => onEvent(eventName, ev, scale);
			
			registered.push({eventName: eventName, fn: fn});
			window.addEventListener(eventName, fn);
		},
		clear: () => {
			registered.forEach(({eventName, fn}) =>
				window.removeEventListener(eventName, fn)
			)
		}
	}

};