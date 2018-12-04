assert = require '@qwant/assert'
AssertionError = assert.AssertionError

tests =

  'assert.equal': ->

    assert.throws (->
      assert.equal(true, false)
    ), AssertionError

    assert.doesNotThrow (->
      assert.equal(true, true)
    )

  'assert.hasOwnProperty': ->

    error = null

    try
      assert.hasOwnProperty(['a', 'b'], 'missing')
    catch error
      assert error instanceof AssertionError, "got #{typeof error} while expecting AssertionError"

    assert.doesNotThrow (->
      assert.hasOwnProperty(['a', 'present'], 'present')
    )

  'assert.file.contains.function': ->

    assert.throws (->
      assert.file '-missing-file-'
            .contains.function 'constant_set'
    ), AssertionError

    assert.throws (->
      assert.file 'local_modules/assert/tests/sample.js'
            .contains.function 'missing_function'
    ), AssertionError

    assert.doesNotThrow (->
      assert.file 'local_modules/assert/sample.js'
            .contains.function 'existing_function'
    )


for own name, test of tests
  console.log name
  test()