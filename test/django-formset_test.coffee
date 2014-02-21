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

  test "can add form", ->
    formset = @elems.django_formset()

    equal @elems.find(".empty-form").length, 1, "there's exactly one template form"
    equal @elems.find(":visible").length, 3, "and three visible templates"

    formset.addForm()

    equal @elems.find(".empty-form").length, 1, "there's still exactly one template form"
    equal @elems.find(":visible").length, 4, "but now four visible templates"

    return

  test "adds form at the end", ->
    formset = @elems.django_formset()
    equal @elems.find(":visible:last-child").text(), "awesome test markup",
      "just checking current last form"

    formset.addForm()
    last_child = @elems.find ":visible:last-child"
    equal last_child.text(), "template",
      "first new form was added at the end"

    last_child.text "this is the form that was added first"
    equal last_child.text(), "this is the form that was added first",
      "the text of the newly added form was changed"

    formset.addForm()
    last_child = @elems.find ":visible:last-child"
    equal last_child.text(), "template",
      "second new form was added at the end"

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
