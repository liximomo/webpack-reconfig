'use strict';

const base = require('./lib/webpack-helpers/base');
const Plugin = require('./lib/webpack-helpers/plugin');
const Rule = require('./lib/webpack-helpers/rule');
const Loader = require('./lib/webpack-helpers/loader');

const make = require('./lib/core/make');
const extend = require('./lib/core/extend');

module.exports = {
  Atom: base.Atom,
  Slot: base.Slot,
  Inst: base.Inst,
  Rule,
  Loader,
  Plugin,
  extend,
  make,
};
