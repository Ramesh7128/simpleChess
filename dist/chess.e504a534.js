// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"chess.js":[function(require,module,exports) {
// create the board
//  - 8 * 8 grid 
//  - alternate black and white cells
//      - starts with white
//  - Cell
//    - color
//    - id
//    - piece?
//  - Each square has an id
// - Arrangement of the board
//  
// create a chess object
//  - unique chess piece keys
// Pieces
//  - currentPos (rows, cols)
//  - possiblePos
//  - name
//  - color
//  - uniqueMoveLogic??
//  - move - func
// Conditions
//  - kill
//  - Check
//    - checkmate
//  - castling
var columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
var rows = [1, 2, 3, 4, 5, 6, 7, 8];
var INIT_WHITE = {
  'A1': 'rook',
  'B1': 'knight',
  'C1': 'bishop',
  D1: 'king',
  'E1': 'queen',
  'F1': 'bishop',
  'G1': 'knight',
  'H1': 'rook',
  'A2': 'pawn',
  'B2': 'pawn',
  'C2': 'pawn',
  'D2': 'pawn',
  'E2': 'pawn',
  'F2': 'pawn',
  'G2': 'pawn',
  'H2': 'pawn'
};
var INIT_BLACK = {
  'A8': 'rook',
  'B8': 'knight',
  'C8': 'bishop',
  D8: 'queen',
  'E8': 'king',
  'F8': 'bishop',
  'G8': 'knight',
  'H8': 'rook',
  'A7': 'pawn',
  'B7': 'pawn',
  'C7': 'pawn',
  'D7': 'pawn',
  'E7': 'pawn',
  'F7': 'pawn',
  'G7': 'pawn',
  'H7': 'pawn'
};
var currentMover = 'white';
var selectedPiece;
var cells = {}; // Store of truth 

function assignPiece(row, col) {
  var id = col + row;

  if (INIT_WHITE[id]) {
    return new Piece(INIT_WHITE[id], 'white', row, col);
  } else if (INIT_BLACK[id]) {
    return new Piece(INIT_BLACK[id], 'black', row, col);
  } else {
    return null;
  }
}

rows.forEach(function (row, i) {
  columns.forEach(function (col, j) {
    var cell = {
      color: (i + j) % 2 == 0 ? 'white' : 'black',
      row: row,
      col: col,
      piece: assignPiece(row, col)
    };
    cells[col + row] = cell;
  });
});

function findPossiblePawnPos(obj) {} // 2 col, 1 row
// 2 row, 1 col


function findPossibleKnightPos(obj) {
  // 'A4'
  var potentialPos = [];
  var indexOfObjCol = columns.indexOf(obj.col);
  var potentialColumns = [];
  columns.forEach(function (col, index) {
    if (Math.abs(index - indexOfObjCol) <= 2 && Math.abs(index - indexOfObjCol) !== 0) {
      potentialColumns.push(col);
    }
  });
  potentialColumns.forEach(function (col, index) {
    if (Math.abs(columns.indexOf(col) - indexOfObjCol) == 2) {
      rows.indexOf(obj.row - 1) !== -1 ? potentialPos.push(col + (obj.row - 1)) : null;
      rows.indexOf(obj.row + 1) !== -1 ? potentialPos.push(col + (obj.row + 1)) : null;
    } else {
      rows.indexOf(obj.row - 2) !== -1 ? potentialPos.push(col + (obj.row - 2)) : null;
      rows.indexOf(obj.row + 2) !== -1 ? potentialPos.push(col + (obj.row + 2)) : null;
    }
  });
  return potentialPos;
}

function findPossiblePawnPos(obj) {}

function Piece(name, color, row, col) {
  this.name = name;
  this.color = color;
  this.row = row;
  this.col = col;
  this.timesMoved = 0;
  this.possiblePositions = ['A3', 'A4']; // position - A1
  // check for validity of move
  // move.

  this.move = function (pos) {
    // TODO:check the validity of move.
    var currentPos = this.col + this.row;
    var nextPos = pos;
    this.col = nextPos.split('')[0];
    this.row = nextPos.split('')[1];
    console.log('I am supposed to move to ', nextPos, 'and my current pos is', currentPos); // empty the .piece property on the cell object

    cells[currentPos].piece = null; // set an new .piece prop on the nextPos cell obj
    // kill logic

    cells[nextPos].piece = this; // flip the currentMover

    currentMover = this.color == 'white' ? 'black' : 'white';
    selectedPiece = null;
    ++this.timesMoved;
    renderGame();
  };
}

function renderGame() {
  var htmlString = '';

  for (var cell in cells) {
    var pieceInfo = cells[cell].piece ? cells[cell].piece.color + '-' + cells[cell].piece.name : '';
    htmlString += "<div id=\"".concat(cell, "\" class=\"").concat(cells[cell].color, " cell\" data-piece=\"").concat(pieceInfo, "\"></div>");
  }

  var root = document.getElementById('chess-board');
  root.innerHTML = htmlString; //addEventListeners

  var allCells = document.querySelectorAll('.cell');
  allCells.forEach(function (cell, index) {
    cell.addEventListener('click', function () {
      if (cells[cell.id].piece && cells[cell.id].piece.color == currentMover) {
        selectedPiece = cells[cell.id].piece;
        return;
      }

      if (selectedPiece) {
        selectedPiece.move(cell.id);
      }
    });
  });
}

renderGame();
},{}],"../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "39541" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","chess.js"], null)
//# sourceMappingURL=/chess.e504a534.map