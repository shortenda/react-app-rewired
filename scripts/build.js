process.env.NODE_ENV = 'production';

const semver = require('semver');

const { scriptVersion, isWebpackFactory } = require('./utils/paths');
const overrides = require('../config-overrides');
const scriptPkg = require(`${scriptVersion}/package.json`);

const pathsConfigPath = `${scriptVersion}/config/paths.js`;
const pathsConfig = require(pathsConfigPath);

// override paths in memory
require.cache[require.resolve(pathsConfigPath)].exports =
  overrides.paths(pathsConfig, process.env.NODE_ENV);

const webpackConfigPath = `${scriptVersion}/config/webpack.config${!isWebpackFactory(scriptPkg) ? '.prod' : ''}`;
const webpackConfig = require(webpackConfigPath);

// override config in memory
require.cache[require.resolve(webpackConfigPath)].exports = isWebpackFactory
  ? (env) => overrides.webpack(webpackConfig(env), env)
  : overrides.webpack(webpackConfig, process.env.NODE_ENV);

// run original script
require(`${scriptVersion}/scripts/build`);
