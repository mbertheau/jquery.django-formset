(($) ->

  #
  #    ======== A Handy Little QUnit Reference ========
  #    http://api.qunitjs.com/
  #
  #    Test methods:
  #      module(name, {[setup][ ,teardown]})
  #      test(name, callback)
  #      expect(numberOfAssertions)
  #      stop(increment)
  #      start(decrement)
  #    Test assertions:
  #      ok(value, [message])
  #      equal(actual, expected, [message])
  #      notEqual(actual, expected, [message])
  #      deepEqual(actual, expected, [message])
  #      notDeepEqual(actual, expected, [message])
  #      strictEqual(actual, expected, [message])
  #      notStrictEqual(actual, expected, [message])
  #      throws(block, [expected], [message])
  #
  module "jQuery#django_formset",

    # This will run before each test in this module.
    setup: ->
      @elems = $("#qunit-fixture").children()
      return

  test "is chainable", ->
    expect 1

    # Not a bad test to run on collection methods.
    strictEqual @elems.django_formset(), @elems, "should be chainable"
    return

  module ":django_formset selector",

    # This will run before each test in this module.
    setup: ->
      @elems = $("#qunit-fixture").children()
      return

  test "is awesome", ->
    expect 1

    # Use deepEqual & .get() when comparing jQuery objects.
    deepEqual @elems.filter(":django_formset").get(), @elems.last().get(), "knows awesome when it sees it"
    return

  return
) jQuery
