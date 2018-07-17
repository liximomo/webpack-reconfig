// 合并俩个 flex-webpack 配置
const mergeWith = require('lodash.mergewith');
const utils = require('../utils');
const { isWebpackHelper, isSlot } = require('../helpers/webpack-helpers');
const Helper = require('./Helper');
const Slot = require('./Slot');

function findTicketIndex(list, key) {
  return list.findIndex(value => value.key === key);
}

/**
 * 合并两个含有 slot 的 List
 */
function mergeSlot(objSlotList, srcSlotList) {
  let srcHasSlot = false;
  let indexCacheMap = new Map();
  const result = objSlotList.slice();
  const newSlots = [];

  // cache index
  objSlotList.forEach((s, index) => {
    if (isSlot(s)) {
      indexCacheMap.set(s.getId(), index);
    }
  });

  // merge same slot
  srcSlotList.forEach(s => {
    if (!isSlot(s)) return;

    srcHasSlot = true;
    const id = s.getId();
    if (indexCacheMap.has(id)) {
      // overwrite by key
      const objIndex = indexCacheMap.get(id);
      const objSlot = objSlotList[objIndex];
      result[objIndex] = objSlot.extend(s, extend);
    } else {
      newSlots.push(s);
    }
  });

  if (!srcHasSlot) {
    return srcSlotList.slice();
  }

  // insert new slot
  newSlots.forEach(s => s.insertTo(result));

  return result;
}

function mergeStrategy(objValue, srcValue) {
  if (Array.isArray(objValue) && Array.isArray(srcValue)) {
    return mergeSlot(objValue, srcValue);
  }

  if (isWebpackHelper(objValue)) {
    return objValue.extend(srcValue, extend);
  } else if (isWebpackHelper(srcValue)) {
    return srcValue.clone();
  }
}

function baseMergeDeep(object, source, customizer) {
  if (source === null || typeof source === 'undefined') {
    return object;
  }

  if (object === source) {
    return object;
  }

  // customizer only for objects
  const newValue = customizer ? customizer(object, source) : undefined;

  if (newValue !== undefined) {
    return newValue;
  }

  /* eslint-disable no-param-reassign */
  Object.keys(source).forEach(key => {
    const srcValue = object[key];
    const objValye = source[key];

    const newValue = customizer ? customizer(srcValue, objValye) : undefined;

    if (newValue !== undefined) {
      object[key] = newValue;
      return;
    }

    if (utils.isObject(srcValue) && utils.isObject(objValye)) {
      object[key] = baseMergeDeep(srcValue, objValye, customizer);
    } else if (utils.isObject(objValye)) {
      object[key] = baseMergeDeep({}, objValye, customizer);
    } else {
      object[key] = objValye;
    }
  });
  /* eslint-enable */
  return object;
}

function extend() {
  const argArr = Array.prototype.slice.call(arguments);
  return argArr.reduce((obj, src) => baseMergeDeep(obj, src, mergeStrategy));
}

module.exports = extend;
