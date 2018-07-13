var _zoomableElements = [];

function Zoomable(node) {
  this.node = node;
  this.zoomFactor = 0;
  
  this.scale = function () {
    var scaleFactor = Math.pow(1.5, this.zoomFactor),
        transformArray = this.node.style.transform.split(") "),
        transformString = "",
        scaled = false;
    for (var i = 0; i < transformArray.length; i++) {
      if (transformArray[i].substring(0, 5) === "scale") {
        transformString += "scale(" + scaleFactor + ")";
        scaled = true;
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
    if (!scaled) {
      transformString += " scale(" + scaleFactor + ")";
      scaled = true;
    };
    this.node.style.transform = transformString;
  };
  
  this.scale();
};

function _ontransitionend_remove(event) {
  event.target.removeEventListener("webkitTransitionEnd", _ontransitionend_remove);
  event.target.removeEventListener("transitionend", _ontransitionend_remove);
  event.target.classList.remove("_scaling");
};

function initializeZooming(element, handle) {
  handle.addEventListener("wheel", _onwheel_zoom);
  _zoomableElements.push(new Zoomable(element));
};

function _onwheel_zoom(event) {
  zoom(-Math.sign(event.deltaY));
};

function zoom(deltaZoomFactor) {
  for (var i = 0; i < _zoomableElements.length; i++) {
    _zoomableElements[i].node.classList.add("_scaling");
    _zoomableElements[i].zoomFactor += deltaZoomFactor;
    _zoomableElements[i].scale();
    _zoomableElements[i].node.addEventListener("webkitTransitionEnd", _ontransitionend_remove);
    _zoomableElements[i].node.addEventListener("transitionend", _ontransitionend_remove);
  };
};
