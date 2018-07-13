var _draggableElements = {},
    _draggingElements = [];

function Draggable(node) {
  this.node = node;
  this.offsetX = 0;
  this.offsetY = 0;
  this.initialX;
  this.initialY;
  this.deltaX = 0;
  this.deltaY = 0;
  
  this.move = function () {
    var offsetX = this.offsetX + this.deltaX,
        offsetY = this.offsetY + this.deltaY,
        transformArray = this.node.style.transform.split(") "),
        transformString = "",
        moved = false;
    for (var i = 0; i < transformArray.length; i++) {
      if (transformArray[i].substring(0, 9) === "translate") {
        transformString += "translate(" + offsetX + "px, " + offsetY + "px)";
        moved = true;
      } else {
        transformString += transformArray[i];
        if (i < transformArray.length - 1) {
          transformString += ")";
        };
      };
      if (i < transformArray.length - 1) {
        transformString += " ";
      };
    };
    if (!moved) {
      transformString += " translate(" + offsetX + "px, " + offsetY + "px)";
      moved = true;
    };
    this.node.style.transform = transformString;
  };
  
  this.move();
};

function initializeDragging(element, handle) {
  _draggableElements[handle] = new Draggable(element);
  handle.addEventListener("mousedown", _onmousedown_grab);
  window.addEventListener("mouseup", _onmouseup_release);
};

function _onmousedown_grab(event) {
  var element = _draggableElements[this];
  if (element && event.button === 0) {
    element.node.classList.add("_moving");
    _draggingElements.push(element);
    element.initialX = event.clientX;
    element.initialY = event.clientY;
    element.deltaX = 0;
    element.deltaY = 0;
    document.body.style.cursor = "move";
    document.body.classList.add("-unselectable");
    window.addEventListener("mousemove", _onmousemove_drag);
  };
};

function _onmousemove_drag(event) {
  for (var i = 0; i < _draggingElements.length; i++) {
    _draggingElements[i].deltaX = event.clientX - _draggingElements[i].initialX;
    _draggingElements[i].deltaY = event.clientY - _draggingElements[i].initialY;
    _draggingElements[i].move();
  };
};

function _onmouseup_release() {
  if (_draggingElements.length) {
    while (_draggingElements.length) {
      _draggingElements[0].offsetX += _draggingElements[0].deltaX;
      _draggingElements[0].offsetY += _draggingElements[0].deltaY;
      _draggingElements[0].node.classList.remove("_moving");
      _draggingElements.splice(0, 1);
    };
    document.body.classList.remove("-unselectable");
    document.body.style.cursor = "auto";
    window.removeEventListener("mousemove", _onmousemove_drag);
  };
};
