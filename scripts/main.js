var _application = new Application();
    _invalidInputValuesCount = 0;

function Application() {
  var possibleStates = ["initial",
                        "ready",
                        "generating",
                        "generated",
                        "solving",
                        "solved"],
      currentState = "initial";
  
  this.setState = function (state) {
    currentState = state;
    if (this.hasPassedState("generating")) {
      document.querySelector(".panel.information").classList.add("-hidden");
    };
    if (this.hasPassedState("generated", "solving")) {
      initializeDragging(document.querySelector("canvas"),
                         document.querySelector(".map"));
      initializeZooming(document.querySelector("canvas"),
                        document.querySelector(".map"));
      document.title = "GENERATED | Maze Generator"
    };
    if (this.hasPassedState("solving")) {
      document.title = "SOLVING | Maze Generator";
    };
    if (this.hasPassedState("solved")) {
      document.title = "SOLVED | Maze Generator";
    };
    updateButtons();
  };
  
  this.hasPassedState = function (bottomState, topState) {
    var check;
    
    if (possibleStates.indexOf(currentState) >= possibleStates.indexOf(bottomState)) {
      check = true;
    } else {
      check = false;
    };
    if (topState && possibleStates.indexOf(currentState) >= possibleStates.indexOf(topState)) {
      check = false;
    };
    return check;
  };
};
document.addEventListener("DOMContentLoaded", _onready_initialize);

function _onready_initialize() {
  initializeInputs();
  initializeButtons();
  _application.setState("ready");
};

function initializeInputs() {
  var inputs = document.querySelectorAll("input");
  inputs[0].autofocus = true;
  for (var i = 0; i < inputs.length; i++) {
    validateInputValue(inputs[i]);
    inputs[i].addEventListener("input", _oninput_validate);
  };
};

function initializeButtons() {
  var buttons = document.querySelectorAll("button");
  for (var i = 0; i < buttons.length; i++) {
    if (!_application.hasPassedState("ready")) {
      buttons[i].addEventListener("click", _onclick_activate);
    };
  };
}

function validateInputValue(input) {
  if (input.value === String(Math.floor(input.value)) && input.value > 0) {
    if (input.classList.contains("_invalid")) {
      input.classList.remove("_invalid");
      _invalidInputValuesCount--;
    };
  } else if (!input.classList.contains("_invalid")) {
    input.classList.add("_invalid");
    _invalidInputValuesCount++;
  };
};

function _oninput_validate(event) {
  validateInputValue(event.target);
  updateButtons();
};

function updateButtons() {
  var buttons = document.querySelectorAll("button");
  
  for (var i = 0; i < buttons.length; i++) {
    updateButton(buttons[i]);
  };
};

function updateButton(button) {
  if (button.name === "generate") {
    if (_invalidInputValuesCount !== 0) {
      button.classList.add("_disabled");
    } else {
      button.classList.remove("_disabled");
    };
  } else if (button.name === "solve") {
    if (_application.hasPassedState("initial")) {
      button.classList.add("_disabled");
      button.innerHTML = "SOLVE";
    };
    if (_application.hasPassedState("generated")) {
      button.classList.remove("_disabled");
    };
    if (_application.hasPassedState("solving")) {
      button.classList.add("_disabled");
      button.innerHTML = "SOLVING";
    };
    if (_application.hasPassedState("solved")) {
      button.innerHTML = "SOLVED";
    };
  } else {
    if (_application.hasPassedState("initial")) {
      button.classList.add("_disabled");
    };
    if (_application.hasPassedState("generated")) {
      button.classList.remove("_disabled");
    };
  };
};

function _onclick_activate(event) {
  if (event.target.name === "generate") {
    if (_application.hasPassedState("ready") && _invalidInputValuesCount === 0) {
      generateMaze(document.querySelector("input[name='width']").value * 2 + 1,
                   document.querySelector("input[name='height']").value * 2 + 1,
                   document.querySelector("canvas"),
                   function () {
                     _application.setState("generating");
                   },
                   function () {
                    _application.setState("generated");
                   });
    };
  } else if (event.target.name === "solve") {
    if (_application.hasPassedState("generated", "solving")) {
      solveMaze(document.querySelector("canvas"),
                function () {
                  _application.setState("solving");
                },
                function () {
                  _application.setState("solved");
                });
    };
  } else if (event.target.name === "zoom-in") {
    zoom(1);
  } else if (event.target.name === "zoom-out") {
    zoom(-1);
  };
};
