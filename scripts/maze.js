var _maze;

function Matrix(width, height) {
  this.matrix = [];
  this.width = width;
  this.height = height;
};

function Position(x, y) {
  this.x = x;
  this.y = y;
  
  this.replicates = function (position) {
    var check;
    
    if (this.x === position.x && this.y === position.y) {
      check = true;
    } else {
      check = false;
    };
    
    return check;
  };
};

function generateMaze(width, height, canvas, executeBefore, executeAfter) {
  if (typeof executeBefore === "function") {
    executeBefore();
  };
  
  createMatrix(width, height);
  createPaths();
  clearDrawTimers();
  draw(canvas, _maze);
  
  if (typeof executeAfter === "function") {
    executeAfter();
  };
};

function solveMaze(canvas, executeBefore, executeAfter) {
  if (typeof executeBefore === "function") {
    executeBefore();
  };
  
  var currentPosition = new Position(0, 1),
      selector = _maze.matrix[1][1],
      endPosition = new Position(_maze.width - 1, _maze.height - 2),
      paths = findPaths(false, currentPosition, 1, selector, endPosition);
      path = paths[0];
      track = paths[1];
      
  draw(canvas, _maze, path, track, executeAfter);
};

function createMatrix(width, height) {
  _maze =  new Matrix(width, height);
  for (var y = 0; y < _maze.height; y++) {
    var matrixLine = [];
    for (var x = 0; x < _maze.width; x++) {
      if ((x + 1) % 2 || (y + 1) % 2) {
        matrixLine.push(0);
      } else {
        matrixLine.push(1);
      };
    };
    _maze.matrix.push(matrixLine);
  };
};

function createPaths() {
  var currentPosition = new Position(1, 1),
      selector = _maze.matrix[1][1];
      
  findPaths(true, currentPosition, 2, selector);
  _maze.matrix[1][0] = selector + 1;
  _maze.matrix[_maze.height - 2][_maze.width - 1] = selector + 1;
};

function findPaths(creatingPaths, currentPosition, step, selector, endPosition) {
  var paths,
      path = [],
      track = [];
      
  do {
    var nextPosition = getNextPosition(currentPosition, step, selector, endPosition);
    
    _maze.matrix[currentPosition.y][currentPosition.x] = selector + 1;
    path.push(currentPosition);
    if (nextPosition) {
      track.push(currentPosition);
      if (creatingPaths) {
        createPath(currentPosition, nextPosition, selector + 1);
      };
      currentPosition = nextPosition;
    } else {
      currentPosition = track.pop();
    };
  } while (track.length > 0 && currentPosition !== endPosition);
  _maze.matrix[currentPosition.y][currentPosition.x] = selector + 1;
  path.push(currentPosition);
  if (track.length > 0) {
    track.push(currentPosition);
  };
  paths = [path,
           track];
  
  return paths;
};

function getNextPosition(position, step, selector, endPosition) {
  var availablePositions = [],
      nextPosition;
      
  if (position.x - step >= 0 && _maze.matrix[position.y][position.x - step] === selector) {
    availablePositions.push(new Position(position.x - step, position.y));
  };
  if (position.x + step < _maze.width && _maze.matrix[position.y][position.x + step] === selector) {
    availablePositions.push(new Position(position.x + step, position.y));
  };
  if (position.y - step >= 0 && _maze.matrix[position.y - step][position.x] === selector) {
    availablePositions.push(new Position(position.x, position.y - step));
  };
  if (position.y + step < _maze.height && _maze.matrix[position.y + step][position.x] === selector) {
    availablePositions.push(new Position(position.x, position.y + step));
  };
  if (availablePositions.length > 0) {
    if (endPosition) {
      for (var i = 0; i < availablePositions.length; i++) {
        if (availablePositions[i].replicates(endPosition)) {
          nextPosition = endPosition;
        };
      };
    };
    if (!nextPosition) {
      nextPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    };
  };
  
  return nextPosition;
};

function createPath(startPosition, endPosition, type) {
  var deltaX = (endPosition.x - startPosition.x) / 2,
      deltaY = (endPosition.y - startPosition.y) / 2;
      
  _maze.matrix[startPosition.y + deltaY][startPosition.x + deltaX] = type;
};
