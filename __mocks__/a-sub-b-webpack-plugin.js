'use strict';

module.exports = {
  b(fisrt) {
    this.first = fisrt;
    this.rest = Array.prototype.slice.call(arguments, 1);
  },
};
