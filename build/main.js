var canvas, ctx, layercanvas, layerctx;
var wWidth = 1000;
var wHeight = 800;

var points = [];
var lines = [];

var activePoints = [];
var activeLines = [];

let colorIndex = 0;

var t = 0;
var increment = 0.01;

var gameOver = false;

function setup() {
  
  canvas = document.getElementById('canvas');
  if (canvas.getContext) 
      ctx = canvas.getContext('2d');

  layercanvas = document.getElementById('layercanvas');
  if(canvas.getContext)
      layerctx = layercanvas.getContext('2d');

  points.push(new Point(new Vector(200,200)));
  points.push(new Point(new Vector(500,200)));
  points.push(new Point(new Vector(500,500)));
  points.push(new Point(new Vector(350,700)));

  run(); //start the loops
}

function run() {
  if(!gameOver) {
    update();
  }
  draw();

  requestAnimationFrame(run);
}

function draw() {
  clear(ctx);
  //if show points

  for(let point of activePoints) {
    console.log(point);
    point.draw(ctx);
  }

  for(let line of activeLines) {
    line.draw(ctx);
  }
}

function update() {
    t += increment;
    colorIndex = 0;

    repopulateActives();
    drawInterpolation(points, t);

    if (t>=1) {
      gameOver=true;
    }
}

function drawInterpolation(points, t) {
  if(points.length == 1) {
    points[0].size = 2;
    points[0].setColor("DARKGRAY");
      points[0].draw(layerctx); // draw to layered ctx;
  } else {
    getNextColor();
    
    let newPoints = [];
    for(let i = 0; i < points.length - 1; i++) {

      newPoints[i] = new Point(interpolatePoint(points[i], points[i+1],t), 8);

      //if showInterp then add to activePoints;
      activePoints.push(newPoints[i]);

      if(i > 0) {
        let l = new Line(newPoints[i].location, newPoints[i-1].location);
        l.setColor(colors[colorIndex]);

        //if show interp then add to activeLines;
        activeLines.push(l);
      }
    }

    drawInterpolation(newPoints, t);
  }
}

function interpolatePoint(a, b, t) {
let apos = a.location;
let bpos = b.location;

  return Vector.sub(bpos,apos).mult(t).add(apos);
}

function repopulateActives() {
  activePoints = [];
  activeLines = [];

  activePoints.push(...points);
  activeLines.push(...lines);
}

function clear() {
  ctx.fillStyle = "WHITE";
  ctx.fillRect(0,0, wWidth, wHeight);
}

function clearLayer() {
  layerctx.fillStyle = "WHITE";
  ctx.fillRect(0,0, wWidth, wHeight);
}

function addLine() {
  if(points.length > 0) {
    lines.push(new Line(points[points.length].location, points[points.length-1].location));
  }
}



////////////Colors

let colors = [
  "BLACK",
  "BLUE",
  "PINK",
  "PURPLE",
  "GREEN",
  "LIME"
];

function getNextColor() {
  if(colorIndex == colors.length -1) {
      colorIndex = 0;
  } else {
  colorIndex += 1;
  }
}

window.onload = setup();