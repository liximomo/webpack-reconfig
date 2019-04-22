const Helper = require('./Helper');

function findSlotIndex(list, id) {
  return list.findIndex(item => item instanceof Slot && item.id === id);
}

class Slot extends Helper {
  constructor(id, data, mode = Slot.Mode.AUTO, options = {}) {
    super();
    this._id = id;
    this._data = data;
    this._mode = mode;
    this._options = options;
  }

  get id() {
    return this._id;
  }

  get mode() {
    return this._mode;
  }

  as(newId) {
    this._id = newId;
    return this;
  }

  insertTo(list) {
    const slot = this;
    let index;

    switch (this._mode) {
      case Slot.Mode.INSERT_BEFORE:
        const before = this._options.insertAnchor;
        index = findSlotIndex(list, before);
        if (index !== -1) {
          list.splice(index, 0, slot);
        } else {
          console.warn(`Can\'t find slot ${before}, check your "before" value.`);
        }
        break;
      case Slot.Mode.INSERT_AFTER:
        const after = this._options.insertAnchor;
        index = findSlotIndex(list, after);
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
        break;
      case Slot.Mode.PREPEND:
        list.unshift(slot);
        break;
      case Slot.Mode.AUTO:
      case Slot.Mode.APPEND:
        list.push(slot);
        break;
      default:
        // do nothing
        break;
    }
  }

  output() {
    // if (this._option.output) {
    //   return this._option.output(this._data);
    // }

    return this._data;
  }

  extend(src, extendFunc) {
    const data = extendFunc(this._data, src._data);
    // const options = extendFunc(this._options, src._options);

    return new Slot(this._id, data, this._mode, this._options);
  }

  extendByData(data, extendFunc) {
    const newData = extendFunc(this._data, data);
    return new Slot(this._id, newData, this._mode, this._options);
  }

  clone() {
    return new Slot(this._id, this._data, this._mode, this._options);
  }
}

Slot.Mode = {
  AUTO: 1, // 有相同 id 的 slot 则覆盖, 无则同 APPEND 模式
  OVERRIDE: 2, // 只 override, 无相同 id 时什么也不做
  PREPEND: 3, // 插入到最前方
  APPEND: 4, // 插入到最后方
  INSERT_BEFORE: 5, // 插入到指定 id 的 slot 前
  INSERT_AFTER: 6, // 插入到指定 id 的 slot 后
};

module.exports = Slot;
