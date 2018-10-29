'use strict';

const Helper = require('./Helper');

class Atom extends Helper {
  constructor(value) {
    super();
    this._value = value;
  }

  output() {
    return this._value;
  }

  // merge helper instance
  extend(helperInstance) {
    return new Atom(helperInstance._value);
  }

  extendByData(data) {
    return new Atom(data);
  }

  clone() {
    return new Atom(this._value);
  }
}

module.exports = Atom;
