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

    _setFormIndex: (form, index) ->
      form.find('input,select,textarea,label').each(->
        elem = $(this)
        for attributeName in ['for', 'id', 'name'] when elem.attr(attributeName)
          elem.attr(attributeName,
                    elem.attr(attributeName).replace('__prefix__', index))
        return
      )

    addForm: ->
      newForm = @template.clone().removeClass("empty-form")
      newForm.insertAfter(@insertAnchor)
      @insertAnchor = newForm
      @forms.push(new $.fn.djangoFormset.Form(newForm, this))
      @totalForms.val(parseInt(@totalForms.val()) + 1)

      # form indices start at 0
      @_setFormIndex(newForm, @totalForms.val() - 1)
      return

    deleteForm: (index) ->
      form = @forms[index]
      form.delete()
      @forms = @forms[..index].concat(@forms[index + 1..])
      return

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

  $.fn.djangoFormset.default_options =
    prefix: "form"

  return

)(jQuery)
