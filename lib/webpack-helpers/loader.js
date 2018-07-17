/**
 *  根据 `output` 产生 webpack 插件实例
 */

const Slot = require('../core/Slot');
const parseKey = require('../helpers/parseKey');

/**
 * id format: 'module/submodule$name'
 *
 * @param {string} id
 * @param {any} data
 * @param {any} option
 * @returns
 */
function createLoader(id, data = {}) {
  let loaderCfg = {};
  if (data.loader == null) {
    const { name } = parseKey(id);
    loaderCfg.loader = name;
    if (data.options) {
      loaderCfg.options = data.options;
    } else if (Object.keys(data).length > 0) {
      loaderCfg.options = data;
    }
  } else {
    loaderCfg = data;
  }

  return new Slot(id, loaderCfg);
}

module.exports = createLoader;
