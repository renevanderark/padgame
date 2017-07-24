const getNeighbourCoordinates = (marble) =>
  [0, 60, 120, 180, 240, 300]
    .map(deg => deg * (Math.PI / 180))
    .map(rad => ({
      x: Math.round(marble._x + Math.cos(rad) * (marble.radius * 2)),
      y: Math.round(marble._y + Math.sin(rad) * (marble.radius * 2))
    }));

const getNeighbours = (getMarbles) => {
  const _markNeighbours = (marble, colorFilter = null) => {
    marble.marked = true;

    const neighbourCoords = getNeighbourCoordinates(marble);
    getMarbles()
      .filter(m => neighbourCoords.map(nC =>
          m._x >  nC.x - m.radius &&
          m._x < nC.x + m.radius &&
          m._y > nC.y - m.radius &&
          m._y < nC.y + m.radius).indexOf(true) > -1
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

  return {
    getNeighbours: markNeighbours
  };
}

export { getNeighbourCoordinates, getNeighbours }
