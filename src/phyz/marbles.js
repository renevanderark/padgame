let marbles = [];

const addMarble = (toAdd = []) => {
	marbles = marbles.concat(toAdd);
	return marbles.length - 1;
};

const clearMarbles = () =>
	marbles = [];

const removeReadyMarbles = () =>
	marbles = marbles.filter(m => !m.readyToBeRemoved)

const getMarbles = () => marbles;

export { addMarble, clearMarbles, getMarbles, removeReadyMarbles }
