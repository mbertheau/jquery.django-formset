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

      @initialForms = $("#id_#{@prefix}-INITIAL_FORMS")
      if @initialForms.length == 0
        throw new FormsetError("Management form field 'INITIAL_FORMS' not found
                                for prefix #{@prefix}.")

      @forms = base.filter(':visible').map((index, element) =>
        new $.fn.djangoFormset.Form($(element), this, index))

      if @forms.length != parseInt(@totalForms.val())
        console.error("TOTAL_FORMS is #{@totalForms.val()}, but #{@forms.length}
                      visible children found.")

      @insertAnchor = base.filter(':visible').last()
      if @insertAnchor.length == 0
        @insertAnchor = @template

      return

    addForm: ->
      newFormElem = @template.clone().removeClass("empty-form")

      newForm = new $.fn.djangoFormset.Form(newFormElem, this)
      newForm.initFormIndex(@totalForms.val())
      @totalForms.val(parseInt(@totalForms.val()) + 1)

      newFormElem.insertAfter(@insertAnchor)
      @insertAnchor = newFormElem
      @forms.push(newForm)

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
        form.updateFormIndex(i)

      if @forms.length == 0
        @insertAnchor = @template
      else
        @insertAnchor = @forms[@forms.length - 1].elem

      return

  class $.fn.djangoFormset.Form
    constructor: (@elem, @formset, @index) ->

    delete: ->
      deleteName = "#{@formset.prefix}-#{@index}-DELETE"
      deleteInput = @elem.find("input[name='#{deleteName}']")
      isInitial = @index < parseInt(@formset.initialForms.val())

      if isInitial
        deleteInput.val('on')
        @hide()
      else
        @elem.remove()
        @formset.handleFormRemoved(@index)
      return

    hide: ->
      @elem.hide()

    _replaceFormIndex: (oldIndexPattern, index) ->
      @index = index
      prefixRegex = new RegExp("^(id_)?#{@formset.prefix}-#{oldIndexPattern}")
      newPrefix = "#{@formset.prefix}-#{index}"
      @elem.find('input,select,textarea,label').each(->
        elem = $(this)
        for attributeName in ['for', 'id'] when elem.attr(attributeName)
          elem.attr(attributeName,
                    elem.attr(attributeName).replace(prefixRegex,
                                                     "id_#{newPrefix}"))
        if elem.attr('name')
          elem.attr('name',
                    elem.attr('name').replace(prefixRegex, newPrefix))
        return
      )
      return

    initFormIndex: (index) ->
      @_replaceFormIndex("__prefix__", index)
      return

    updateFormIndex: (index) ->
      @_replaceFormIndex('\\d+', index)
      return

  return

)(jQuery)
