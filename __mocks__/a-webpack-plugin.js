'use strict';

module.exports = function a(fisrt) {
  this.first = fisrt;
  this.rest = Array.prototype.slice.call(arguments, 1);
}
