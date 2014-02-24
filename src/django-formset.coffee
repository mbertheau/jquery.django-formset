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

    @opts = $.extend({}, $.fn.djangoFormset.default_options, options)

    base = this

    if base.length == 0
      throw new FormsetError("Empty selector.")

    totalForms = base.find("#id_#{@opts.prefix}-TOTAL_FORMS")
    if totalForms.length == 0
      throw new FormsetError("Management form field 'TOTAL_FORMS' not found for
                              prefix #{@opts.prefix}.")

    if @prop("tagName") == "TABLE"
      base = @children("tbody")

    template = base.find("> .empty-form")

    lastForm = base.children().last()

    setFormIndex = (form, index) ->
      form.find('input,select,textarea,label').each(->
        elem = $(this)
        for attributeName in ['for', 'id', 'name'] when elem.attr(attributeName)
          elem.attr(attributeName,
                    elem.attr(attributeName).replace('__prefix__', index))
        return
      )

    addForm: ->
      newForm = template.clone().removeClass("empty-form")
      newForm.insertAfter(lastForm)
      totalForms.val(parseInt(totalForms.val()) + 1)

      # form indices start at 0
      setFormIndex(newForm, totalForms.val() - 1)
      lastForm = newForm
      return

  $.fn.djangoFormset.default_options =
    prefix: "form"

  return

)(jQuery)
