'use strict';

/**
 *  根据 `output` 产生 webpack 插件实例
 */

const Slot = require('../core/Slot');
const Inst = require('../core/Inst');
const parseKey = require('../helpers/parseKey');

/**
 * id format: 'module/submodule$name'
 *
 * @param {string} id
 * @param {any} data
 * @param {any} option
 * @returns
 */
function createPlugin(id, pluginOption, slotOption) {
  const instConfig = { ...pluginOption };
  if (instConfig.initiator == null) {
    const { name } = parseKey(id);
    instConfig.initiator = name;
  }

  return new Slot(id, new Inst(instConfig), slotOption);
}

module.exports = createPlugin;
