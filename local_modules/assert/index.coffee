fs = require('fs')
assert = require('assert')

assert.equal = (actual, expected, message) ->
  if actual != expected
    assert.fail(actual, expected, message, '===', assert.equal);

assert.hasOwnProperty = (obj, key, message = "#{obj} is missing #{key} property") ->
  assert Object.prototype.hasOwnProperty.call(obj, key), message

assert.file = (path) ->
  exists: ->
    assert fs.existsSync(path), "no such file: #{path}"
  contains:
    function: (name) ->
      assert.file(path).exists()
      content = fs.readFileSync(path, encoding: 'utf8', flag: 'r')
      assert content.match(///function\s+#{name}\s*\(///), "#{name} function is missing from #{path}"


module.exports = assert