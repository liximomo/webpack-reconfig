// 抽象实例. 所有的 helper 都要实现此接口
class Helper {
  output() {}

  // merge helper instance
  merge(helperInstance, mergeFunc) {}

  clone() {}
}

module.exports = Helper;
