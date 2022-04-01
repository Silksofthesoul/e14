class Scene {
  x = 0;
  y = 0;
  width = 2;
  height = 2;

  borderColor = 'rgba(200, 0, 0, 1)';
  borderWidth = 3;

  isShowGrid = false;
  isShowBorder = false;
  isShowBg = false;

  constructor ({
    width = 2, height = 2,
    x = 0, y = 0,
    borderColor = 'rgba(200, 0, 0, 1)',
    borderWidth = 3,
    isShowGrid = false,
    isShowBorder = false,
    isShowBg = true
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.borderColor = borderColor;
    this.isShowGrid = isShowGrid;
    this.isShowBorder = isShowBorder;
    this.isShowBg = isShowBg;
  }

  drawBorder() {
    const { values } = Object;
    const border = {
      top: [this.x, this.y, this.maxX, this.y],
      bottom: [this.x, this.maxY, this.maxX, this.maxY],
      left: [this.x, this.y, this.x, this.maxY],
      right: [this.maxX, this.y, this.maxX, this.maxY]
    };
    strokeWeight(this.borderWidth);
    stroke(this.borderColor);
    for (let item of values(border)) line(...item);
    strokeWeight(1);
  }

  get maxX() { return this.x + this.width; }
  get maxY() { return this.y + this.height; }
  get minX() { return this.x; }
  get minY() { return this.y; }

  drawBg() {
    const {x, y, width, height} = this;

    fill('rgba(255,255,255,1)');
    stroke('rgba(255,255,255,0)');
    rect(x, y, width, height);
  }
  drawCoords({stepMin = 10, stepMax = 50}) {
    const {x, y, width, height} = this;

    let lengthMinX = int(width / stepMin);
    let lengthMinY = int(height / stepMin);
    let lengthMaxX = int(width / stepMax);
    let lengthMaxY = int(height / stepMax);


    fill('rgba(255,255,255,1)');
    rect(x, y, width, height);

    stroke('rgba(0, 0, 255, 0.1)');
    for (let i = 0; i <= lengthMinX; i++) {
      let x1 = (i == 0 ? i : i * stepMin) + x;
      let x2 = (i == 0 ? i : i * stepMin) + x;
      let y1 = y;
      let y2 = y + height;
      let l = [x1, y, x2, y2];
      line(...l);
    }
    for (let i = 0; i <= lengthMinY; i++) {
      let x1 = x;
      let x2 = x + width;
      let y1 = (i == 0 ? i : i * stepMin) + y;
      let y2 = (i == 0 ? i : i * stepMin) + y;
      let l = [x1, y1, x2, y2];
      line(...l);
    }
    stroke('rgba(255, 0, 0, 0.2)');
    for (let i = 0; i <= lengthMaxX; i++) {
      let x1 = (i == 0 ? i : i * stepMax) + x;
      let x2 = (i == 0 ? i : i * stepMax) + x;
      let y1 = y;
      let y2 = y + height;
      let l = [x1, y, x2, y2];
      line(...l);
    }
    for (let i = 0; i <= lengthMaxY; i++) {
      let x1 = x;
      let x2 = x + width;
      let y1 = (i == 0 ? i : i * stepMax) + y;
      let y2 = (i == 0 ? i : i * stepMax) + y;
      let l = [x1, y1, x2, y2];
      line(...l);
    }
  }

  render() {
    if(this.isShowBg) this.drawBg();
    if(this.isShowGrid) this.drawCoords({ stepMin: 10, stepMax: 50 });
    if(this.isShowBorder) this.drawBorder();
  }

}
