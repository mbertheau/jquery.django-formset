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

    last_form = base.children().last()
    addForm: ->
      new_form = template.clone().removeClass("empty-form")
      new_form.insertAfter last_form
      last_form = new_form
      return

  return
) jQuery
