process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const semver = require('semver');

const { scriptVersion, isWebpackFactory } = require('./utils/paths');
const overrides = require('../config-overrides');
const scriptPkg = require(`${scriptVersion}/package.json`);

const pathsConfigPath = `${scriptVersion}/config/paths.js`;
const pathsConfig = require(pathsConfigPath);

// override paths in memory
require.cache[require.resolve(pathsConfigPath)].exports =
  overrides.paths(pathsConfig, process.env.NODE_ENV);

const webpackConfigPath = `${scriptVersion}/config/webpack.config${!isWebpackFactory(scriptPkg) ? '.dev' : ''}`;
const devServerConfigPath = `${scriptVersion}/config/webpackDevServer.config.js`;
const webpackConfig = require(webpackConfigPath);
const devServerConfig = require(devServerConfigPath);

// override config in memory
require.cache[require.resolve(webpackConfigPath)].exports = isWebpackFactory
  ? (env) => overrides.webpack(webpackConfig(env), env)
  : overrides.webpack(webpackConfig, process.env.NODE_ENV);

require.cache[require.resolve(devServerConfigPath)].exports =
  overrides.devServer(devServerConfig, process.env.NODE_ENV);

// run original script
require(`${scriptVersion}/scripts/start`);
