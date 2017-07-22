let marbles = [];

const addMarble = (toAdd = []) => {
	marbles = marbles.concat(toAdd);
	return marbles.length - 1;
};

const clearMarbles = () =>
	marbles = [];


const getMarbles = () => marbles;

export { addMarble, clearMarbles, getMarbles }