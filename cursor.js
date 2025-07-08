//----------------------------------------------------------------------
// GLOBAL VARIABLES
//----------------------------------------------------------------------

// Small squares (23 of them):
let numSmall = 23;
let smallSize = 49;            // display size of each small square
let smallBase = [];            // fixed “base” positions
let smallNoiseX = [];
let smallNoiseY = [];

// Physics arrays for small squares
let smallPos = [];
let smallVel = [];
let smallAcc = [];

// Hold the loaded images and their masked versions:
let smallImgs = [];
let smallMasked = [];

// Connections between small squares:
let connections = [
  [0, 1],  [0, 2],  [1, 6],  [6, 3],  [1, 2],
  [3, 4],  [1, 5],  [1, 7],  [8, 7],  [8, 9],
  [6, 9],  [7, 10], [8, 10], [11, 10], [11, 6],
  [10, 12],[14, 12],[14, 9], [14, 10], [15, 10],
  [15, 14],[11, 3],[9, 16], [17, 9],   [17, 19],
  [17, 16],[18, 19],[19, 20],[20, 21], [20, 22],
  [21, 5], [21, 4], [20, 4], [19, 5],  [17, 5],

  // dotted connections (indices 35–46):
  [17, 7],  [18, 20], [21, 22], [12, 16],
  [12, 9],  [5, 9],   [4, 9],   [19, 9],
  [11, 16], [2, 6],   [2, 13],  [13, 7]
];
let dottedConnections = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

// Medium squares (4 of them):
let numMed = 4;
let medSize = 105;             // display size of each medium square
let medBase = [];
let medNoiseX = [];
let medNoiseY = [];

let medPos = [];
let medVel = [];
let medAcc = [];

let medImgs = [];
let medMasked = [];

// Large squares (3 of them):
let bigVideos = [];
let numBig = 3;
let bigSize = 280;             // display size of each large square
let bigBase = [];
let bigNoiseX = [];
let bigNoiseY = [];

let bigPos = [];
let bigVel = [];
let bigAcc = [];

let bigImgs = [];
let bigMasked = [];

let gridSpacing = 100;
let gridColor;

// Adjustable parameters (will be controlled by sliders):
let smallNoiseStep;
let smallRadiusMax;
let medNoiseStep;
let medRadiusMax;
let bigNoiseStep;
let bigRadiusMax;
let springK;
let damping;
let impulseStrength;
let impactRadiusFactor;

// Sliders and value displays:
let sliderSmallNoiseStep, spanSmallNoiseStep;
let sliderSmallRadiusMax, spanSmallRadiusMax;
let sliderMedNoiseStep, spanMedNoiseStep;
let sliderMedRadiusMax, spanMedRadiusMax;
let sliderBigNoiseStep, spanBigNoiseStep;
let sliderBigRadiusMax, spanBigRadiusMax;
let sliderSpringK, spanSpringK;
let sliderDamping, spanDamping;
let sliderImpulse, spanImpulse;
let sliderImpactRadius, spanImpactRadius;

//----------------------------------------------------------------------
// preload(): load all images into smallImgs[], medImgs[], bigImgs[]
//----------------------------------------------------------------------

function preload() {
  // 1) Load small images: "Small/Small_1.jpg" → smallImgs[0], … up to Small_23.jpg
  for (let i = 1; i <= numSmall; i++) {
    smallImgs[i - 1] = loadImage(`Small/Small_${i}.jpg`);
  }
  // 2) Load medium images: "Medium/Medium_1.jpg" → medImgs[0] … Medium_4.jpg
  for (let i = 1; i <= numMed; i++) {
    medImgs[i - 1] = loadImage(`Medium/Medium_${i}.jpg`);
  }
  // 3) Load large images: "Large/Large_1.jpg" → bigImgs[0] … Large_3.jpg
  for (let i = 1; i <= numBig; i++) {
    bigImgs[i - 1] = loadImage(`Large/Large_${i}.jpg`);
  }
}

//----------------------------------------------------------------------
// setup(): initialize positions, noise offsets, mask images, and sliders
//----------------------------------------------------------------------

function setup() {
  createCanvas(2098, 1170);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  // Light gray for grid lines (if you re‐enable drawGrid)
  gridColor = color(200, 200, 200, 150);

  // --- SMALL squares setup ---
  smallBase = [
    createVector(300,  800),  createVector(800, 300),  createVector(650, 625),
    createVector(1320, 850),  createVector(1550, 500), createVector(1790, 670),
    createVector(1180, 720),  createVector(1050, 425), createVector(1150, 500),
    createVector(1250, 550),  createVector(980, 770),  createVector(1050, 930),
    createVector(850, 600),   createVector(835, 470),  createVector(600, 740),
    createVector(800, 850),   createVector(1320, 720), createVector(1490, 300),
    createVector(1600, 220),  createVector(1650, 350), createVector(1800, 400),
    createVector(1790, 500),  createVector(1900, 600), createVector(1490, 300)
  ];
  for (let i = 0; i < numSmall; i++) {
    smallNoiseX[i] = random(10);
    smallNoiseY[i] = random(10);
    smallPos[i] = smallBase[i].copy();
    smallVel[i] = createVector(0, 0);
    smallAcc[i] = createVector(0, 0);
  }
  // Create a rounded‐corner mask for each small image:
  for (let i = 0; i < numSmall; i++) {
    let img = smallImgs[i];
    img.resize(smallSize, smallSize);
    let maskG = createGraphics(smallSize, smallSize);
    maskG.noStroke();
    maskG.fill(255);
    maskG.rect(0, 0, smallSize, smallSize, 10);
    img.mask(maskG);
    smallMasked[i] = img;
  }

  // --- MEDIUM squares setup ---
  medBase = [
    createVector(1030, 300),
    createVector(790, 700),
    createVector(1600, 650),
    createVector(220, 1000)
  ];
  for (let i = 0; i < numMed; i++) {
    medNoiseX[i] = random(10);
    medNoiseY[i] = random(10);
    medPos[i] = medBase[i].copy();
    medVel[i] = createVector(0, 0);
    medAcc[i] = createVector(0, 0);
  }
  // Create a rounded‐corner mask for each medium image:
  for (let i = 0; i < numMed; i++) {
    let img = medImgs[i];
    img.resize(medSize, medSize);
    let maskG = createGraphics(medSize, medSize);
    maskG.noStroke();
    maskG.fill(255);
    maskG.rect(0, 0, medSize, medSize, 20);
    img.mask(maskG);
    medMasked[i] = img;
  }

  // --- LARGE squares setup ---
  bigBase = [
    createVector(450, 450),
    createVector(1550, 920),
    createVector(1300, 250)
  ];
  // for (let i = 0; i < numBig; i++) {
  //   bigNoiseX[i] = random(10);
  //   bigNoiseY[i] = random(10);
  //   bigPos[i] = bigBase[i].copy();
  //   bigVel[i] = createVector(0, 0);
  //   bigAcc[i] = createVector(0, 0);
  // }
  // // Create a rounded‐corner mask for each large image:
  // for (let i = 0; i < numBig; i++) {
  //   let img = bigImgs[i];
  //   img.resize(bigSize, bigSize);
  //   let maskG = createGraphics(bigSize, bigSize);
  //   maskG.noStroke();
  //   maskG.fill(255);
  //   maskG.rect(0, 0, bigSize, bigSize, 40);
  //   img.mask(maskG);
  //   bigMasked[i] = img;
  // }

  for (let i = 0; i < numBig; i++) {
  bigNoiseX[i] = random(10);
  bigNoiseY[i] = random(10);
  bigPos[i] = bigBase[i].copy();
  bigVel[i] = createVector(0, 0);
  bigAcc[i] = createVector(0, 0);

  let path = `Videos/Large_video${i + 1}.mp4`;

  // You need a local scope variable to capture the current index
  ((index) => {
      let vid = createVideo(path, () => {
        vid.volume(0);
        vid.loop();
        vid.hide();
        bigVideos[index] = vid;  // use index to store in correct order
      });
      vid.size(bigSize, bigSize);
    })(i);
  }

  // --- SLIDER SETUP ---  

  // smallNoiseStep: range [0.0005, 0.01], default 0.002
  createDiv('smallNoiseStep').position(10, 10);
  sliderSmallNoiseStep = createSlider(0.0005, 0.01, 0.002, 0.0001);
  sliderSmallNoiseStep.position(10, 30);
  spanSmallNoiseStep = createSpan(sliderSmallNoiseStep.value());
  spanSmallNoiseStep.position(230, 28);

  // smallRadiusMax: range [0, 200], default 50
  createDiv('smallRadiusMax').position(10, 55);
  sliderSmallRadiusMax = createSlider(0, 200, 50, 1);
  sliderSmallRadiusMax.position(10, 75);
  spanSmallRadiusMax = createSpan(sliderSmallRadiusMax.value());
  spanSmallRadiusMax.position(230, 73);

  // medNoiseStep: range [0.0005, 0.01], default 0.005
  createDiv('medNoiseStep').position(10, 100);
  sliderMedNoiseStep = createSlider(0.0005, 0.01, 0.005, 0.0001);
  sliderMedNoiseStep.position(10, 120);
  spanMedNoiseStep = createSpan(sliderMedNoiseStep.value());
  spanMedNoiseStep.position(230, 118);

  // medRadiusMax: range [0, 200], default 20
  createDiv('medRadiusMax').position(10, 145);
  sliderMedRadiusMax = createSlider(0, 200, 20, 1);
  sliderMedRadiusMax.position(10, 165);
  spanMedRadiusMax = createSpan(sliderMedRadiusMax.value());
  spanMedRadiusMax.position(230, 163);

  // bigNoiseStep: range [0.0005, 0.01], default 0.005
  createDiv('bigNoiseStep').position(10, 190);
  sliderBigNoiseStep = createSlider(0.0005, 0.01, 0.005, 0.0001);
  sliderBigNoiseStep.position(10, 210);
  spanBigNoiseStep = createSpan(sliderBigNoiseStep.value());
  spanBigNoiseStep.position(230, 208);

  // bigRadiusMax: range [0, 200], default 30
  createDiv('bigRadiusMax').position(10, 235);
  sliderBigRadiusMax = createSlider(0, 200, 30, 1);
  sliderBigRadiusMax.position(10, 255);
  spanBigRadiusMax = createSpan(sliderBigRadiusMax.value());
  spanBigRadiusMax.position(230, 253);

  // springK: range [0, 0.2], default 0.02
  createDiv('springK').position(10, 280);
  sliderSpringK = createSlider(0, 0.2, 0.02, 0.005);
  sliderSpringK.position(10, 300);
  spanSpringK = createSpan(sliderSpringK.value());
  spanSpringK.position(230, 298);

  // damping: range [0, 1], default 0.9
  createDiv('damping').position(10, 325);
  sliderDamping = createSlider(0, 1, 0.95, 0.01);
  sliderDamping.position(10, 345);
  spanDamping = createSpan(sliderDamping.value());
  spanDamping.position(230, 343);

  // impulseStrength: range [0, 2], default 0.5
  createDiv('impulseStrength').position(10, 370);
  sliderImpulse = createSlider(0, 2, 0.5, 0.01);
  sliderImpulse.position(10, 390);
  spanImpulse = createSpan(sliderImpulse.value());
  spanImpulse.position(230, 388);

  // impactRadiusFactor: range [1, 20], default 8
  createDiv('impactRadiusFactor').position(10, 415);
  sliderImpactRadius = createSlider(1, 20, 20, 1);
  sliderImpactRadius.position(10, 435);
  spanImpactRadius = createSpan(sliderImpactRadius.value());
  spanImpactRadius.position(230, 433);
}

//----------------------------------------------------------------------
// draw(): update Perlin‐noise motion, apply impulses, draw everything
//----------------------------------------------------------------------

function draw() {
  // Read slider values into parameters and update displayed spans:
  smallNoiseStep     = sliderSmallNoiseStep.value();
  spanSmallNoiseStep.html(smallNoiseStep);

  smallRadiusMax     = sliderSmallRadiusMax.value();
  spanSmallRadiusMax.html(smallRadiusMax);

  medNoiseStep       = sliderMedNoiseStep.value();
  spanMedNoiseStep.html(medNoiseStep);

  medRadiusMax       = sliderMedRadiusMax.value();
  spanMedRadiusMax.html(medRadiusMax);

  bigNoiseStep       = sliderBigNoiseStep.value();
  spanBigNoiseStep.html(bigNoiseStep);

  bigRadiusMax       = sliderBigRadiusMax.value();
  spanBigRadiusMax.html(bigRadiusMax);

  springK            = sliderSpringK.value();
  spanSpringK.html(springK);

  damping            = sliderDamping.value();
  spanDamping.html(damping);

  impulseStrength    = sliderImpulse.value();
  spanImpulse.html(impulseStrength);

  impactRadiusFactor = sliderImpactRadius.value();
  spanImpactRadius.html(impactRadiusFactor);

  // 1) Clear & draw background circles
  background(240);
  drawBackgroundCircles();

  // 2) Compute small squares’ noise‐based “default” positions
  let smallDefault = [];
  for (let i = 0; i < numSmall; i++) {
    smallNoiseX[i] += smallNoiseStep;
    smallNoiseY[i] += smallNoiseStep;
    let dx = map(noise(smallNoiseX[i]), 0, 1, -smallRadiusMax, smallRadiusMax);
    let dy = map(noise(smallNoiseY[i]), 0, 1, -smallRadiusMax, smallRadiusMax);
    let bx = smallBase[i].x;
    let by = smallBase[i].y;
    smallDefault[i] = createVector(bx + dx, by + dy);
  }

  // 3) Update physics for small squares
  let cursorSquareSize = smallSize * impactRadiusFactor;
  for (let i = 0; i < numSmall; i++) {
    // Reset acceleration
    smallAcc[i].set(0, 0);

    // a) Spring force toward “default” position
    let springForce = p5.Vector.sub(smallDefault[i], smallPos[i]);
    springForce.mult(springK);
    smallAcc[i].add(springForce);

    // b) If cursor “square” overlaps, apply repulsion impulse
    let p = smallPos[i];
    if (
      abs(mouseX - p.x) < cursorSquareSize / 2 &&
      abs(mouseY - p.y) < cursorSquareSize / 2
    ) {
      let away = p5.Vector.sub(p, createVector(mouseX, mouseY));
      away.normalize().mult(impulseStrength);
      smallAcc[i].add(away);
    }

    // c) Integrate: vel += acc, then damp, then pos += vel
    smallVel[i].add(smallAcc[i]);
    smallVel[i].mult(damping);
    smallPos[i].add(smallVel[i]);
  }

  // 4) Draw connections between small squares (using updated positions)
  for (let i = 0; i < connections.length; i++) {
    let [aIdx, bIdx] = connections[i];
    let aPos = smallPos[aIdx];
    let bPos = smallPos[bIdx];
    if (dottedConnections.includes(i)) {
      stroke(50);
      strokeWeight(1.4);
      drawingContext.setLineDash([1, 13]);
    } else {
      stroke(90);
      strokeWeight(2);
      drawingContext.setLineDash([]);
    }
    line(aPos.x, aPos.y, bPos.x, bPos.y);
  }
  drawingContext.setLineDash([]); // reset dash

  // 5) Draw small squares’ masked images at updated positions
  noStroke();
  for (let i = 0; i < numSmall; i++) {
    let p = smallPos[i];
    imageMode(CENTER);
    image(smallMasked[i], p.x, p.y, smallSize, smallSize);
  }

  // 6) Compute medium squares’ noise‐based “default” positions
  let medDefault = [];
  for (let i = 0; i < numMed; i++) {
    medNoiseX[i] += medNoiseStep;
    medNoiseY[i] += medNoiseStep;
    let dx = map(noise(medNoiseX[i]), 0, 1, -medRadiusMax, medRadiusMax);
    let dy = map(noise(medNoiseY[i]), 0, 1, -medRadiusMax, medRadiusMax);
    let bx = medBase[i].x;
    let by = medBase[i].y;
    medDefault[i] = createVector(bx + dx, by + dy);
  }

  // 7) Update physics for medium squares
  cursorSquareSize = medSize * impactRadiusFactor;
  for (let i = 0; i < numMed; i++) {
    medAcc[i].set(0, 0);

    // spring force toward default
    let springF = p5.Vector.sub(medDefault[i], medPos[i]);
    springF.mult(springK);
    medAcc[i].add(springF);

    // cursor repulsion
    let p = medPos[i];
    if (
      abs(mouseX - p.x) < cursorSquareSize / 2 &&
      abs(mouseY - p.y) < cursorSquareSize / 2
    ) {
      let away = p5.Vector.sub(p, createVector(mouseX, mouseY));
      away.normalize().mult(impulseStrength);
      medAcc[i].add(away);
    }

    medVel[i].add(medAcc[i]);
    medVel[i].mult(damping);
    medPos[i].add(medVel[i]);
  }

  // 8) Draw medium squares’ masked images
  noStroke();
  for (let i = 0; i < numMed; i++) {
    let q = medPos[i];
    imageMode(CENTER);
    image(medMasked[i], q.x, q.y, medSize, medSize);
  }

  // 9) Compute large squares’ noise‐based “default” positions
  let bigDefault = [];
  for (let i = 0; i < numBig; i++) {
    bigNoiseX[i] += bigNoiseStep;
    bigNoiseY[i] += bigNoiseStep;
    let dx = map(noise(bigNoiseX[i]), 0, 1, -bigRadiusMax, bigRadiusMax);
    let dy = map(noise(bigNoiseY[i]), 0, 1, -bigRadiusMax, bigRadiusMax);
    let bx = bigBase[i].x;
    let by = bigBase[i].y;
    bigDefault[i] = createVector(bx + dx, by + dy);
  }

  // 10) Update physics for large squares
  cursorSquareSize = bigSize * impactRadiusFactor;
  for (let i = 0; i < numBig; i++) {
    bigAcc[i].set(0, 0);

    // spring force toward default
    let springF = p5.Vector.sub(bigDefault[i], bigPos[i]);
    springF.mult(springK);
    bigAcc[i].add(springF);

    // cursor repulsion
    let p = bigPos[i];
    if (
      abs(mouseX - p.x) < cursorSquareSize / 2 &&
      abs(mouseY - p.y) < cursorSquareSize / 2
    ) {
      let away = p5.Vector.sub(p, createVector(mouseX, mouseY));
      away.normalize().mult(impulseStrength);
      bigAcc[i].add(away);
    }

    bigVel[i].add(bigAcc[i]);
    bigVel[i].mult(damping);
    bigPos[i].add(bigVel[i]);
  }

  // 11) Draw large squares’ masked images on top
  // noStroke();
  // for (let i = 0; i < numBig; i++) {
  //   let r = bigPos[i];
  //   imageMode(CENTER);
  //   // image(bigMasked[i], r.x, r.y, bigSize, bigSize);
  //   image(bigVideos[i], r.x, r.y, bigSize, bigSize);

  // }

for (let i = 0; i < numBig; i++) {
  let r = bigPos[i];

  // Save drawing state
  drawingContext.save();

  // Create rounded rect clipping path
  drawingContext.beginPath();
  drawingContext.moveTo(r.x + bigSize / 2 - 40, r.y - bigSize / 2); // top-right corner
  drawingContext.arcTo(r.x + bigSize / 2, r.y - bigSize / 2, r.x + bigSize / 2, r.y + bigSize / 2, 40);
  drawingContext.arcTo(r.x + bigSize / 2, r.y + bigSize / 2, r.x - bigSize / 2, r.y + bigSize / 2, 40);
  drawingContext.arcTo(r.x - bigSize / 2, r.y + bigSize / 2, r.x - bigSize / 2, r.y - bigSize / 2, 40);
  drawingContext.arcTo(r.x - bigSize / 2, r.y - bigSize / 2, r.x + bigSize / 2, r.y - bigSize / 2, 40);
  drawingContext.closePath();
  drawingContext.clip();

  // Draw video inside clipped region
  imageMode(CENTER);
  image(bigVideos[i], r.x, r.y, bigSize, bigSize);

  // Restore normal drawing
  drawingContext.restore();
}


}

//----------------------------------------------------------------------
// drawBackgroundCircles(): unchanged from before
//----------------------------------------------------------------------

function drawBackgroundCircles() {
  // Circle #1: large dotted
  push();
  stroke(50);
  strokeWeight(2);
  noFill();
  drawingContext.setLineDash([1, 10]);
  ellipse(510, 585, 1000, 1000);
  drawingContext.setLineDash([]);
  pop();

  // Circle #2: medium solid (centered)
  push();
  stroke(50);
  strokeWeight(3);
  noFill();
  ellipse(width / 2, height / 2, 550, 550);
  pop();

  // Circle #3: smaller solid (right side)
  push();
  stroke(1);
  strokeWeight(1);
  noFill();
  ellipse(1700, 400, 500, 500);
  pop();
}
