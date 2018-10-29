'use strict';

const { isWebpackHelper, isAtom } = require('../helpers/webpack-helpers');

function traverse(obj, fn) {
  const type = Object.prototype.toString.call(obj);

  if (type === '[object Object]') {
    let result = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const element = obj[key];
        const newElement = fn(element, key);
        result[key] = traverse(newElement, fn);
      }
    }
    return result;
  } else if (type === '[object Array]') {
    return obj.map(fn);
  } else {
    return fn(obj);
  }
}

/**
 *  take a flex config, output a webpack config
 * @param {any} config
 */
function make(config) {
  if (isAtom(config)) {
    return config.output();
  } else if (isWebpackHelper(config)) {
    return make(config.output());
  }

  const type = Object.prototype.toString.call(config);

  if (type === '[object Object]') {
    let result = {};
    for (const key in config) {
      if (config.hasOwnProperty(key)) {
        const element = config[key];
        result[key] = make(element);
      }
    }
    return result;
  } else if (type === '[object Array]') {
    return config.map(make);
  } else {
    return config;
  }
}

module.exports = make;
