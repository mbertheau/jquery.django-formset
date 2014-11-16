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
    @fixtureTabsNoInitialForms = allFixtures.find('#tabs-no-initial-forms')
    @fixtureTabsWithFormThreeInitial = allFixtures.find(
      '#tabs-with-form-three-initial')
    @fixtureTabsWithoutNav = allFixtures.find('#tabs-without-tab-nav')
    @fixtureTabsNoTabTemplate = allFixtures.find('#tabs-no-tab-template')
    return

  module("jQuery#djangoFormset - functional tests", setup: moduleSetup)

  test("Throws on missing tab activator if form template is .tab-pane", ->
    throws((->
      @fixtureTabsWithoutNav.find('.tabs-content > div').djangoFormset()),
      /Template is .tab-pane but couldn't find corresponding tab activator./
      "Complains about missing tab activator")
    return
  )

  test("Throws on missing tab template", ->
    throws((->
      @fixtureTabsNoTabTemplate.find('.tabs-content > div').djangoFormset()),
      /Tab nav template not found \(looking for .empty-form\)./
      "Complains about missing tab template")
    return
  )

  test("Adds new tab pane and new tab nav after the last form", ->
    fixture = @fixtureTabsWithFormThreeInitial
    formset = fixture.find('.tabs-content').children().djangoFormset()

    lastTabPane = fixture.find('.content').last()
    lastTabNav = fixture.find("[href='##{lastTabPane.attr('id')}']")
      .closest('[data-tab] > *')

    formset.addForm()

    equal(lastTabPane.next().attr('id'),
      'id_tabs-with-form-three-initial-3',
      "tab pane with id 3 was added")

    equal(lastTabNav.next().find('a').attr('href'),
      '#id_tabs-with-form-three-initial-3',
      "the last tab activates the newly added tab pane")

    equal(fixture.find('[data-tab]').children('.active').find("a")
      .attr('href'), '#id_tabs-with-form-three-initial-3',
      "the new tab pane is active")

    return
  )

  test("deleting first initially existing form activates following tab header",
    ->
      fixture = @fixtureTabsWithFormThreeInitial
      formset = fixture.find('.tabs-content').children().djangoFormset()

      activeTab = fixture.find('[data-tab]').children('.active')
      formset.deleteForm(0)

      equal(activeTab.filter('.active').length, 0,
        "first tab header is not active anymore")

      activeTab = fixture.find('[data-tab]').children('.active')
      equal(activeTab.find("[data-toggle='tab']").attr('href'),
        "#id_tabs-with-form-three-initial-1",
        "following tab header is now active")

      return
  )

  test("deleting middle initially existing form activates following tab header",
  ->
    fixture = @fixtureTabsWithFormThreeInitial
    formset = fixture.find('.tabs-content').children().djangoFormset()
    fixture.find("[data-tab] :visible [data-toggle='tab']").eq(1).trigger('click')

    activeTab = fixture.find('[data-tab]').children('.active')
    formset.deleteForm(1)

    equal(activeTab.is('.active'), false,
      "previously active tab header is now not active")

    activeTab = fixture.find('[data-tab]').children('.active')
    equal(activeTab.find("[data-toggle='tab']").attr('href'),
      "#id_tabs-with-form-three-initial-2",
      "now active tab header is the preceding one")

    return
  )

  test("deleting last initially existing form activates preceding tab header",
  ->
    fixture = @fixtureTabsWithFormThreeInitial
    formset = fixture.find('.tabs-content').children().djangoFormset()
    fixture.find("[data-tab] :visible [data-toggle='tab']").last().trigger('click')

    activeTab = fixture.find('[data-tab]').children('.active')
    formset.deleteForm(2)

    equal(activeTab.filter('.active').length, 0,
      "previously active tab header is now not active")

    activeTab = fixture.find('[data-tab]').children('.active')
    equal(activeTab.find("[data-toggle='tab']").attr('href'),
      "#id_tabs-with-form-three-initial-1",
      "now active tab header is the preceding one")

    return
  )

  test("deleting the only tab deletes the tab header as well", ->
    fixture = @fixtureTabsWithFormThreeInitial
    formset = fixture.find('.tabs-content').children().djangoFormset()

    formset.deleteForm(2)
    formset.deleteForm(1)
    formset.deleteForm(0)

    equal(fixture.find('[data-tab]').children("[data-toggle='tab']:visible").length,
      0, "no tab headers are visible")

    return
  )

  test('deleting new form hides current tab and activates following tab', ->
    fixture = @fixtureTabsWithFormThreeInitial
    formset = fixture.find('.tabs-content').children().djangoFormset()
    fixture.find("[data-tab] :visible [data-toggle='tab']").last().trigger('click')

    formset.addForm()
    formset.addForm()
    fixture.find("[data-tab] :visible [data-toggle='tab']").eq(3).trigger('click')
    formset.deleteForm(3)

    activeTab = fixture.find('[data-tab]').children('.active')
    equal(activeTab.find("[data-toggle='tab']").attr('href'),
      "#id_tabs-with-form-three-initial-3",
      "following tab header is now active")

    return
  )

  test("deleting a non-active tab doesn't change the active tab", ->
    fixture = @fixtureTabsWithFormThreeInitial
    formset = fixture.find('.tabs-content').children().djangoFormset()

    activeTab = fixture.find('[data-tab]').children('.active')
    formset.deleteForm(1)

    activeTab = fixture.find('[data-tab]').children('.active')
    equal(activeTab.find("[data-toggle='tab']").attr('href'),
      "#id_tabs-with-form-three-initial-0",
      "active tab header is still the same")

    return
  )

  test("Adding a new form to a tabbed formset without initial
    forms works", ->
    fixture = @fixtureTabsNoInitialForms
    formset = fixture.find('.tabs-content > *').djangoFormset()

    formset.addForm()

    equal(fixture.find('[data-tab]').children(':visible').length, 1,
      "there's one visible tab")

    equal(fixture.find('.tabs-content').children(':visible').length, 1,
      "there's one visible tab pane")

    return
  )

  test("Initially deleted form is hidden right away", ->
    fixture = @fixtureTabsWithFormThreeInitial
    fixture.find("input[name='tabs-with-form-three-initial-1-DELETE']")
      .prop('checked', true)
    formset = fixture.find('.tabs-content').children().djangoFormset()

    equal(fixture.find("[data-tab] a[href='#id_tabs-with-form-three-initial-1']")
      .closest('[data-tab] > *').is(':visible'), false,
      "the tab header of the deleted form is not visible")

    equal(fixture.find("[name='tabs-with-form-three-initial-1-DELETE']").val(),
      "on", "the DELETE element has the value 'on'")

    return
  )

  test("Form and Tab class can be replaced with a customized version", ->
    class MyForm extends $.fn.djangoFormset.Form

      getDeleteButton: ->
        $('<button type="button" class="btn btn-danger my-delete-button-class">
             Delete
           </button>')

    class MyTab extends $.fn.djangoFormset.Tab

      constructor: (@elem) ->
        super
        @elem.data('mycustomdata', this)

    fixture = @fixtureTabsWithFormThreeInitial
    formset = fixture.find('.tabs-content').children()
      .djangoFormset(formClass: MyForm, tabClass: MyTab)
    formset.addForm()

    equal(fixture.find("button.my-delete-button-class:contains('Delete')")
      .last().length, 1, "The custom getDeleteButton method was used")
    tab = formset.forms[0].tab
    equal(tab.elem.data('mycustomdata'), tab, "The custom Tab class was used")
    return
  )
  return
)(jQuery)
