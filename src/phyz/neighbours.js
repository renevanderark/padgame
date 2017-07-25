import VIRT_WIDTH from "./virt-width";
const marbleRadius = 30;

const getNeighbourCoordinates = (marble) =>
  [0, 60, 120, 180, 240, 300]
    .map(deg => deg * (Math.PI / 180))
    .map(rad => ({
      x: Math.round(marble._x + Math.cos(rad) * (marble.radius * 2)),
      y: Math.round(marble._y + Math.sin(rad) * (marble.radius * 2))
    }));

const getNeighbours = (getMarbles) => {

  const isLocatedAround = (m, nC) =>
    m._x > nC.x - m.radius &&
    m._x < nC.x + m.radius &&
    m._y > nC.y - m.radius &&
    m._y < nC.y + m.radius;

  const _markNeighbours = (root, colorFilter = null, altList = null) => {
    let stack = [root];

    while (stack.length > 0) {
      const marble = stack.pop();
      marble.marked = true;
      const neighbourCoords = getNeighbourCoordinates(marble);
      stack = stack.concat(
        (altList || getMarbles())
        .filter(m => !m.marked)
        .filter(m => colorFilter === null ? true : m.color === colorFilter)
        .filter(m => neighbourCoords
          .map(nC => isLocatedAround(m, nC))
            .indexOf(true) > -1
        )
      );
    }
  };

  const markNeighbours = (marble, colorFilter = null, altList = null) => {
    _markNeighbours(marble, colorFilter, altList);
    const marked = (altList || getMarbles()).filter(m => m.marked);
    marked.forEach(m => m.marked = false);
    return marked;
  }

  const detectFall = () => {
    let snappedToTop = [];

    const snappedFound = getMarbles().filter(m =>
      m.snapped && !(m.markedForRemoval || m.readyToBeRemoved));

    for (let i = 0; i < VIRT_WIDTH; i += marbleRadius * 2) {
      snappedToTop = snappedToTop.concat(
        snappedFound.filter(m =>
          isLocatedAround(m, {
            x: i + marbleRadius,
            y: marbleRadius
          }))
      );
    }

    for (let i = 0; i < snappedToTop.length; i++) {
      if (!snappedToTop[i].marked) {
        _markNeighbours(snappedToTop[i], null, snappedFound);
      }
    }

    const neighboursOfTop = snappedFound.filter(m => m.marked);
    neighboursOfTop.forEach(m => {m.marked = false});
    const neighboursOfTopIds = neighboursOfTop.map(m => m._id);

    snappedFound.filter(m =>
      neighboursOfTopIds.indexOf(m._id) < 0
    ).forEach(m => m.startFalling());

  }

  return {
    getNeighbours: markNeighbours,
    detectFall: detectFall
  };
}

export { getNeighbourCoordinates, getNeighbours }
