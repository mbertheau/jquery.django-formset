#
# * django-formset
# * https://github.com/mbertheau/jquery.django-formset
# *
# * Copyright (c) 2014 Markus Bertheau
# * Licensed under the MIT license.
#

class FormsetError extends Error

(($) ->

  $.fn.djangoFormset = (options) ->
    new $.fn.djangoFormset.Formset(this, options)

  class $.fn.djangoFormset.Formset
    constructor: (base) ->
      if base.length == 0
        throw new FormsetError("Empty selector.")

      @template = base.filter(".empty-form")
      if @template.length == 0
        throw new FormsetError("Can't find template (looking for .empty-form)")

      inputName = @template.find("input,select,textarea").first().attr('name')
      if not inputName
        throw new FormsetError("Can't figure out form prefix because there's no
                                form element in the form template. Please add
                                one.")
      placeholderPos = inputName.indexOf('-__prefix__')
      if placeholderPos == -1
        throw new FormsetError("Can't figure out form prefix from template
                                because it doesn't contain '-__prefix__'.")
      @prefix = inputName.substring(0, placeholderPos)

      @totalForms = $("#id_#{@prefix}-TOTAL_FORMS")
      if @totalForms.length == 0
        throw new FormsetError("Management form field 'TOTAL_FORMS' not found
                                for prefix #{@prefix}.")

      @_initTabs()

      @forms = base.not('.empty-form').map((index, element) =>
        tab = null
        if @hasTabs
          tabActivator = $.djangoFormset.getTabActivator(element.id)
          tab = new $.fn.djangoFormset.Tab(tabActivator.closest('.nav > *'))
        new $.fn.djangoFormset.Form($(element), this, index, tab))

      if @forms.length != parseInt(@totalForms.val())
        console.error("TOTAL_FORMS is #{@totalForms.val()}, but #{@forms.length}
                      non-template elements found in passed selection.")

      @initialForms = @forms.length

      @insertAnchor = base.not('.empty-form').last()
      if @insertAnchor.length == 0
        @insertAnchor = @template

      return

    _initTabs: ->
      @hasTabs = @template.is('.tab-pane')
      if not @hasTabs
        return

      tabNav = $.djangoFormset.getTabActivator(@template.attr('id'))
        .closest('.nav')
      #if tabNav.length == 0
      #  throw new FormsetError("Template is .tab-pane but couldn't find
      #                          corresponding .nav.")

      @tabTemplate = tabNav.children('.empty-form')
      #if @tabTemplate.length == 0
      #  throw new FormsetError("Tab nav template not found (looking for
      #                          .empty-form).")

      return

    addForm: ->
      if @hasTabs
        newTabElem = @tabTemplate.clone().removeClass("empty-form")
        newTab = new $.fn.djangoFormset.Tab(newTabElem)
        lastForm = @forms[@forms.length - 1]
        newTabElem.insertAfter(lastForm.tab.elem)

      newFormElem = @template.clone().removeClass("empty-form")

      newForm = new $.fn.djangoFormset.Form(newFormElem, this,
        @totalForms.val(), newTab)

      newFormElem.insertAfter(@insertAnchor)
      @insertAnchor = newFormElem
      @forms.push(newForm)

      @totalForms.val(parseInt(@totalForms.val()) + 1)
      if @hasTabs
        newTab.activate()
      $(this).trigger("formAdded", [newForm])

      newForm

    deleteForm: (index) ->
      form = @forms[index]
      form.delete()
      return

    handleFormRemoved: (index) ->
      @totalForms.val(parseInt(@totalForms.val()) - 1)
      #form = @forms[index]
      @forms.splice(index, 1)
      for form, i in @forms
        form._updateFormIndex(i)

      if @forms.length == 0
        @insertAnchor = @template
      else
        @insertAnchor = @forms[@forms.length - 1].elem

      #form.tab.remove()

      return

  class $.fn.djangoFormset.Form
    constructor: (@elem, @formset, @index, @tab) ->
      if @index isnt undefined
        @_initFormIndex(@index)
      deleteName = "#{@formset.prefix}-#{@index}-DELETE"
      @deleteInput = @elem.find("input[name='#{deleteName}']")
      @_hideDeleteCheckbox()
      @_addDeleteButton()

    getDeleteButton: ->
      $('<button type="button" class="btn btn-danger">
           Delete
         </button>')

    getDeleteButtonContainer: ->
      if @elem.is('TR')
        @elem.children().last()
      else if @elem.is('UL') or @elem.is('OL')
        @elem.append('li').children().last()
      else
        @elem

    delete: ->
      isInitial = @index < @formset.initialForms

      if isInitial
        if @tab?
          tabElems = @formset.forms.map((index, form) -> form.tab.elem[0])
          nextTab = tabElems[...@index].filter(':visible').last()
          if nextTab.length == 0
            nextTab = tabElems[@index + 1..].filter(':visible').first()
          if nextTab.length > 0
            nextTab[0].tab.activate()
          @tab.elem.hide()

        @deleteInput.val('on')
        @hide()

      else
        @elem.remove()
        @formset.handleFormRemoved(@index)
      return

    hide: ->
      @elem.hide()

    _hideDeleteCheckbox: ->
      @deleteInput.before(
        "<input type='hidden'
                name='#{@deleteInput.attr('name')}'
                id='#{@deleteInput.attr('id')}'
                value='#{if @deleteInput.is(':checked') then 'on' else ''}'/>")
      newDeleteInput = @deleteInput.prev()
      # Remove any label for the delete checkbox
      @elem.find("label[for='#{@deleteInput.attr('id')}']").remove()
      @deleteInput.remove()
      @deleteInput = newDeleteInput

    _addDeleteButton: ->
      @deleteButton = @getDeleteButton()
      @getDeleteButtonContainer().append(@deleteButton)
      @deleteButton.on('click', (event) => @delete())

    _replaceFormIndex: (oldIndexPattern, index) ->
      @index = index

      prefixRegex = new RegExp("#{@formset.prefix}-#{oldIndexPattern}")
      newPrefix = "#{@formset.prefix}-#{index}"

      _replaceFormIndexElement = (elem) ->
        attributeNamesByTagName =
          input: ['id', 'name']
          select: ['id', 'name']
          textarea: ['id', 'name']
          label: ['for']
          div: ['id']
          '*': ['href', 'data-target']

        tagName = elem.get(0).tagName
        attributeNames = []
        if tagName.toLowerCase() of attributeNamesByTagName
          attributeNames = attributeNamesByTagName[tagName.toLowerCase()]

        attributeNames.push(attributeNamesByTagName['*']...)

        for attributeName in attributeNames
          if elem.attr(attributeName)
            elem.attr(attributeName,
                      elem.attr(attributeName).replace(prefixRegex, newPrefix))

      _replaceFormIndexElement(@elem)

      @elem.find('input, select, textarea, label').each(->
        _replaceFormIndexElement($(this))
        return
      )

      if @tab?
        _replaceFormIndexElement(@tab.elem)
        @tab.elem.find('a, button').each(->
          _replaceFormIndexElement($(this))
          return
        )

      return

    _initFormIndex: (index) ->
      @_replaceFormIndex("__prefix__", index)
      return

    _updateFormIndex: (index) ->
      @_replaceFormIndex('\\d+', index)
      return

  class $.fn.djangoFormset.Tab
    constructor: (@elem) ->
      @elem[0].tab = this

    activate: ->
      @elem.find("[data-toggle='tab']").trigger('click')

    remove: ->
      @elem.remove()

  $.djangoFormset =
    getTabActivator: (id) ->
      $("[href='##{id}'], [data-target='##{id}']")

  return

)(jQuery)
