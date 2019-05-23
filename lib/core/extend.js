'use strict';

// 基于另一个对象扩展当前配置对象
const utils = require('../utils');
const SlotMode = require('../core/Slot').Mode;
const { isWebpackHelper, isSlot } = require('../helpers/webpack-helpers');

/**
 * 扩展两个含有 slot 的 List,
 * 当期实现: 当 src 含有 slot 时才使用 slot 扩展策略, 否则直接返回 src 的副本
 * 备选策略: 只有当 obj 有 slot 时才应用 slot 扩展策略, 与 helper 扩展策略一致
 */
function mergeSlot(objSlotList, srcSlotList) {
  if (objSlotList.length <= 0) {
    return srcSlotList.slice();
  }

  let srcHasSlot = false;
  let indexCacheMap = new Map();
  const result = objSlotList.slice();
  const newSlots = [];

  // cache index
  objSlotList.forEach((s, index) => {
    if (isSlot(s)) {
      indexCacheMap.set(s.id, index);
    }
  });

  // merge same slot
  for (let index = 0; index < srcSlotList.length; index++) {
    const obj = srcSlotList[index];
    if (!isSlot(obj)) continue;

    srcHasSlot = true;
    const slot = obj;
    if (slot.mode === SlotMode.AUTO || slot.mode === SlotMode.OVERRIDE) {
      const id = slot.id;
      if (indexCacheMap.has(id)) {
        // overwrite by key
        const objIndex = indexCacheMap.get(id);
        const objSlot = objSlotList[objIndex];
        result[objIndex] = objSlot.extend(slot, extend);
      } else if (slot.mode === SlotMode.AUTO) {
        newSlots.push(slot);
      }
    } else {
      newSlots.push(slot);
    }
  }

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
    if (utils.isSameClass(objValue, srcValue)) {
      return objValue.extend(srcValue, extend);
    } else {
      return objValue.extendByData(srcValue, extend);
    }
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
  const target = argArr[0];
  let init;
  if (utils.isObject(target)) {
    init = {};
  } else if (Array.isArray(target)) {
    init = [];
  } else if (argArr[1] !== undefined) {
    return argArr[1];
  } else {
    return target;
  }

  return argArr.reduce((obj, src) => baseMergeDeep(obj, src, mergeStrategy), init);
}

module.exports = extend;
