#
# * django-formset
# * https://github.com/mbertheau/jquery.django-formset
# *
# * Copyright (c) 2014 Markus Bertheau
# * Licensed under the MIT license.
#
# * Heavily inspired by Stanislaus Madueke's django-dynamic-formset
# * https://github.com/elo80ka/django-dynamic-formset
#

(($) ->

  $.fn.djangoFormset = (options) ->
    new $.fn.djangoFormset.Formset(this, options)

  class FormsetError extends Error

  class $.fn.djangoFormset.Formset
    constructor: (base, options) ->
      @opts = $.extend({}, $.fn.djangoFormset.defaultOptions, options)
      if base.length == 0
        throw new FormsetError("Empty selector.")

      @template = base.filter(".#{@opts.formTemplateClass}")
      if @template.length == 0
        throw new FormsetError(
          "Can't find template (looking for .#{@opts.formTemplateClass})")

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

      forms = base.not(".#{@opts.formTemplateClass}")
      @initialForms = forms.length

      $(this).on(@opts.on)

      @forms = forms.map((index, element) =>
        if @hasTabs
          tabActivator = $.djangoFormset.getTabActivator(element.id)
          tab = new @opts.tabClass(tabActivator.closest('.nav > *'))
        newForm = new @opts.formClass($(element), this, index, tab)
        $(this).trigger("formInitialized", [newForm])
        newForm
      )

      if @forms.length != parseInt(@totalForms.val())
        console.error("TOTAL_FORMS is #{@totalForms.val()}, but #{@forms.length}
                      non-template elements found in passed selection.")

      deletedForms = @forms.filter(-> @deleteInput.val())
      deletedForms.each(-> @delete())

      @insertAnchor = base.not(".#{@opts.formTemplateClass}").last()
      if @insertAnchor.length == 0
        @insertAnchor = @template

      return

    _initTabs: ->
      @hasTabs = @template.is('.tab-pane')
      if not @hasTabs
        return

      tabActivator = $.djangoFormset.getTabActivator(@template.attr('id'))
      if tabActivator.length == 0
        throw new FormsetError("Template is .tab-pane but couldn't find
                                corresponding tab activator.")

      tabNav = tabActivator.closest('.nav')
      if tabNav.length == 0
        throw new FormsetError("Template is .tab-pane but couldn't find
                                corresponding .nav.")

      @tabTemplate = tabNav.children(".#{@opts.formTemplateClass}")
      if @tabTemplate.length == 0
        throw new FormsetError("Tab nav template not found (looking for
                                .#{@opts.formTemplateClass}).")

      return

    addForm: ->
      if @hasTabs
        newTabElem = @tabTemplate.clone()
          .removeClass(@opts.formTemplateClass)
        newTab = new @opts.tabClass(newTabElem)
        if @forms.length > 0
          tabInsertAnchor = @forms[@forms.length - 1].tab.elem
        else
          tabInsertAnchor = @tabTemplate
        newTabElem.insertAfter(tabInsertAnchor)

      newFormElem = @template.clone()
        .removeClass(@opts.formTemplateClass)

      newForm = new @opts.formClass(newFormElem, this,
        parseInt(@totalForms.val()), newTab)

      newFormElem.insertAfter(@insertAnchor)
      @insertAnchor = newFormElem
      @forms.push(newForm)

      @totalForms.val(parseInt(@totalForms.val()) + 1)
      if @hasTabs
        newTab.activate()
      $(this).trigger("formInitialized", [newForm])
      $(this).trigger("formAdded", [newForm])

      newForm

    deleteForm: (index) ->
      form = @forms[index]
      form.delete()
      return

    handleFormRemoved: (index) ->
      @totalForms.val(parseInt(@totalForms.val()) - 1)
      @forms.splice(index, 1)
      for form, i in @forms
        form._updateFormIndex(i)

      if @forms.length == 0
        @insertAnchor = @template
      else
        @insertAnchor = @forms[@forms.length - 1].elem

      return

  class $.fn.djangoFormset.Form
    constructor: (@elem, @formset, @index, @tab) ->
      @elem.data('djangoFormset.Form', this)
      if @index isnt undefined
        @_initFormIndex(@index)
      @deleteInput = @field('DELETE')
      isInitial = @index < @formset.initialForms
      if @deleteInput.length > 0 or not isInitial
        @_replaceDeleteCheckboxWithButton()

    getDeleteButton: ->
      $("<button type='button' class='btn btn-danger'>
           #{@formset.opts.deleteButtonText}
         </button>")

    insertDeleteButton: ->
      if @deleteInput.length > 0
        @deleteInput.after(@deleteButton)
      else
        (if @elem.is('TR')
          @elem.children().last()
        else if @elem.is('UL') or @elem.is('OL')
          @elem.append('li').children().last()
        else
          @elem).append(@deleteButton)
      return

    delete: ->
      isInitial = @index < @formset.initialForms

      if @deleteInput.length == 0 and isInitial
        console.warn("Tried do delete non-deletable form #{@formset.prefix}
                      ##{@index}.")
        return


      if @tab and @tab.elem.is('.active')
        tabElems = @formset.forms.map((index, form) -> form.tab.elem[0])
        nextTab = tabElems[@index + 1..].filter(':visible').first()
        if nextTab.length == 0
          nextTab = tabElems[...@index].filter(':visible').last()
        if nextTab.length > 0
          nextTab.data('djangoFormset.tab').activate()

      if isInitial
        if @deleteInput.length > 0
          @deleteInput.val('on')
        if @tab
          @tab.elem.hide()
        @hide()
      else
        if @tab
          @tab.elem.remove()
        @elem.remove()
        @formset.handleFormRemoved(@index)
      return

    hide: ->
      @elem.hide()

    field: (name) ->
      return @elem.find("[name='#{@formset.prefix}-#{@index}-#{name}']")

    prev: ->
      for form in @formset.forms[..@index - 1] by -1
        if form.elem.is(':visible')
          return form

    _replaceDeleteCheckboxWithButton: ->
      if @deleteInput.length > 0
        newDeleteInput = $("<input type='hidden'
          name='#{@deleteInput.attr('name')}'
          id='#{@deleteInput.attr('id')}'
          value='#{if @deleteInput.is(':checked') then 'on' else ''}'/>")

        # Remove any label for the delete checkbox
        label = @elem.find("label[for='#{@deleteInput.attr('id')}']")
        if label.has(@deleteInput).length > 0
          label.replaceWith(newDeleteInput)
        else
          label.remove()
          @deleteInput.replaceWith(newDeleteInput)
        @deleteInput = newDeleteInput

      @deleteButton = @getDeleteButton()
      @deleteButton.on('click', (event) => @delete())
      @insertDeleteButton()
      return

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

      if @tab
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
      @elem.data('djangoFormset.tab', this)

    activate: ->
      @elem.find("[data-toggle='tab']").trigger('click')

    remove: ->
      @elem.remove()

  $.fn.djangoFormset.defaultOptions =
    formTemplateClass: 'empty-form'
    formClass: $.fn.djangoFormset.Form
    tabClass: $.fn.djangoFormset.Tab
    deleteButtonText: 'Delete'

  $.djangoFormset =
    getTabActivator: (id) ->
      $("[href='##{id}'], [data-target='##{id}']")

  return

)(jQuery)
