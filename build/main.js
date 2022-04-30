var canvas, ctx, layercanvas, layerctx;
var wWidth = 1000;
var wHeight = 800;

var points = [];
var lines = [];

var draggingPoint = null;
var dragOffset;

var activePoints = [];
var activeLines = [];

let colorIndex = 0;

var t = 0;
var increment = 0.01;

var gameOver = true;
var pauseGame = false;

var showinterplines= false;
var showinterppoints = false;

function setup() {
  
  canvas = document.getElementById('canvas');
  if (canvas.getContext) 
      ctx = canvas.getContext('2d');
      canvas.addEventListener("mousedown", onClick, false);
      canvas.addEventListener("mouseup", onFinishedDrag, false);
      canvas.addEventListener("mousemove", dragging, false);

  layercanvas = document.getElementById('layercanvas');
  if(canvas.getContext)
      layerctx = layercanvas.getContext('2d');

  points.push(new Point(new Vector(200,200), 8));
  points.push(new Point(new Vector(500,200), 8));
  addLine();
  points.push(new Point(new Vector(500,500), 8));
  addLine();
  points.push(new Point(new Vector(350,700), 8));
  addLine();

  repopulateActives();
  draw();
  run(); //start the loops
}

function run() {
  if(!gameOver && !pauseGame) {
    update();
  }
  
  draw();

  requestAnimationFrame(run);
}

function draw() {
  clearCanvas(ctx);
  //if show points

  for(let point of activePoints) {
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

      if(showinterppoints) {
        activePoints.push(newPoints[i]);
      }

      if(i > 0) {
        let l = new Line(newPoints[i], newPoints[i-1]);
        l.setColor(colors[colorIndex]);

        if(showinterplines) {
          activeLines.push(l);
        }
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
  points.forEach(element => {
    activePoints.push(element);
  });
  lines.forEach(element => {
    activeLines.push(element);
  });
}

function clearCanvas() {
  ctx.clearRect(0,0, wWidth, wHeight);
}

function clearLayer() {
  layerctx.fillStyle = "WHITE";
  layerctx.clearRect(0,0, wWidth, wHeight);
}


function play() {
  if(points.length > 0) {
    gameOver = false;
    pauseGame = false;
  }
  if(t > 1) {
    reset();
    gameOver = false;
  }
}

function pause() {
  pauseGame = !pauseGame;
}

function reset() {
  resetCanvasToStartingPoint();
  repopulateActives();
  draw();
}

function onclear() {
  console.log("clearing");
  resetCanvasToStartingPoint();
  lines = [];
  points = [];
  activeLines = [];
  activePoints = [];
  draw();
}

function resetCanvasToStartingPoint() {
  gameOver = true;
  t = 0;
  //set slider to t;
  clearCanvas();
  clearLayer();
}

function addLine() {
  if(points.length > 0) {
      lines.push(new Line(points[points.length-1], points[points.length-2]));
      activeLines.push(lines[lines.length]);
  }
}

function flipShowInterpLines() {
  showinterplines = !showinterplines;
}

function flipShowInterpPoints() {
  showinterppoints = !showinterppoints;
}

////////////Mouse handling

function onClick(event) {
  if(gameOver) {
    let mouseVector = new Vector(event.clientX, event.clientY);
    for(let point of points) {
      if(point.isWithinBorders(mouseVector)) {
        draggingPoint = point;
        dragOffset = Vector.sub(draggingPoint.location, mouseVector);
        break;
      }
    }
    if(draggingPoint == null) {
      //create new point and drag
      point = new Point(mouseVector, 8);
      points.push(point);
      draggingPoint = point;
      dragOffset = new Vector(0,0);
      if(points.length > 1) {
        addLine();
      }
      console.log(lines);
      repopulateActives();
      draw();
    }
  }
}

function dragging(event) {
  if(draggingPoint != null && gameOver) {
    let mouseVector = new Vector(event.clientX + dragOffset.x, event.clientY + dragOffset.y);
    draggingPoint.location = mouseVector;
    repopulateActives();
    draw();
  }
}

function onFinishedDrag(event) {
  if(draggingPoint != null && gameOver) {
    draggingPoint = null;
    repopulateActives();
    draw();
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