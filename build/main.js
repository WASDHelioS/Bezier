var canvas, ctx;
var wWidth = 1000;
var wHeight = 800;

var points = [];
var lines = [];

var draggingPoint = null;
var dragOffset;

var activePoints = [];
var activeLines = [];

var currentBezier = [];

let colorIndex = 0;

var t = 0;
var increment = 0.005;

var gameOver = true;
var pauseGame = false;

var showinterplines= false;
var showinterppoints = false;

var showlines = true;
var showpoints = true;

var boundingrect;

function setup() {
  
  canvas = document.getElementById('canvas');
  if (canvas.getContext) 
      ctx = canvas.getContext('2d');
      canvas.addEventListener("mousedown", onClick, false);
      canvas.addEventListener("mouseup", onFinishedDrag, false);
      canvas.addEventListener("mousemove", dragging, false);

  boundingrect = canvas.getBoundingClientRect();

  points.push(new Point(new Vector(200,200), 8));

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
    if(!showpoints && showinterppoints) {
      if(!points.includes(point)) {
        point.draw(ctx);
      }
    } else if(showpoints && !showinterppoints) {
      if(points.includes(point)) {
        point.draw(ctx);
      }
    } else if(showpoints && showinterppoints) {
        point.draw(ctx);
    }
  }

  for(let line of activeLines) {
    if(!showlines && showinterplines) {
      if(!lines.includes(line)) {
        line.draw(ctx);
      }
    } else if(showlines && !showinterplines) {
      if(lines.includes(line)) {
        line.draw(ctx);
      }
    } else if(showlines && showinterplines) {
      line.draw(ctx);
    }
  }
  drawBezier();
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

function drawBezier() {
  for(let i = 0; i < currentBezier.length-1; i++) {
      ctx.strokeStyle = "BLACK";
      ctx.beginPath();
      ctx.moveTo(currentBezier[i].location.x, currentBezier[i].location.y);
      ctx.lineTo(currentBezier[i+1].location.x, currentBezier[i+1].location.y);
      ctx.closePath();
      ctx.stroke();
  }
}

function drawInterpolation(points, t) {
  if(points.length == 1) {
    points[0].size = 2;
    points[0].setColor("DARKGRAY");
    currentBezier.push(points[0]);
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
  currentBezier = [];
  repopulateActives();
  draw();
}

function onclear() {
  resetCanvasToStartingPoint();
  lines = [];
  points = [];
  currentBezier = [];
  activeLines = [];
  activePoints = [];
  draw();
}

function resetCanvasToStartingPoint() {
  gameOver = true;
  t = 0;
  //set slider to t;
  clearCanvas();
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

function flipShowLines() {
  showlines = !showlines;
}

function flipShowPoints() {
  showpoints = !showpoints;
}

////////////Mouse handling

function onClick(event) {
  if(gameOver) {
    let mouseVector = new Vector(event.clientX - boundingrect.left, event.clientY - boundingrect.top);
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
      repopulateActives();
      draw();
    }
  }
}

function dragging(event) {
  if(draggingPoint != null && gameOver) {
    let mouseVector = new Vector(event.clientX + dragOffset.x - boundingrect.left, event.clientY + dragOffset.y - boundingrect.top);
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