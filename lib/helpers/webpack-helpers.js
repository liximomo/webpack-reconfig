'use strict';

const Helper = require('../core/Helper');
const Atom = require('../core/Atom');
const Slot = require('../core/Slot');

function isWebpackHelper(any) {
  return any instanceof Helper;
}

function isSlot(any) {
  return any instanceof Slot;
}

function isAtom(any) {
  return any instanceof Atom;
}

module.exports = {
  isWebpackHelper,
  isSlot,
  isAtom,
};
