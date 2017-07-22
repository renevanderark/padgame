let bars = [];

const addBar = (toAdd = []) => {
	bars = bars.concat(toAdd);
	return bars.length - 1;
};

const clearBars = () =>
	bars = [];


const getBars = () => bars;

export { addBar, clearBars, getBars }