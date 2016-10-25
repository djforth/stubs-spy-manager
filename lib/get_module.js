"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (Module) {
  return function (mod) {
    return Module.__get__(mod);
  };
};

module.exports = exports["default"];