'use strict';

/**
 *  根据 `output` 产生 webpack 插件实例
 */

const Slot = require('../core/Slot');
const parseKey = require('../helpers/parseKey');

/**
 * id format: 'module/submodule$name'
 *
 * @param {string} id
 * @param {any} loaderConfig
 * @param {any} slotOption
 * @returns
 */
function createLoader(id, loaderConfig = {}, slotOption) {
  return new Slot(id, loaderConfig, slotOption);
}

createLoader.Provider = function provider(id, loaderConfig = {}, slotOption) {
  let loader = {};
  if (loaderConfig.loader == null) {
    const { name } = parseKey(id);
    loader.loader = name;
    if (loaderConfig.options) {
      loader.options = loaderConfig.options;
    } else if (Object.keys(loaderConfig).length > 0) {
      loader.options = loaderConfig;
    }
  } else {
    loader = loaderConfig;
  }

  return new Slot(id, loader, slotOption);
};

module.exports = createLoader;
