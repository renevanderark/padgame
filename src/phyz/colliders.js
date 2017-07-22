import linesIntersect from "./lines-intersect";

export default (getBars, getMarbles) => {
	return {
		marbleCollidesWithBar: (marble, _ang) => {
			const bars = getBars();
			for (let i = 0; i < bars.length; i++) {
				const collides = linesIntersect(
					bars[i].getLineVector(),
					[
						marble._x - Math.cos(_ang) * (marble.radius + 1),
						marble._y - Math.cos(_ang) * (marble.radius + 1),
						marble._x + Math.cos(_ang) * (marble.radius + 1),
						marble._y + Math.sin(_ang) * (marble.radius + 1)
					]
				);
				if (collides) {
					return {
						collides: true,
						angle: bars[i].getAngle()
					};
				}
			}
			return {
				collides: false
			};
		},
		marbleCollidesWithMarble: (marble) =>
			getMarbles()
				.filter(m => m._id !== marble._id)
				.map(m => ({
					distance: Math.sqrt(
						Math.pow(m._x - marble._x, 2) +
						Math.pow(m._y - marble._y, 2)),
					m: m
				}))
				.filter(obj => obj.distance < marble.radius + obj.m.radius)
				.forEach(obj => {
					obj.m.bounceAwayFrom(marble, obj.distance)
				})
	}
}
