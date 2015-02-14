'use strict';

var exec = require('child_process').exec,
    path = require('path'),
    fileRegex = /^\x2D{5}\s+FILE\s+:\s+(\S+)\s+\x2D{5}$/,
    errorRegex = /^Line\s(\d+),\sE:([0-9-]+):\s(.*)$/,
    abstractRegex = /^Found (\d+) errors, including (\d+) new errors, in (\d+) files \((\d+) files OK\).?$/,
    successRegex = /^(\d+) file.*no errors found.?$/,
    skippingRegex = /^Skipping (\d+) file\(s\)\.?$/;


function createError(code, description, info) {
  return {
    code: code,
    description: description,
    info: info
  };
}

function createErrorPythonNotFound(reason, err) {
  return createError(1, reason, err);
}

function createErrorGJSLintFailed(match, fails) {
  return createError(2, 'executable failed', {
    fails: fails,
    total: parseInt(match[1], 10),
    newErrors: parseInt(match[2], 10),
    filesCount: parseInt(match[3], 10),
    filesOK: parseInt(match[4], 10)
  });
}

function createParseErrorUnknown(lines) {
  return createError(3, 'parsing failed', {
    lines: lines
  });
}

function createErrorExecutingClosureLinter(fullCommand, err) {
  return createError(4, 'linter execution failed',
    fullCommand + '\n' + err);
}

function createFailObj(match) {
  return {
    file: match[1],
    errors: []
  };
}

function createErrorObj(match) {
  return {
    line: parseInt(match[1], 10),
    code: parseInt(match[2], 10),
    description: match[3]
  };
}


function createParseSuccessObj(match) {
  return {
    filesCount: parseInt(match[1], 10)
  };
}

function parseResult(text, callback) {
  var errors = [], i = 0, l, errBlock, match, matchError, matchErrorEnd, errorContent,
      text = text.replace(/\r/g, ''),
      lines = text.split('\n');

  match = skippingRegex.exec(lines[i]);
  if (match) {
    i++;
  }

  match = successRegex.exec(lines[i]);
  if (match) {
    callback(null, createParseSuccessObj(match));
    return;
  }

  for (l = lines.length; i < l; i++) {
    match = fileRegex.exec(lines[i]);
    if (match) {
      errBlock = createFailObj(match);

      matchError = errorRegex.exec(lines[++i]);
      errorContent = matchError;
      for (var j = i; errorContent && !matchErrorEnd && j++ < lines.length;) {
        matchError = errorRegex.exec(lines[j]);
        matchErrorEnd = abstractRegex.exec(lines[j]);
        if (matchError || matchErrorEnd) {
          errBlock.errors.push(createErrorObj(errorContent));
          errorContent = matchError;
        } else {
          errorContent[3] += "\n" + lines[j]
        }
      }

      i = --j;
      errors.push(errBlock);
    } else {
      match = abstractRegex.exec(lines[i]);
      if (match) {
        callback(createErrorGJSLintFailed(match, errors));
        return;
      }
    }
  }
  callback(createParseErrorUnknown(lines));

};

function execute(executable, options, callback) {
  var flags = options.flags || [],
      src = options.src || [],
      params = [],
      cmd = path.normalize('python ' + __dirname +
          '/../' + executable),
      fullCommand;

  params.push(cmd);
  params.push(flags.join(' '));
  params.push(src.join(' '));

  fullCommand = params.join(' ');

  exec(fullCommand, function(err, stdout, stderr) {
    if (err && stderr !== '') {
      callback(createErrorExecutingClosureLinter(fullCommand, stderr));
      return;
    }

    parseResult(stdout, callback);
  });
}

module.exports = function(options, callback) {
  execute(options.path, options, function(err, result) {
    callback(err, result);
  });
};
