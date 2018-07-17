function isObject(any) {
  return Object.prototype.toString.call(any) === '[object Object]';
}

module.exports = {
  isObject,
};
