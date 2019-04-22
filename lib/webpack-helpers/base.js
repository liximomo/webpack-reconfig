'use strict';

const createSlotWrapper = require('./createSlotWrapper');
const Atom = require('../core/Atom');
const Inst = require('../core/Inst');

const factoryFromConstructor = constor =>
  function(...args) {
    return new constor(...args);
  };

module.exports = {
  Atom: factoryFromConstructor(Atom),
  Inst: factoryFromConstructor(Inst),
  Slot: createSlotWrapper('Slot'),
};
