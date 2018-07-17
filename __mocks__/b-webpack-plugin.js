'use strict';

module.exports = function b(fisrt) {
  this.first = fisrt;
  this.rest = Array.prototype.slice.call(arguments, 1);
}
