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
      all_fixtures = $("#qunit-fixture")
      @fixture_simple_list = all_fixtures.find '#simple-list'
      @fixture_simple_table = all_fixtures.find '#simple-table'
      return

  test "can add form", ->
    formset = @fixture_simple_list.django_formset()

    equal @fixture_simple_list.find(".empty-form").length, 1, "there's exactly one template form"
    equal @fixture_simple_list.find(":visible").length, 3, "and three visible templates"

    formset.addForm()

    equal @fixture_simple_list.find(".empty-form").length, 1, "there's still exactly one template form"
    equal @fixture_simple_list.find(":visible").length, 4, "but now four visible templates"

    return

  test "adds form at the end", ->
    formset = @fixture_simple_list.django_formset()
    equal @fixture_simple_list.find(":visible:last-child").text(), "awesome test markup",
      "just checking current last form"

    formset.addForm()
    last_child = @fixture_simple_list.find ":visible:last-child"
    equal last_child.text(), "template",
      "first new form was added at the end"

    last_child.text "this is the form that was added first"
    equal last_child.text(), "this is the form that was added first",
      "the text of the newly added form was changed"

    formset.addForm()
    last_child = @fixture_simple_list.find ":visible:last-child"
    equal last_child.text(), "template",
      "second new form was added at the end"

    return

  test "adds forms to tables as new rows", ->
    formset = @fixture_simple_table.django_formset()
    equal @fixture_simple_table.find('tbody > tr:visible').length, 0, "no forms there initially"

    formset.addForm()
    equal @fixture_simple_table.find('tbody > tr:visible').length, 1, "one row was added"

    return

  return
) jQuery
