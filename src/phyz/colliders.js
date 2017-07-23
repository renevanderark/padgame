export default (getMarbles) => {
	return {
		marbleCollidesWithMarble: (marble, onCollision) =>
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
					onCollision(obj.m, obj.distance)
				})
	}
}
