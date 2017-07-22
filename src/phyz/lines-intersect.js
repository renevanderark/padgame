// TODO: attribute
export default (lineA, lineB) => {
	var A = { X: lineA[0], Y: lineA[1] },
		B = { X: lineA[2], Y: lineA[3] },
		C = { X: lineB[0], Y: lineB[1] },
		D = { X: lineB[2], Y: lineB[3] },
		CmP = { X: C.X - A.X, Y: C.Y - A.Y },
		r =   { X: B.X - A.X, Y: B.Y - A.Y },
		s =   { X: D.X - C.X, Y: D.Y - C.Y },
		CmPxr = CmP.X * r.Y - CmP.Y * r.X,
		CmPxs = CmP.X * s.Y - CmP.Y * s.X,
		rxs = r.X * s.Y - r.Y * s.X;

	if (CmPxr === 0) {
		return ((C.X - A.X < 0) != (C.X - B.X < 0)) ||
			((C.Y - A.Y < 0) != (C.Y - B.Y < 0));
	}

	if (rxs == 0) { return false; }
	var rxsr = 1 / rxs,
		t = CmPxs * rxsr,
		u = CmPxr * rxsr;

	return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);
}