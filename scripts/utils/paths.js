var path = require('path');
var fs = require('fs');

//try to detect if user is using a custom scripts version
var custom_scripts = process.env.REACT_SCRIPTS_VERSION || false;
const cs_index = process.argv.indexOf('--scripts-version');

if (cs_index > -1 && cs_index + 1 <= process.argv.length) {
  custom_scripts = process.argv[cs_index + 1];
}

//Allow custom overrides package location
const projectDir = path.resolve(fs.realpathSync(process.cwd()));
const customPath = require(path.resolve(projectDir, 'package.json'))['config-overrides-path'];
var config_overrides = customPath
  ? `${ projectDir }/${ customPath }`
  : `${ projectDir }/config-overrides`;
const co_index = process.argv.indexOf('--config-overrides');

if (co_index > -1 && co_index + 1 <= process.argv.length) {
  config_overrides = path.resolve(process.argv[co_index + 1]);
  process.argv.splice(co_index, 2);
}

const scriptVersion = custom_scripts || 'react-scripts';
const modulePath = path.join(
  require.resolve(`${scriptVersion}/package.json`),
  '..'
);

// CRA 2.1.2 switched to using a webpack config factory, but we can't do that
// comparison if using a custom scripts package, so for custom scripts assume
// we're using a webpack config factory.
// https://github.com/facebook/create-react-app/pull/5722
// https://github.com/facebook/create-react-app/releases/tag/v2.1.2
const isWebpackFactory = function(scriptPkg) {
  return custom_scripts || semver.gte(scriptPkg && scriptPkg.version, '2.1.2');
}

const paths = require(modulePath + '/config/paths');

module.exports = Object.assign({
  scriptVersion: modulePath,
  configOverrides: config_overrides,
  customScriptsIndex: (custom_scripts ? cs_index : -1),
  isWebpackFactory: isWebpackFactory,
}, paths);
