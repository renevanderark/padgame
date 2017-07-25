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

  const _markNeighbours = (marble, colorFilter = null) => {
    marble.marked = true;

    const neighbourCoords = getNeighbourCoordinates(marble);
    getMarbles()
      .filter(m => neighbourCoords
        .map(nC => isLocatedAround(m, nC))
          .indexOf(true) > -1
      )
      .filter(m => !m.marked)
      .filter(m => colorFilter === null ? true : m.color === colorFilter)
      .forEach(m => _markNeighbours(m, colorFilter));
  };

  const markNeighbours = (marble, colorFilter = null) => {
    _markNeighbours(marble, colorFilter);
    const marked = getMarbles().filter(m => m.marked);
    marked.forEach(m => m.marked = false);
    return marked;
  }

  const detectFall = () => {
    let snappedToTop = [];
    for (let i = 0; i < VIRT_WIDTH; i += marbleRadius * 2) {
      snappedToTop = snappedToTop.concat(
        getMarbles().filter(m =>
          m.snapped && !m.markedForRemoval && !m.readyToBeRemoved &&
          isLocatedAround(m, {
            x: i + marbleRadius,
            y: marbleRadius
          }))
      );
    }
    const neighboursOfTop = snappedToTop
      .map(marble => markNeighbours(marble))
      .reduce((a, b) => a.concat(b), [])
      .map(m => m._id);

    getMarbles().filter(m =>
      m.snapped && !m.markedForRemoval && !m.readyToBeRemoved &&
      neighboursOfTop.indexOf(m._id) < 0
    ).forEach(m => m.startFalling())
  }

  return {
    getNeighbours: markNeighbours,
    detectFall: detectFall
  };
}

export { getNeighbourCoordinates, getNeighbours }
