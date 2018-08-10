'use strict';

const KEY_SPILT_SYMBOL = '#';

function parseKey(key) {
  let name = key;
  let variant;

  const index = key.indexOf(KEY_SPILT_SYMBOL);
  if (index !== -1) {
    name = key.substring(0, index);
    variant = key.slice(index + 1);
  }

  return {
    name,
    variant,
  }
}

module.exports = parseKey;
