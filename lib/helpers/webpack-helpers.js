'use strict';

const Helper = require('../core/Helper');
const Slot = require('../core/Slot');

function isWebpackHelper(any) {
  return any instanceof Helper;
}

function isSlot(any) {
  return any instanceof Slot;
}

module.exports = {
  isWebpackHelper,
  isSlot,
};
