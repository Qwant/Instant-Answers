# Load JSON files from 'config/'
# see config.import()

path = require('path')
fs = require('fs')
YAML = require('js-yaml');

# TODO: comment @j.baratoux
JSON_loader = (filename) ->
  content = fs.readFileSync(filename, 'utf8')
  return JSON.parse(content)

# TODO: comment @j.baratoux
YAML_loader = (filename) ->
  content = fs.readFileSync(filename, 'utf8')
  return YAML.load(content);

###*
 * Import "config/<name>.json" and make it accessible under config[<name>].
 * If <name> reference a file nested under sub directories, the resulting variable is nested according to its directory components.
 * Example:
 * - config.import('foo') -> config['foo'] <~ "config/foo.json"
 * - config.import('foo/bar') -> config['foo']['bar'] <~ "config/foo/bar.json"
 * @param {string} name The pathname of the file to import, relative to the "config/" directory, without extension.
###
module.exports =

  import: (name) ->

    extensions =
      ".yml":  YAML_loader,
      ".yaml": YAML_loader,
      ".json": JSON_loader,

    try
      for own extension, loader of extensions
        if name.endsWith(extension)
          filename = path.join(process.cwd(), 'config', name)
          name = name.slice(0, 0 - extension.length)
          this[name] = loader(filename)
          return this[name]

      filename = path.join(process.cwd(), 'config', name + '.json')
      this[name] = JSON_loader(filename)
      return this[name]
    catch cause
      error = new Error "cannot import configuration file: #{filename}\n Caused by: #{cause.name}: #{cause.message}"
      error.cause = cause
      throw error
