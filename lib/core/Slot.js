const Helper = require('./Helper');

function findSlotIndex(list, id) {
  return list.findIndex(item => item instanceof Slot && item.getId() === id);
}

'use strict';

class Slot extends Helper {
  constructor(id, data, option = {}) {
    super();
    this._id = id;
    this._data = data;
    this._option = option;
  }

  insertTo(list) {
    const slot = this;
    const { before, after, prepend } = this._option;

    if (before) {
      const index = findSlotIndex(list, before);
      if (index !== -1) {
        list.splice(index, 0, slot);
      } else {
        console.warn(`Can\'t find slot ${before}, check your "before" value.`);
      }
    } else if (after) {
      const index = findSlotIndex(list, after);
      if (index !== -1) {
        const beforeIndex = index + 1;
        // after last elment
        if (beforeIndex === list.length) {
          list.push(slot);
        } else {
          list.splice(beforeIndex, 0, slot);
        }
      } else {
        console.warn(`Can\'t find slot ${after}, check your "after" value.`);
      }
    } else if (prepend) {
      list.unshift(slot);
    } else {
      list.push(slot);
    }
  }

  getId() {
    return this._id;
  }

  output() {
    return this._data;
  }

  extend(src, extendFunc) {
    const data = extendFunc(this._data, src._data);
    const option = extendFunc(this._option, src._option);

    return new Slot(this._id, data, option);
  }

  extendByData(data, extendFunc) {
    const newData = extendFunc(this._data, data);
    return new Slot(this._id, newData, this._option);
  }

  clone() {
    return new Slot(this._id, this._data, this._option);
  }
}

module.exports = Slot;
