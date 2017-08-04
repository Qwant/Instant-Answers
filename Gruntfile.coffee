module.exports = (grunt, options) ->

  assert = require('assert');
  glob = require('glob').sync;
  merge = require('deepmerge');
  path = require('path');
  basename = path.basename;
  read = require('fs').readFileSync;
  write = require('fs').writeFileSync;
  gruntDotItem = {};
  gruntCopyFiles = {};
  require('load-grunt-tasks')(grunt, config: 'package.json')

  global.__root = __dirname;

  YAML_extract = (filename, symbol) ->
    try
      data = grunt.file.readYAML(filename)
      for substr in (symbol + ':').match(/[^:]+:/g)
        key = substr.replace(/:$/, '')
        data = data[key]
      return data
    catch error
      error.messages = [
        error.message
        error.origError.message
      ]
      error.message = error.messages.join('\n Caused by: ')
      throw error

  ENVIRONMENT = process.env.ENVIRONMENT || "local";

  grunt.initConfig

    'clean':
      'config': ['config/**/*.json'],
      'tmp': ['tmp/'],
      'i18n': ['tmp/po-json', 'public/js/lang/*.js', 'lang/'],
      'po_js': ['lang_src/*.po'],
      'dist': ['dist/**/**'],
      'grunt': ['Gruntfile.js', 'Gruntfile.js.map']

    'coffee':
      Gruntfile:
        options: sourceMap: true
        files:
          'Gruntfile.js': 'Gruntfile.coffee'

    'yaml2json':
      config:
        files: [
          {
            expand: true,
            cwd: 'config/',
            src: ['**/*.yml', "app.yml.#{ENVIRONMENT}"],
            dest: 'config/',
            ext: '.json'
          },
          {
            expand: true,
            cwd: 'src/modules/',
            src: ["**/*.yml.#{ENVIRONMENT}"],
            dest: 'config/',
            flatten: true,
            ext: '.json'
          }
        ]

    'preprocess':
      options:

        peg:
          include: 'grammar.js'
          patterns: [{
            match: "
              match = [[ _ quoted_expressions _ ]]
              expression = pathname:yaml_pathname _ ':' _ key:yaml_key ( _ ':' _ pairs:pairs ) ?
              pairs = pair ( _ ',' _ pair )
              pair = key:.+ _ '=' _ value:.+
              yaml_pathname = pathname yaml_extension
              yaml_extension = '.yaml' / '.yml'
              "

            replacement: (expression) ->
              data = YAML_extract(expression.pathname, expression.pathname)
              for pair in expression.pairs when pair
                data.replace(pair.key, pair.value)
              return data
          }]

        patterns: [
          {
            # [[ 'config/example.yml:foo:bar' ]]
            # [[ 'config/example.yml:foo:bar: day=night' ]]
            # [[ 'config/example.yml:foo:bar: day=night, low=high' ]]
            match: /\[\[\s*(["'])([\w.\/_ @?+:-]+ya?ml):([^\s:,'"](?:[^\s:,'"]|:[^\s:,'"])+)(?::\s([^'"]+))?\1\s*]]/g
            replacement: (match, quote, filename, symbol, patterns) ->
              data = YAML_extract(filename, symbol)
              if patterns
                for pair in patterns.split(',')
                  [search, replacement] = pair.replace(/^\s+/, '').split('=')
                  data = data.replace(search, replacement)
              if typeof data is 'string'
                return data
              else
                return JSON.stringify(data)
          },
          {
            # "/path/to/example.css?<checksum>"
            match: /([\w/.\\_+-][\w/.\\_\s+@-]*)\?<(checksum)>/g
            replacement: (match, filename, checksum) ->

              replace = (cwd, relative) ->
                try
                  checksum = sha(relative)
                  return "#{filename}?#{checksum}"
                catch error
                  error.filename = filename
                  error.match = match
                  error.file = this.file
                  error.messages = [
                    "cannot generate #{checksum} for #{match} in #{this.file.src}"
                    "cannot resolve '#{filename}' from '#{cwd}' location."
                    error.message
                  ]
                error.message = error.messages.join('\n Caused by: ')
                throw error

              if filename.match(/^\//)
                return replace(process.cwd(), filename.replace(/^\//, 'public/'))
              else
                cwd = path.dirname(this.file.dest)
                return replace(cwd, path.join(cwd, filename))
          },
          {
            # Header
            match: /(###|\/\*|<!--) Build using grunt.* (###|\*\/|-->)/
            replacement: (_, prefix, suffix) -> "#{prefix} Generated from \"#{@file.src}\" using grunt #{@nameArgs} #{suffix}"
          }
        ]

      'config':files:
        'config/languages.json': 'config/languages.json'
        'config/app.json': 'config/app.json'

    'dot': gruntDotItem,
    'copy': gruntCopyFiles,
    'concat':
      langs:
        files:
          'lang_src/fr.po': ['lang_src/common/fr.po', 'src/modules/**/lang_src/fr.po']
          'lang_src/en.po': ['lang_src/common/en.po', 'src/modules/**/lang_src/en.po']
          'lang_src/de.po': ['lang_src/common/de.po', 'src/modules/**/lang_src/de.po']
          'lang_src/co.po': ['lang_src/common/co.po', 'src/modules/**/lang_src/co.po']
          'lang_src/br.po': ['lang_src/common/br.po', 'src/modules/**/lang_src/br.po']
          'lang_src/eu.po': ['lang_src/common/eu.po', 'src/modules/**/lang_src/eu.po']
          'lang_src/ca.po': ['lang_src/common/ca.po', 'src/modules/**/lang_src/ca.po']
          'lang_src/es.po': ['lang_src/common/es.po', 'src/modules/**/lang_src/es.po']
    'watch' : {
      files: ['./src/modules/**/*.*'],
      tasks: ['build']
    }


  grunt.registerTask 'po_js', ->
    poJs = require('./src/po_js.js');
    config_pojs = require('./tasks/qwant_grunt_po_js.js')();
    poJs(grunt, config_pojs);

  grunt.registerTask 'dot-generate', ->
    gruntDotItem = require('./tasks/dot-generate')(grunt, gruntDotItem);

  grunt.registerTask 'js-generate', ->
    gruntCopyFiles = require('./tasks/js-generate')(grunt, gruntCopyFiles);

  grunt.registerTask 'images-generate', ->
    gruntCopyFiles.images = {
      expand: true,
      cwd: 'src/modules',
      src: '**/public/img/**/*.{png,jpg}',
      dest: "dist/img",
      filter: "isFile",
      rename: (dest, src) ->
        items = src.split('/')
        baseIndex = items.indexOf('img') + 1
        subPath = items.slice(baseIndex, items.length).join('/')

        fullPath = [dest, items[0], subPath].join('/');

        return fullPath;
    }

  grunt.registerTask 'default',             ['build']
  grunt.registerTask 'transpile',           ['coffee:Gruntfile']
  grunt.registerTask 'build:i18n',          ['clean:i18n', 'concat', 'po_js', 'clean:po_js']
  grunt.registerTask 'build',               ['clean:dist', 'transpile', 'build:config', 'build:i18n', 'build:templates.js']
  grunt.registerTask 'build:config',        ['clean:config', 'yaml2json:config', 'preprocess:config']
  grunt.registerTask 'build:templates.js',  ['dot-generate', 'dot', 'js-generate', 'images-generate', 'copy', 'clean:tmp']

  grunt.registerMultiTask 'preprocess', ->
    log = if grunt.option('verbose') then grunt.log.writeln else pass
    ok = grunt.log.ok
    isDir = grunt.file.isDir
    isfile = grunt.file.isFile
    task = this
    config = this.options(
      mode: false
      patterns: []
      variables: {}
    )

    process_file = (src, dest) ->
      content = grunt.file.read(src)
      process = restart = ->
        found = false
        tasks =
          variables: ->
            for search, replacement of config.variables
              content = content.replace(new RegExp(search, 'g'), (match) ->
                found = true
                log("Variable #{match} replaced by #{replacement}")
                return replacement
              )
              if found
                restart()

          patterns: ->
            for entry in config.patterns
              regexp = new RegExp(entry.match, entry.options)
              replace = entry.replacement
              if typeof replace is 'function'
                content = content.replace(regexp, (match) ->
                  found = true
                  matches = new RegExp(entry.match, entry.options).exec(match)
                  data = replace.apply(merge(task, {file: {src, dest}, re:regexp}), matches);
                  log("Pattern #{match} replaced by #{data}")
                  return data
                )
              else
                return replace
              if found
                restart()
        for own key, value of config when typeof tasks[key] is 'function'
          tasks[key](value)

      process()
      grunt.file.write(dest, content)
      ok("File #{src} -> #{dest}")

    for file in this.files
      dest = file.dest
      if Array.isArray(file.src) and file.src.length == 1
        src = file.src[0]
        process_file(src, if isDir(dest) then path.join(dest, basename(src)) else dest)
      else if Array.isArray(file.src) and file.src.length > 1 and isDir(dest)
        for src in file.src
          process_file(src, path.join(dest, basename(src)))
      else
        throw new Exception("Not implemented")

  grunt.registerTask 'i18n:unserialize-functions', ->
    for pathname in glob('lang/*.js')
      content = read(pathname).toString()
      modified = content.replace(/("getPlural"): "(function.*?})"/g, "$1: $2")
      write(pathname, modified)
      grunt.log.writeln("File #{pathname} unserialized")

as = (init) ->
  self = {}
  init.call(self)
  return self

pass = ->