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

  # This will run before each test in each module.
  moduleSetup = ->
    allFixtures = $("#qunit-fixture")
    @fixtureIDontExist = allFixtures.find('#i-dont-exist')
    @fixtureNoTemplate = allFixtures.find('#no-template')
    @fixtureNoTotalForms = allFixtures.find('#no-total-forms')
    @fixtureSimpleList = allFixtures.find('#simple-list')
    @fixtureSimpleFormAsList = allFixtures.find('#simple-form-as-list')
    @fixtureSimpleFormAsListDeleteInputInsideLabel = allFixtures.find(
      '#simple-form-as-list-delete-input-inside-label')
    @fixtureSimpleTable = allFixtures.find('#simple-table')
    @fixtureDivWithForm = allFixtures.find('#div-with-form')
    @fixtureDivWithFormOneInitial = allFixtures.find(
      '#div-with-form-one-initial')
    @fixtureDivWithNestedFormsets = allFixtures.find(
      '#div-with-nested-formsets')
    return

  module("jQuery#djangoFormset - functional tests", setup: moduleSetup)

  test("throws when jQuery selection is empty", ->
    throws((-> @fixtureIDontExist.children('li').djangoFormset()),
      /Empty selector./,
      "throws Error")
    return
  )

  test("throws on missing TOTAL_FORMS", ->
    throws((->
      @fixtureNoTotalForms.children('li').djangoFormset()),
      /Management form field 'TOTAL_FORMS' not found for prefix no-total-forms/,
      "throws Error")
    return
  )

  test("throws on missing template", ->
    throws((->
      @fixtureNoTemplate.children('li').djangoFormset()),
      /Can\'t find template \(looking for .empty-form\)/
      "throws Error")
    return
  )

  test("can add form", ->
    formset = @fixtureSimpleList.children('li').djangoFormset()

    equal(@fixtureSimpleList.find(".empty-form").length, 1,
      "there's exactly one template form")
    equal(@fixtureSimpleList.children(":visible").length, 3,
      "and three visible templates")

    formset.addForm()

    equal(@fixtureSimpleList.find(".empty-form").length, 1,
      "there's still exactly one template form")
    equal(@fixtureSimpleList.children(":visible").length, 4,
      "but now four visible templates")
    equal(@fixtureSimpleList.children(":visible").last()
      .data('djangoFormset.Form'), formset.forms[3],
      "and the Form object is available as .data('djangoFormset.Form')")

    return
  )

  test("adds form at the end", ->
    formset = @fixtureSimpleList.children('li').djangoFormset()
    equal(@fixtureSimpleList.children(":visible:last-child")
      .contents().first().text(),
      "awesome test markup",
      "just checking current last form")

    formset.addForm()
    lastChild = @fixtureSimpleList.children(":visible:last-child")
      .contents().first()
    equal(lastChild.text(), "template",
      "first new form was added at the end")

    lastChild[0].data = "this is the form that was added first"
    equal(lastChild.text(), "this is the form that was added first",
      "the text of the newly added form was changed")

    formset.addForm()
    lastChild = @fixtureSimpleList.children(":visible:last-child")
      .contents().first()
    equal(lastChild.text(), "template",
      "second new form was added at the end")

    return
  )

  test("adds forms to tables as new rows", ->
    formset = @fixtureSimpleTable.children('tbody').children('tr')
      .djangoFormset()
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

      types_and_selectors = {
        select: 'select'
        textarea: 'textarea'
        text: 'input[type="text"]'
        checkbox: 'input[type="checkbox"]'
      }
      for type, selector of types_and_selectors
        element = fixture.find("div:visible #{selector}[name$='#{type}']")
          .last()
        nameValue = element.attr('name')
        idValue = element.attr('id')

        equal(nameValue, "#{formset.prefix}-#{index}-#{type}",
          "the #{type}'s name has the id #{index} in it")

        if idValue isnt undefined
          equal(idValue, "id_#{nameValue}",
            "the #{type}'s id value is the same as name with id_ prefix")

      equal(fixture.find('div:visible label').last().attr('for'),
        fixture.find('div:visible input[type="checkbox"]').last().attr('id')
        "the label's for attribute has the same value as the checkbox' id
         attribute")

    formset = @fixtureDivWithForm.children('div').djangoFormset()
    equal(parseInt(@fixtureDivWithForm
      .find('input[name="div-with-form-TOTAL_FORMS"]').val()), 0,
      "initially TOTAL_FORMS is 0")

    formset.addForm()
    checkFormIndex(@fixtureDivWithForm, formset, 0)
    formset.addForm()
    checkFormIndex(@fixtureDivWithForm, formset, 1)
    return
  )

  test("adds delete button to existing and new forms", ->
    fixture = @fixtureDivWithFormOneInitial
    formset = fixture.children('div').djangoFormset()

    checkDeleteButton = (form) ->
      deleteButton = form.elem.children().last()
      equal(deleteButton[0].outerHTML
        '<button type="button" class="btn btn-danger"> Delete </button>',
        "Last element in form is the delete button")

      deleteName = "#{formset.prefix}-#{form.index}-DELETE"
      equal(form.elem.find("input[name='#{deleteName}']").is(':hidden'), true,
        "the DELETE input is hidden")

      equal(form.elem.find("label[for='id_#{deleteName}']").length, 0,
        "there's no label for the DELETE input")

    checkDeleteButton(formset.forms[0])

    formset.addForm()
    checkDeleteButton(formset.forms[1])

    return
  )

  test("deletes form that was added before", ->
    for fixture in [@fixtureDivWithFormOneInitial
                    @fixtureDivWithNestedFormsets]
      formset = fixture.children('div').djangoFormset()

      form = formset.addForm()
      equal(getTotalFormsValue(fixture, formset), 2,
        "for #{formset.prefix}: TOTAL_FORMS is 2 now")
      equal(form.elem.find("button:contains('Delete')").length, 1,
        "The added form has a delete button")

      formset.deleteForm(1)

      equal(fixture.children('div').length, 2,
        "for #{formset.prefix}: the added form was deleted again")
      equal(getTotalFormsValue(fixture, formset), 1,
        "for #{formset.prefix}: TOTAL_FORMS is back to 1 again")
    return
  )

  test("renumbers when deleting newly added row from the middle", ->
    formset = @fixtureDivWithForm.children('div').djangoFormset()

    formset.addForm()
    formset.addForm()
    formset.deleteForm(0)

    equal(@fixtureDivWithForm.find("input[type='text']").last().attr('name'),
      'div-with-form-0-text',
      "the text input that was at index 1 now has the name objects_set-0-text")

    return
  )

  test("figures out the form prefix itself", ->
    formset = @fixtureDivWithForm.children('div').djangoFormset()
    equal(formset.prefix, "div-with-form")

    return
  )

  test("deletes initially existing form", ->
    fixture = @fixtureDivWithFormOneInitial
    formset = fixture.children('div').djangoFormset()

    formset.deleteForm(0)

    equal(fixture
      .find("input[name='div-with-form-one-initial-0-DELETE']").val(), "on",
      "delete checkbox is now checked")
    equal(formset.forms[0].elem.is(':visible'), false,
      "removed form is now hidden")

    return
  )

  test("add - delete - add adds a one new row", ->
    fixture = @fixtureSimpleTable.children('tbody')
    formset = fixture.children('tr').djangoFormset()

    equal(fixture.children('tr:visible').length, 0,
      "initially there's 0 forms")

    formset.addForm()
    equal(fixture.children('tr:visible').length, 1,
      "after adding one there's 1")

    formset.addForm()
    equal(fixture.children('tr:visible').length, 2,
      "after adding another one there's 2")

    formset.deleteForm(1)
    equal(fixture.children('tr:visible').length, 1,
      "after deleting one it's 1 again")

    formset.addForm()
    equal(fixture.children('tr:visible').length, 2,
      "and after adding one again it's 2 again")

    formset.deleteForm(1)
    equal(fixture.children('tr:visible').length, 1,
      "after deleting one it's 1 again")

    formset.deleteForm(0)
    equal(fixture.children('tr:visible').length, 0,
      "after deleting the last one it's 0")

    formset.addForm()
    equal(fixture.children('tr:visible').length, 1,
      "and after adding one again it's 1 again")

    return
  )

  test("replaces only first prefix when adding outer forms in nested formset",
  ->
    fixture = @fixtureDivWithNestedFormsets
    formset = fixture.children('div').djangoFormset()

    formset.addForm()

    forms = fixture.children('div:visible')
    equal(forms.length, 2, "there's two visible outer forms now")
    form = forms.last()
    equal(form.find('input[type="text"]').first().attr('name'),
      "div-with-nested-formsets-1-outer",
      "outer form element has prefix correctly replaced in input name")
    nestedEmptyForm = form.find('.empty-form')
    equal(nestedEmptyForm.length, 1, "nested form template was copied as well")
    nestedInput = nestedEmptyForm.find('input[type="text"]')
    equal(nestedInput.attr('name'),
      "div-with-nested-formsets-1-variant_set-__prefix__-inner",
      "nested input in template has only first prefix replaced")

    return
  )

  test("addForm on added inner formset works", ->
    fixture = @fixtureDivWithNestedFormsets
    formset = fixture.children('div').djangoFormset()
    nestedFormset = null

    $(formset).on('formAdded', (event, form) ->
      nestedFormset = form.elem.children('div').djangoFormset()
    )

    formset.addForm()
    form = fixture.children('div:visible').last()
    equal(form.children('input[type="text"]').attr('name'),
      'div-with-nested-formsets-1-outer',
      'one form was added')

    nestedFormset.addForm()
    nestedForm = form.children('div:visible').last()
    equal(nestedForm.children('input[type="text"]').attr('name'),
      'div-with-nested-formsets-1-variant_set-0-inner',
      'added inner form input has the prefix replaced with the correct id')

    return
  )

  test("forms not marked for deletion stay that way when creating the formset",
    ->
      fixture = @fixtureSimpleFormAsList
      formset = fixture.children('ul').djangoFormset(
        formTemplateClass: "custom-template-class")

      equal(fixture.find("[name='simple-form-as-list-0-DELETE']").val(),
        '', "hidden field value is empty")

      return
  )

  test("Form without delete checkbox doesn't get delete button", ->
    fixture = @fixtureSimpleList
    formset = fixture.children('li').djangoFormset()

    equal(fixture.find("button:contains('Delete')").length, 0,
      "There are no delete buttons in the fixture")

    return
  )

  test("Form without delete checkbox can't be deleted programmatically", ->
    fixture = @fixtureSimpleList
    formset = fixture.children('li').djangoFormset()

    formset.deleteForm(1)

    equal(fixture.children('li:visible').length, 3,
      "there's still 3 visible forms")

    return
  )

  test("formInitialized is triggered for every existing and added form", ->
    fixture = @fixtureSimpleList
    formset = @fixtureSimpleList.children('li').djangoFormset(
      on:
        formInitialized: (event, form) ->
          form.myProp = "foo"
    )

    formset.addForm()

    for form, index in formset.forms
      equal(form.myProp, "foo", "Form ##{index} has the custom property set")

    return
  )

  test("adds delete button and input even if original delete input is inside
    its own label (issue #4)", ->
    fixture = @fixtureSimpleFormAsListDeleteInputInsideLabel
    formset = fixture.children('ul').djangoFormset()

    equal(fixture.find("button:contains('Delete')").length, 1,
    "Delete button is there")
    equal(formset.forms[0].field('DELETE').length, 1, "Delete input is there")

    return
  )

  return
)(jQuery)
