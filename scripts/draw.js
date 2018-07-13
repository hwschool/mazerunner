var BLOCK_SIZE = 10,
    SOLVING_SPEED = 20,
    TRAIL_LENGTH = 10;

var _drawTimers = [];

function clearDrawTimers() {
  for (var i = 0; i < _drawTimers.length; i++) {
    clearTimeout(_drawTimers[i]);
  };
};

function draw(canvas, maze, path, track, callback) {
  var context = canvas.getContext("2d");
  
  if (!path) {
    context.canvas.width = maze.width * BLOCK_SIZE;
    context.canvas.height = maze.height * BLOCK_SIZE;
    for (var y = 0; y < maze.height; y++) {
      for (var x = 0; x < maze.width; x++) {
        if (maze.matrix[y][x] === 0) {
          context.fillStyle = "#2d2d2d";
        } else {
          context.fillStyle = "#d2d2d2";
        };
        context.globalAlpha = 1;
        context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      };
    };
    
    if (typeof callback === "function") {
      callback();
    };
  } else {
    for (var i = 0; i <= path.length + TRAIL_LENGTH; i++) {
      (function (i) {
        var timer = 1000 / SOLVING_SPEED * i;
        
        _drawTimers.push(setTimeout(function () {
          for (var j = TRAIL_LENGTH - 1; j >= 0; j--) {
            if (i - j >= 0 && path[i - j]) {
              context.fillStyle = "#d2d2d2";
              context.globalAlpha = 1;
              context.fillRect(path[i - j].x * BLOCK_SIZE,
                               path[i - j].y * BLOCK_SIZE,
                               BLOCK_SIZE,
                               BLOCK_SIZE);
              context.fillStyle = "#af002d";
              context.globalAlpha = 1 - j / TRAIL_LENGTH / 2;
              context.fillRect(path[i - j].x * BLOCK_SIZE,
                               path[i - j].y * BLOCK_SIZE,
                               BLOCK_SIZE,
                               BLOCK_SIZE);
            };
          };
        }, timer));
      })(i);
    };
    if (track) {
      for (var i = 0; i <= track.length; i++) {
        (function (i) {
          var timer = 1000 / SOLVING_SPEED * (path.length + TRAIL_LENGTH) + 1000 / SOLVING_SPEED / 10 * i;
          
          _drawTimers.push(setTimeout(function () {
            if (track.length - i >= 0 && track[track.length - i]) {
              context.fillStyle = "#af002d";
              context.globalAlpha = 1;
              context.fillRect(track[track.length - i].x * BLOCK_SIZE,
                               track[track.length - i].y * BLOCK_SIZE,
                               BLOCK_SIZE,
                               BLOCK_SIZE);
            };
            if (i === track.length - 1) {
              if (typeof callback === "function") {
                callback();
              };
            };
          }, timer));
        })(i);
      };
    };
  };
};
