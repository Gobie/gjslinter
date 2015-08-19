# gjslinter

Stream wrapper to allow access to [Google Closure Linter](https://developers.google.com/closure/utilities/) from NodeJS

As Google Closure Linter is coded in python so you MUST have python installed and accessible in your PATH.

This package has bundled the Google Closure Linter v2.3.12.

## Getting Started
Install the module with:
```bash
npm install gjslinter
```

Execute the linter
```javascript
var fs = require('vinyl-fs');
var gjslinter = require('gjslinter');

fs.src('./src/**/*.js')
  .pipe(gjslinter({
    flags: ['--nojsdoc']
  }))
  .pipe(gjslinter.reporter());
```

## Flags reference
```
closure_linter.checker:
  --closurized_namespaces: Namespace prefixes, used for testing ofgoog.provide/require
    (default: '')
    (a comma separated list)
  --ignored_extra_namespaces: Fully qualified namespaces that should be not be reported as extra by the linter.
    (default: '')
    (a comma separated list)

closure_linter.common.simplefileflags:
  -e,--exclude_directories: Exclude the specified directories (only applicable along with -r or --presubmit)
    (default: '_demos')
    (a comma separated list)
  -x,--exclude_files: Exclude the specified files
    (default: 'deps.js')
    (a comma separated list)
  -r,--recurse: Recurse in to the subdirectories of the given path;
    repeat this option to specify a list of values

closure_linter.ecmalintrules:
  --custom_jsdoc_tags: Extra jsdoc tags to allow
    (default: '')
    (a comma separated list)

closure_linter.error_check:
  --jslint_error: List of specific lint errors to check. Here is a list of accepted values:
    - all: enables all following errors.
    - blank_lines_at_top_level: validatesnumber of blank lines between blocks at top level.
    - indentation: checks correct indentation of code.
    - well_formed_author: validates the @author JsDoc tags.
    - no_braces_around_inherit_doc: forbids braces around @inheritdoc JsDoc tags.
    - braces_around_type: enforces braces around types in JsDoc tags.
    - optional_type_marker: checks correct use of optional marker = in param types.
    - unused_private_members: checks for unused private variables.
    ;
    repeat this option to specify a list of values
    (default: '[]')
  --[no]strict: Whether to validate against the stricter Closure style. This includes optional_type_marker,
    well_formed_author, no_braces_around_inherit_doc, variable_arg_marker, indentation, braces_around_type,
    blank_lines_at_top_level.
    (default: 'false')

closure_linter.errorrules:
  --disable: Disable specific error. Usage Ex.: gjslint --disable 1,0011 foo.js.
    (a comma separated list)
  --ignore_errors: Disable specific error. Usage Ex.: gjslint --ignore_errors 1,0011 foo.js.
    (default: '')
    (a comma separated list)
  --[no]jsdoc: Whether to report errors for missing JsDoc.
    (default: 'true')
  --max_line_length: Maximum line length allowed without warning.
    (default: '80')
    (a positive integer)

closure_linter.gjslint:
  --additional_extensions: List of additional file extensions (not js) that should be treated as JavaScript files.
    (a comma separated list)
  --[no]beep: Whether to beep when errors are found.
    (default: 'true')
  --[no]check_html: Whether to check javascript in html files.
    (default: 'false')
  -?,--[no]help: show this help
  --[no]helpshort: show usage only for this module
  --[no]helpxml: like --help, but generates XML output
  --[no]multiprocess: Whether to attempt parallelized linting using the multiprocessing module. Enabled by default on
    Linux if the multiprocessing module is present (Python 2.6+). Otherwise disabled by default. Disabling may make
    debugging easier.
    (default: 'false')
  --[no]summary: Whether to show an error count summary.
    (default: 'false')
  --[no]time: Whether to emit timing statistics.
    (default: 'false')
  --[no]unix_mode: Whether to emit warnings in standard unix format.
    (default: 'false')

closure_linter.indentation:
  --[no]debug_indentation: Whether to print debugging information for indentation.
    (default: 'false')

closure_linter.runner:
  --[no]error_trace: Whether to show error exceptions.
    (default: 'false')
  --limited_doc_files: List of files with relaxed documentation checks. Will not report errors for missing
    documentation, some missing descriptions, or methods whose @return tags don't have a matching return statement.
    (default: 'dummy.js,externs.js')
    (a comma separated list)

gflags:
  --flagfile: Insert flag definitions from the given file into the command line.
    (default: '')
  --undefok: comma-separated list of flag names that it is okay to specify on the command line even if the program does
    not define a flag with that name. IMPORTANT: flags in this list that have arguments MUST use the --flag=value
    format.
    (default: '')
```

