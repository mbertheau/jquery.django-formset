#
# * django-formset
# * https://github.com/mbertheau/jquery.django-formset
# *
# * Copyright (c) 2014 Markus Bertheau
# * Licensed under the MIT license.
#
(($) ->

  # Collection method.
  $.fn.django_formset = ->
    base = this

    if @prop("tagName") == "TABLE"
      base = @children("tbody")

    template = base.find "> .empty-form"

    lastForm = base.children().last()
    addForm: ->
      newForm = template.clone().removeClass "empty-form"
      newForm.insertAfter lastForm
      lastForm = newForm
      return

  return
) jQuery
