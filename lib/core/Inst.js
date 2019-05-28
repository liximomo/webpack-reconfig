'use strict';

/**
 *  自动实例化对象
 */

const kebabCase = require('lodash.kebabcase');
const Helper = require('./Helper');
const Atom = require('./Atom');

function tryRequire(name) {
  try {
    return require(name);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return null;
    }

    throw err;
  }
}

function resolveModule(name) {
  const kebabCasedModuleName = kebabCase(name);
  let requiredModule = tryRequire(kebabCasedModuleName);

  if (requiredModule) return requiredModule;

  requiredModule = tryRequire(name);

  if (requiredModule) return requiredModule;

  throw new Error(`Can't find module "${name}".`);
}

/**
 * data: {
 *  initiator: string | function
 *  option: any
 *  options: any[]
 * }
 */
class Inst extends Helper {
  constructor(config = {}) {
    super();
    this._config = config;
  }

  output() {
    const { initiator, option, options } = this._config;

    let constructorFunc;
    if (typeof initiator === 'string' || initiator instanceof String) {
      const [moduleName, ...subModules] = initiator.split('->');
      if (process.env.NODE_ENV === 'test') {
        return this._config;
      }

      const requiredModule = resolveModule(moduleName);

      let hasError = false;
      try {
        constructorFunc = subModules.reduce((m, sub) => m[sub], requiredModule);
      } catch (error) {
        hasError = true;
      }

      if (hasError || constructorFunc === undefined) {
        throw new Error(`"${moduleName}.${subModules.join('.')}" not found.`);
      }
    } else {
      constructorFunc = initiator;
    }

    let instance;
    if (options !== undefined) {
      if (!Array.isArray(options)) {
        throw new Error('Inst.options should be an array');
      }

      instance = new constructorFunc(...options);
    } else if (option !== undefined) {
      // 显示区分 config.option 不为 undefied 的情况
      // 因为 new constructorFunc(undefined) 会造成 constructorFunc 函数内 arguments 为 [undefined]
      instance = new constructorFunc(option);
    } else {
      instance = new constructorFunc();
    }

    return new Atom(instance);
  }

  extend(obj, mergeFunc) {
    const config = mergeFunc(this._config, obj._config);
    return new Inst(config);
  }

  extendByData(data, extendFunc) {
    const config = extendFunc(this._config, data);
    return new Inst(config);
  }

  clone() {
    return new Inst(this._config);
  }
}

module.exports = Inst;
