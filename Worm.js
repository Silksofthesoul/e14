const _seg = (x1, y1, x2, y2, stroke = 'rgb(0, 0, 0)') => ({x1, y1, x2, y2, stroke});
const getLine = ({x1, y1, x2, y2}) => ([x1, y1, x2, y2]);
const getStroke = ({stroke}) => stroke;

let factor = (mult = 1) => rndMinMaxInt(0, rndMinMaxInt(1, 3)) * mult;

class Worm {
  id = null;
  stroke = 'rgb(0, 0, 0)'
  x = 0;
  y = 0;

  borderX = 2;
  borderY = 2;

  borderWidth = 2;
  borderHeight = 2;


  length = 5;

  lengthMin = 3;
  lengthMax = 30;

  lengthStep = 1;

  maxLength = 1024 * 4;

  segments = [];

  degFactor = rndCoinBool() ? 2 : -2;
  degMutator = 1;
  deg = rndMinMaxInt(-360, 360);
  oldDeg = 0;
  lastSegment = null;
  firstSegment = null;

  isStop = false;

  isVisDetect = true;
  isVisHead = true;
  isVisSegemntsEnd = true;


  constructor ({x, y, width, height}) {
    this.id = getRndId();
    this.borderWidth = width;
    this.borderHeight = height;
    this.borderX = x;
    this.borderY = y;
  }

  step({obstacles = []}) {
    if(this.isStop) return false;
    let segment = co(getLast(this.segments) || this.initPosition);
    let tmpSegment = co(segment);
    segment.x1 = segment.x2;
    segment.y1 = segment.y2;

    let flag = true;
    let safeMax = 400;
    let safeCount = 0;
    let x2 = null;
    let y2 = null;

    while (flag) {
      if(++safeCount > safeMax) {
        this.isStop = true;
        flag = false;
      }
      if(rndCoinBool() && rndCoinBool() && rndCoinBool()) this.degFactor = -(this.degFactor);
      this.deg = degGuard(this.deg + this.degFactor );
      if(degGuard(this.deg + 180) === this.oldDeg) return;
      let { x2: _x2, y2: _y2 } = getRelativeLine({
        x: segment.x1,
        y: segment.y1,
        deg: this.deg,
        length: this.length * 3
      });


      let isCrossed = this.testCrossed({
        segment: {...segment, x2: _x2, y2: _y2},
        obstacles
      });
      if(this.degFactor >= rndMinMaxInt(45, 90)) this.degMutator = -2;
      if(this.degFactor <= rndMinMaxInt(-45, -90)) this.degMutator = 2;

      if(isCrossed) {
        if(this.isVisDetect) {
          strokeWeight(2);
          stroke(`rgb(255,0,0)`);
          line(...getLine({
            ...segment,
            x2: _x2,
            y2: _y2
          }));
          strokeWeight(1);
        }
        rndCoinBool() && this.segments.shift();
        if(rndCoinBool() && rndCoinBool()) this.deg = -(this.deg);
        this.degFactor = this.degMutator * this.degMutator;

        this.lengthStep = -1;
        this.length += this.lengthStep;
        if(this.length < this.lengthMin) this.length = this.lengthMin;
        this.degMutator = rndMinMaxInt(-5, 5);
        return;
      }
      if(!isCrossed) {
        if(this.isVisDetect) {
          strokeWeight(2);
          stroke(`rgb(0,200,0)`);
          line(...getLine({
            ...segment,
            x2: _x2,
            y2: _y2
          }));
          strokeWeight(1);
        }
        this.degFactor += this.degMutator;
        this.lengthStep = +1;
        this.length += this.lengthStep;
        if(this.length > this.lengthMax) this.length = this.lengthMax;
        this.degMutator = rndMinMaxInt(-2, 2);
        x2 = _x2;
        y2 = _y2;
        flag = false;
      }
    }
    this.oldDeg = this.deg;
    this.lastSegment = this.segments.at(-1) || this.lastSegment;
    this.firstSegment = this.segments.at(0) || this.firstSegment;
    let { x2: __x2, y2: __y2 } = getRelativeLine({
      x: segment.x1,
      y: segment.y1,
      deg: this.deg,
      length: this.length
    });

    segment.x2 = __x2;
    segment.y2 = __y2;

    segment.stroke = `rgb(${rndMinMaxInt(0, 20)}, ${rndMinMaxInt(0, 10)}, ${rndMinMaxInt(0, 255)})`;

    if( segment.x2 >= this.maxX) {
      segment.x2 += -(this.length);
      this.deg = degGuard(this.deg + 180);
      this.oldDeg = this.deg;
    }
    if( segment.y2 >= this.maxY) {
      segment.y2 += -(this.length);
      this.deg = degGuard(this.deg + 180);
      this.oldDeg = this.deg;
    }

    if( segment.x2 <= this.minX) {
      segment.x2 += this.length;
      this.deg = degGuard(this.deg + 180);
      this.oldDeg = this.deg;
    }
    if( segment.y2 <= this.minY) {
      segment.y2 += this.length;
      this.deg = degGuard(this.deg + 180);
      this.oldDeg = this.deg;
    }

    if(this.segments.length > this.maxLength) this.segments.shift();
    if(this.isVisHead) {
      strokeWeight(20);
      stroke('rgba(127, 0, 127, 1)');
      point(segment.x2, segment.y2);
      strokeWeight(1);
    }

    this.segments.push(segment);
  }

  testCrossed({
    segment: newSegment,
    obstacles = []
  }) {
    const segments = [
      ...obstacles,
      _seg(...this.borderSegments.top),
      _seg(...this.borderSegments.right),
      _seg(...this.borderSegments.bottom),
      _seg(...this.borderSegments.left),
      ...this.segments,
    ];
    let count = -1;
    let max = segments.length - 1;
    let touched = [];
    let crossed = [];
    let equal = [];

    for (let i = 0; i < max; i++) {
      let segment  = segments[i];
      if(i === max) return false;
      const { isCrossed, isTouched, isEqual, dX, dY } = testCrossingLines(newSegment, segment);
      if(isCrossed) crossed.push(i);
      if(isTouched) touched.push(i);
      if(isEqual) equal.push(i);
    }
    if(crossed.length > 0) return true;
    if(equal.length > 0) return true;
    if(touched.length > 0) return true;
    return false;
  }

  get maxX() { return this.borderX + this.borderWidth; }
  get maxY() { return this.borderY + this.borderHeight; }
  get minX() { return this.borderX; }
  get minY() { return this.borderY; }
  get allSegments() { return this.segments.map(item => removeProperty('stroke')(item)); }
  get borderSegments() {
    return {
      top: [this.minX, this.minY, this.maxX, this.minY],
      bottom: [this.minX, this.maxY, this.maxX, this.maxY],
      left: [this.minX, this.minY, this.minX, this.maxY],
      right: [this.maxX, this.minY, this.maxX, this.maxY]
    };
  }

  get initPosition() {
    if(this.lastSegment) return this.lastSegment;
    this.deg = rndMinMaxInt(-360, 360);
    const x1 = rndMinMaxInt(
      int(this.borderX + (this.borderWidth - this.length) / 2) - int(this.borderWidth / 2),
      int(this.borderX + (this.borderWidth - this.length) / 2) + int(this.borderWidth / 2)
    );
    const y1 = rndMinMaxInt(
      int(this.borderY + (this.borderHeight - this.length) / 2) - int(this.borderHeight / 2),
      int(this.borderY + (this.borderHeight - this.length) / 2) + int(this.borderHeight / 2)
    );

    let newSegment = getRelativeLine({
      x: x1,
      y: y1,
      deg: this.deg,
      length: this.length
    });

    return {...newSegment, stroke: this.stroke};
  }

  drawWorm() {
    for (let segment of this.segments) {
      if(this.isVisSegemntsEnd) {
        strokeWeight(5)
        stroke('rgba(0,0,255,0.1)');
        point(segment.x1, segment.y1);
        point(segment.x2, segment.y2);
        strokeWeight(1)
      }
      stroke(getStroke(segment));
      line(...getLine(segment));
    }
  }

  render() {
    this.drawWorm();
  }

}
