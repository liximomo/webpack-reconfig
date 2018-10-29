'use strict';

/**
 *  根据 `output` 产生 webpack 插件实例
 */

// const Atom = require('../core/Atom');
const Slot = require('../core/Slot');
const Inst = require('../core/Inst');
const parseKey = require('../helpers/parseKey');

// const pluginSlotOption = {
//   output(data) {
//     return new Atom(data.output());
//   },
// };

/**
 * id format: 'module/submodule$name'
 *
 * @param {string} id
 * @param {any} data
 * @param {any} option
 * @returns
 */
function createPlugin(id, pluginOption, slotOption) {
  let instConfig;
  if (pluginOption.plugin) {
    instConfig = {
      ...pluginOption,
      initiator: pluginOption.plugin,
    };
    delete instConfig.plugin;
  } else {
    instConfig = pluginOption;
  }
  return new Slot(id, new Inst(instConfig), slotOption);
}

createPlugin.Provider = function provider(id, pluginOption, slotOption) {
  let instConfig;
  if (pluginOption.plugin === null || pluginOption.plugin === undefined) {
    instConfig = {};
    const { name } = parseKey(id);
    instConfig.initiator = name;
    if (Array.isArray(pluginOption)) {
      instConfig.options = pluginOption;
    } else {
      instConfig.option = pluginOption;
    }
  } else {
    instConfig = {
      ...pluginOption,
      initiator: pluginOption.plugin,
    };
    delete instConfig.plugin;
  }
  return new Slot(id, new Inst(instConfig), slotOption);
};

module.exports = createPlugin;
