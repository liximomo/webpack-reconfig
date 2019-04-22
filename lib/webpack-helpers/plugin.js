'use strict';

/**
 *  根据 `output` 产生 webpack 插件实例
 */

const createSlotWrapper = require('./createSlotWrapper');
const Inst = require('../core/Inst');

/**
 *
 * @param {string} id
 * @param {{plugin: string|function, option: any; options: any[]}} pluginOption
 * @returns
 */
function createPlugin(pluginOption) {
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
  return new Inst(instConfig);
}

// createPlugin.Provider = function provider(id, pluginOption, slotOption) {
//   let instConfig;
//   if (pluginOption.plugin === null || pluginOption.plugin === undefined) {
//     instConfig = {};
//     const { name } = parseKey(id);
//     instConfig.initiator = name;
//     if (Array.isArray(pluginOption)) {
//       instConfig.options = pluginOption;
//     } else {
//       instConfig.option = pluginOption;
//     }
//   } else {
//     instConfig = {
//       ...pluginOption,
//       initiator: pluginOption.plugin,
//     };
//     delete instConfig.plugin;
//   }
//   return new Slot(id, new Inst(instConfig), slotOption);
// };

module.exports = createSlotWrapper('Plugin', createPlugin);
