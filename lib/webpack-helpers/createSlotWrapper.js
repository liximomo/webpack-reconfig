const Slot = require('../core/Slot');

function createSlotFactory(name = 'AnonymousSlotFactory', dataProcessor) {
  const createSlot = dataProcessor
    ? (id, data, type, options) => new Slot(id, dataProcessor(data), type, options)
    : (id, data, type, options) => new Slot(id, data, type, options);

  const factory = (id, data) => {
    return createSlot(id, data, Slot.Mode.AUTO);
  };
  factory.name = name;

  factory.override = function override(id, data) {
    return createSlot(id, data, Slot.Mode.OVERRIDE);
  };

  factory.prepend = function prepend(id, data) {
    return createSlot(id, data, Slot.Mode.PREPEND);
  };

  factory.append = function append(id, data) {
    return createSlot(id, data, Slot.Mode.APPEND);
  };

  factory.insertBefore = function insertBefore(anchor, id, data) {
    return createSlot(id, data, Slot.Mode.INSERT_BEFORE, {
      insertAnchor: anchor,
    });
  };

  factory.insertAfter = function insertAfter(anchor, id, data) {
    return createSlot(id, data, Slot.Mode.INSERT_AFTER, {
      insertAnchor: anchor,
    });
  };

  return factory;
}
module.exports = createSlotFactory;
