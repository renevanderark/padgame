const getNeighbourCoordinates = (marble) =>
  [0, 60, 120, 180, 240, 300]
    .map(deg => deg * (Math.PI / 180))
    .map(rad => ({
      x: Math.round(marble._x + Math.cos(rad) * (marble.radius * 2)),
      y: Math.round(marble._y + Math.sin(rad) * (marble.radius * 2))
    }));

const getNeighbours = (getMarbles) =>
  (marble, colorFilter = null) => {
    const neighbourCoords = getNeighbourCoordinates(marble);

    return getMarbles()
      .filter(m => colorFilter ? marble.color === colorFilter : true)
      .filter(m => neighbourCoords.map(nC =>
          m._x >  nC.x - m.radius &&
          m._x < nC.x + m.radius &&
          m._y > nC.y - m.radius &&
          m._y < nC.y + m.radius).indexOf(true) > -1
      );
  }
export { getNeighbourCoordinates, getNeighbours }
