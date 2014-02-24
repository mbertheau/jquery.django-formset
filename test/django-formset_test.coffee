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
  module("jQuery#djangoFormset",

    # This will run before each test in this module.
    setup: ->
      allFixtures = $("#qunit-fixture")
      @fixtureNoTotalForms = allFixtures.find('#no-total-forms')
      @fixtureSimpleList = allFixtures.find('#simple-list')
      @fixtureSimpleTable = allFixtures.find('#simple-table')
      @fixtureDivWithForm = allFixtures.find('#div-with-form')
      return
  )

  test("throws on missing TOTAL_FORMS", ->
    throws((-> @fixtureNoTotalForms.djangoFormset(prefix: 'no-total-forms')),
      /Management form field 'TOTAL_FORMS' not found for prefix no-total-forms/,
      "throws Error")
    return
  )

  test("can add form", ->
    formset = @fixtureSimpleList.djangoFormset(prefix: 'simple-list')

    equal(@fixtureSimpleList.find(".empty-form").length, 1,
      "there's exactly one template form")
    equal(@fixtureSimpleList.find(":visible").length, 3,
      "and three visible templates")

    formset.addForm()

    equal(@fixtureSimpleList.find(".empty-form").length, 1,
      "there's still exactly one template form")
    equal(@fixtureSimpleList.find(":visible").length, 4,
      "but now four visible templates")

    return
  )

  test("adds form at the end", ->
    formset = @fixtureSimpleList.djangoFormset(prefix: 'simple-list')
    equal(@fixtureSimpleList.find(":visible:last-child").text(),
      "awesome test markup",
      "just checking current last form")

    formset.addForm()
    lastChild = @fixtureSimpleList.find(":visible:last-child")
    equal(lastChild.text(), "template",
      "first new form was added at the end")

    lastChild.text("this is the form that was added first")
    equal(lastChild.text(), "this is the form that was added first",
      "the text of the newly added form was changed")

    formset.addForm()
    lastChild = @fixtureSimpleList.find(":visible:last-child")
    equal(lastChild.text(), "template",
      "second new form was added at the end")

    return
  )

  test("adds forms to tables as new rows", ->
    formset = @fixtureSimpleTable.djangoFormset(prefix: 'simple-table')
    equal(@fixtureSimpleTable.find('tbody > tr:visible').length, 0,
      "no forms there initially")

    formset.addForm()
    equal(@fixtureSimpleTable.find('tbody > tr:visible').length, 1,
      "one row was added")

    return
  )

  test("replaces form index template and updates TOTAL_FORMS", ->
    checkFormIndex = (formset, index) ->
      equal(parseInt(formset.find('input[name="object_set-TOTAL_FORMS"]')
                            .val()), index + 1,
        "after adding one form TOTAL_FORMS is #{index + 1}")
      equal(formset.find('div:visible input[type="text"]').last().attr('name'),
        "object_set-#{index}-text",
        "the text input's name has the id #{index} in it")
      equal(formset.find('div:visible select').last().attr('name'),
        "object_set-#{index}-select",
        "the select's name has the id #{index} in it")
      equal(formset.find('div:visible textarea').last().attr('name'),
        "object_set-#{index}-textarea",
        "the textarea's name has the id #{index} in it")
      equal(formset.find('div:visible input[type="checkbox"]')
                   .last().attr('name'), "object_set-#{index}-check",
        "the checkbox input's name has the id #{index} in it")
      equal(formset.find('div:visible label').last().attr('for'),
        formset.find('div:visible input[type="checkbox"]').last().attr('id')
        "the label's for attribute has the same value as the checkbox' id
         attribute")

    formset = @fixtureDivWithForm.djangoFormset(prefix: 'object_set')
    equal(parseInt(@fixtureDivWithForm
                   .find('input[name="object_set-TOTAL_FORMS"]').val()), 0,
      "initially TOTAL_FORMS is 0")

    formset.addForm()
    checkFormIndex(@fixtureDivWithForm, 0)
    formset.addForm()
    checkFormIndex(@fixtureDivWithForm, 1)
    return
  )

  return
)(jQuery)
