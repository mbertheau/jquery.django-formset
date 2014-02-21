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
      allFixtures = $("#qunit-fixture")
      @fixtureSimpleList = allFixtures.find '#simple-list'
      @fixtureSimpleTable = allFixtures.find '#simple-table'
      return

  test "can add form", ->
    formset = @fixtureSimpleList.django_formset()

    equal @fixtureSimpleList.find(".empty-form").length, 1, "there's exactly one template form"
    equal @fixtureSimpleList.find(":visible").length, 3, "and three visible templates"

    formset.addForm()

    equal @fixtureSimpleList.find(".empty-form").length, 1, "there's still exactly one template form"
    equal @fixtureSimpleList.find(":visible").length, 4, "but now four visible templates"

    return

  test "adds form at the end", ->
    formset = @fixtureSimpleList.django_formset()
    equal @fixtureSimpleList.find(":visible:last-child").text(), "awesome test markup",
      "just checking current last form"

    formset.addForm()
    lastChild = @fixtureSimpleList.find ":visible:last-child"
    equal lastChild.text(), "template",
      "first new form was added at the end"

    lastChild.text "this is the form that was added first"
    equal lastChild.text(), "this is the form that was added first",
      "the text of the newly added form was changed"

    formset.addForm()
    lastChild = @fixtureSimpleList.find ":visible:last-child"
    equal lastChild.text(), "template",
      "second new form was added at the end"

    return

  test "adds forms to tables as new rows", ->
    formset = @fixtureSimpleTable.django_formset()
    equal @fixtureSimpleTable.find('tbody > tr:visible').length, 0, "no forms there initially"

    formset.addForm()
    equal @fixtureSimpleTable.find('tbody > tr:visible').length, 1, "one row was added"

    return

  return
) jQuery
