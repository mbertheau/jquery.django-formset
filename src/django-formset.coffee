#
# * django-formset
# * https://github.com/mbertheau/jquery.django-formset
# *
# * Copyright (c) 2014 Markus Bertheau
# * Licensed under the MIT license.
#

class FormsetError extends Error

(($) ->

  # Collection method.
  $.fn.djangoFormset = (options) ->
    new $.fn.djangoFormset.Formset(this, options)

  class $.fn.djangoFormset.Formset
    constructor: (base, options) ->
      opts = $.extend({}, $.fn.djangoFormset.default_options, options)
      @prefix = opts.prefix

      if base.length == 0
        throw new FormsetError("Empty selector.")

      @totalForms = base.find("#id_#{@prefix}-TOTAL_FORMS")
      if @totalForms.length == 0
        throw new FormsetError("Management form field 'TOTAL_FORMS' not found
                                for prefix #{@prefix}.")

      if base.prop("tagName") == "TABLE"
        base = base.children("tbody")

      @template = base.children(".empty-form")

      if @template.length == 0
        throw new FormsetError("Can't find template (looking for .empty-form)")

      initialForms = base.children().not('.empty-form')

      @forms = do => for form in base.children(':visible')
        new $.fn.djangoFormset.Form(form, this)

      @insertAnchor = base.children().last()

      return

    addForm: ->
      newFormElem = @template.clone().removeClass("empty-form")

      newForm = new $.fn.djangoFormset.Form(newFormElem, this)
      newForm.initFormIndex(@totalForms.val())
      @totalForms.val(parseInt(@totalForms.val()) + 1)

      newFormElem.insertAfter(@insertAnchor)
      @insertAnchor = newFormElem
      @forms.push(newForm)

      # form indices start at 0
      return

    deleteForm: (index) ->
      form = @forms[index]
      form.delete()
      @forms.splice(index, 1)
      @_renumberFormIndexes()
      return

    _renumberFormIndexes: ->
      for form, i in @forms
        form.updateFormIndex(i)

  class $.fn.djangoFormset.Form
    constructor: (@elem, @formset) ->

    delete: =>
      deleteName = '#{@formset.prefix}-#{index}-DELETE'
      deleteInput = @elem.find("input:hidden[name='#{deleteName}']").get(0)
      isInitial = deleteInput?

      if isInitial
        @_deleteInitial()
      else
        @_deleteNew()
      return

    _deleteNew: ->
      @elem.remove()
      @formset.totalForms.val(parseInt(@formset.totalForms.val()) - 1)

    _replaceFormIndex: (oldIndexPattern, index) ->
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

    initFormIndex: (index) ->
      @_replaceFormIndex("__prefix__", index)

    updateFormIndex: (index) ->
      @_replaceFormIndex('\\d+', index)


  $.fn.djangoFormset.default_options =
    prefix: "form"

  return

)(jQuery)
