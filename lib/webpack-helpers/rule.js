'use strict';

/**
 *  output 同 webpack 的 rule 配置, 如果 `output` 中不存在 `test`, 则自动生成规则为匹配以 `id` 为后缀的正则作为 `test`.
 */

const Slot = require('../core/Slot');

class Rule extends Slot {
  output() {
    const rule = { ...this._data };

    if (typeof rule.test === 'undefined') {
      rule.test = new RegExp(`\\.${this._id}$`);
    }

    if (rule.noTest === true) {
      delete rule.test;
      delete rule.noTest;
    }

    return rule;
  }
}

function createRule(id, rule, option) {
  return new Rule(id, rule, option);
}

module.exports = createRule;
