'use strict';

const Atom = require('../core/Atom');
const Slot = require('../core/Slot');
const Inst = require('../core/Inst');

const factoryFromConstructor = constor =>
  function(...args) {
    return new constor(...args);
  };

module.exports = {
  Atom: factoryFromConstructor(Atom),
  Slot: factoryFromConstructor(Slot),
  Inst: factoryFromConstructor(Inst),
};
