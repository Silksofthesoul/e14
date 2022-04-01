const testCrossingLines = (seg1, seg2) => {
  let { x1: ax1, x2: ax2, y1: ay1, y2: ay2 } = seg1;
  let { x1: bx1, x2: bx2, y1: by1, y2: by2 } = seg2;

  let isCrossed = false;
  let isTouched = false;
  let isEqual = false;
  // console.log((ax2 - ax1) / (ay1 - ay2));
  // console.log((ax2 - ax1) , (ay1 - ay2));
  let cmpX = (ax2 - ax1);
  let cmpY = (ay2 - ay1);
  let q = cmpX / (ay1 - ay2);
  let sn = (bx1 - bx2) + (by1 - by2) * q;
  let fn = (bx1 - ax1) + (by1 - ay1) * q;
  let n = (fn !== 0 ? fn : 1) / (sn !== 0 ? sn : 1);
  // console.log(n, fn, sn, q);
  let dX = bx1 + (bx2 - bx1) * n;
  let dY = by1 + (by2 - by1) * n;

  if(
    [
      [ ax1 === bx1, ay1 === by1, ax2 === bx2, ay2 === by2 ].every(itm => !!itm),
      [ ax1 === bx2, ay1 === by2, ax2 === bx1, ay2 === by1 ].every(itm => !!itm)
    ].some(itm => !!itm)
  ) { isEqual = true;}
  else { isEqual = false;}

  if(
    [
      inRange(dX, [min(ax1, ax2), max(ax1, ax2)], false),
      inRange(dX, [min(bx1, bx2), max(bx1, bx2)], false),
      inRange(dY, [min(ay1, ay2), max(ay1, ay2)], false),
      inRange(dY, [min(by1, by2), max(by1, by2)], false),
    ].every(itm => !!itm)
  ) { isCrossed = true; }
  else { isCrossed = false; }

  if(
    [
      inRange(dX, [min(ax1, ax2), max(ax1, ax2)], true),
      inRange(dX, [min(bx1, bx2), max(bx1, bx2)], true),
      inRange(dY, [min(ay1, ay2), max(ay1, ay2)], true),
      inRange(dY, [min(by1, by2), max(by1, by2)], true),
    ].every(itm => !!itm)
  ) { isTouched = true; }
  else { isTouched = false; }

  return { dX, dY, isCrossed, isTouched, isEqual };
};

window.testCrossingLines = testCrossingLines;

const getRelativeLine = ({ x, y, deg, length}) => {
  let x2 = floor(x + gx(length, deg));
  let y2 = floor(y + gy(length, deg));
  return { x1: x, y1: y, x2, y2, };
};

const gx = (len, deg) => (len * sin((-deg + 180) * PI / 180) / len) * len;
const gy = (len, deg) => (len * cos((deg + 180) * PI / 180) / len) * len;

// Converts from degrees to radians.
const deg2rad = deg => deg * PI / 180;

// Converts from radians to degrees.
const rad2deg = rad => rad * 180 / PI;

const getDegByPoints = (x1, y1, x2, y2) => {
  let v = y2 - y1;
  let h = x2 - x1;
  return rad2deg(atan2(v, h));
};


const degGuard = deg => deg % 360;

const ratio = (a = 1, b = 1, c = 1) => a * c / b; // ??
