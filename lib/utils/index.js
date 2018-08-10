'use strict';

function isObject(any) {
  return Object.prototype.toString.call(any) === '[object Object]';
}

function isSameClass(a, b) {
  return a.constructor && b instanceof a.constructor;
}

module.exports = {
  isObject,
  isSameClass,
};
