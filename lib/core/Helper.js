'use strict';

// 抽象实例. 所有的 helper 都要实现此接口
class Helper {
  output() {}

  // merge helper instance
  extend(helperInstance, extendFunc) {}

  extendByData(data, extendFunc) {}

  clone() {}
}

module.exports = Helper;
