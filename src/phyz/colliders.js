export default (getMarbles) => {
	return {
		marbleCollidesWithMarble: (marble) => {
			const found = getMarbles()
				.filter(m => m._id !== marble._id && m.snapped)
				.map(m => ({
					distance: Math.sqrt(
						Math.pow(m._x - marble._x, 2) +
						Math.pow(m._y - marble._y, 2)),
					m: m
				}))
				.filter(obj => obj.distance < marble.radius + obj.m.radius)
				.sort((a, b) => a.distance < b.distance ? 1 : -1);
			if (found.length > 0) {
				return found[0].m;
			}
			return null;
		}
	}
}
