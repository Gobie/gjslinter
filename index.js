'use strict';

var path = require('path');
var gjslint = require('./lib/gjslint-wrapper');
var merge = require('merge');
var through = require('through2');
var gutil = require('gulp-util');
var colors = gutil.colors;
var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gjslinter';

var gjslinter = function(opts) {
  opts = merge({path: 'tools/gjslint.py'}, opts);

  function transform(file, enc, cb) {

    if (file.isStream()) {
      return cb(new PluginError(PLUGIN_NAME, 'Streaming is not supported'));
    }

    gjslint(merge(opts, {src: [file.path]}), function(err) {
      /*
       Exit codes:
       0: Linting success
       1: Python not found
       2: Linting failed
       3: Parsing failed
       4: gjslint exception
       */
      if (err && (err.code !== 0 && err.code !== 2)) {
        return cb(new PluginError(PLUGIN_NAME, err));
      }

      file.gjslinter = {
        success: !err
      };

      if (err) {
        file.gjslinter.results = err.info;
        file.gjslinter.results.errors = file.gjslinter.results.fails[0].errors;
        delete file.gjslinter.results.fails;
      }

      return cb(null, file);
    });

    return null;
  };

  return through.obj(transform);
};

gjslinter.reporter = function() {
  var indent = '  ';
  return through.obj(function (file, enc, cb) {
    var result = file.gjslinter;
    if (result.success) {
      return cb(null, file);
    }

    var relativeFilePath = path.relative(file.cwd, file.path);
    gutil.log('[' + colors.green(PLUGIN_NAME) + '] found ' + colors.yellow(result.results.total + ' errors') + ' in ' + colors.magenta(relativeFilePath));
    for (var i = 0, len = result.results.errors.length; i < len; i++) {
      var error = result.results.errors[i];
      var descriptionLines = error.description.trim().split('\n');
      console.log(indent + 'on line %s [%s] %s', error.line, error.code, colors.red(descriptionLines[0]));

      if (descriptionLines.length > 1) {
        console.log(colors.gray(indent+ descriptionLines.slice(1).join('\n' + indent).trim()));
      }
    }

    return cb(null, file);
  });
};

module.exports = gjslinter;
