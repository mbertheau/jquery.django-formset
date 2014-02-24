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
      @fixtureIDontExist = allFixtures.find('#i-dont-exist')
      @fixtureNoTemplate = allFixtures.find('#no-template')
      @fixtureNoTotalForms = allFixtures.find('#no-total-forms')
      @fixtureSimpleList = allFixtures.find('#simple-list')
      @fixtureSimpleTable = allFixtures.find('#simple-table')
      @fixtureDivWithForm = allFixtures.find('#div-with-form')
      return
  )

  test("throws when jQuery selection is empty", ->
    throws((-> @fixtureIDontExist.djangoFormset()),
      /Empty selector./,
      "throws Error")
    return
  )

  test("throws on missing TOTAL_FORMS", ->
    throws((-> @fixtureNoTotalForms.djangoFormset(prefix: 'no-total-forms')),
      /Management form field 'TOTAL_FORMS' not found for prefix no-total-forms/,
      "throws Error")
    return
  )

  test("throws on missing template", ->
    throws((-> @fixtureNoTemplate.djangoFormset(prefix: 'no-template')),
      /Can\'t find template \(looking for .empty-form\)/
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

  getTotalFormsValue = (fixture, formset) ->
    parseInt(fixture.find("input[name='#{formset.prefix}-TOTAL_FORMS']").val())

  test("replaces form index template and updates TOTAL_FORMS", ->
    checkFormIndex = (fixture, formset, index) ->
      equal(getTotalFormsValue(fixture, formset), index + 1,
        "after adding one form TOTAL_FORMS is #{index + 1}")
      equal(fixture.find('div:visible input[type="text"]').last().attr('name'),
        "object_set-#{index}-text",
        "the text input's name has the id #{index} in it")
      equal(fixture.find('div:visible select').last().attr('name'),
        "object_set-#{index}-select",
        "the select's name has the id #{index} in it")
      equal(fixture.find('div:visible textarea').last().attr('name'),
        "object_set-#{index}-textarea",
        "the textarea's name has the id #{index} in it")
      equal(fixture.find('div:visible input[type="checkbox"]')
                   .last().attr('name'), "object_set-#{index}-check",
        "the checkbox input's name has the id #{index} in it")
      equal(fixture.find('div:visible label').last().attr('for'),
        fixture.find('div:visible input[type="checkbox"]').last().attr('id')
        "the label's for attribute has the same value as the checkbox' id
         attribute")

    formset = @fixtureDivWithForm.djangoFormset(prefix: 'object_set')
    equal(parseInt(@fixtureDivWithForm
                   .find('input[name="object_set-TOTAL_FORMS"]').val()), 0,
      "initially TOTAL_FORMS is 0")

    formset.addForm()
    checkFormIndex(@fixtureDivWithForm, formset, 0)
    formset.addForm()
    checkFormIndex(@fixtureDivWithForm, formset, 1)
    return
  )

  test("deletes form that was added before", ->
    formset = @fixtureDivWithForm.djangoFormset(prefix: 'object_set')

    formset.addForm()
    equal(getTotalFormsValue(@fixtureDivWithForm, formset), 1,
      "TOTAL_FORMS is 1 now")

    formset.deleteForm(0)

    equal(@fixtureDivWithForm.children('div:visible').length, 0,
      "the added form was deleted again")
    equal(getTotalFormsValue(@fixtureDivWithForm, formset), 0,
      "TOTAL_FORMS is back to 0 again")
    return
  )

  return
)(jQuery)
