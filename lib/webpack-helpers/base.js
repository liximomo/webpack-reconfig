const Slot = require('../core/Slot');
const Inst = require('../core/Inst');

const factoryFromConstructor = constor =>
  function(...args) {
    return new constor(...args);
  };

module.exports = {
  Slot: factoryFromConstructor(Slot),
  Inst: factoryFromConstructor(Inst),
};
