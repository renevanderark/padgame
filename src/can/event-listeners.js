export default (vWidth) => {
	let width, height, scale;
	let registered = [];

	return {
		onResize: (w, h) => {
			width = w;
			height = h;
			scale = w < h ? w / vWidth : h / vWidth;
		},
		add: (eventName, onEvent, elem = window) => {
			const fn = ev => onEvent(eventName, ev, scale);

			registered.push({
				elem: elem,
				eventName:
				eventName,
				fn: fn
			});

			elem.addEventListener(eventName, fn);
		},
		clear: () => {
			registered.forEach(({elem, eventName, fn}) =>
				elem.removeEventListener(eventName, fn)
			)
		}
	}

};
