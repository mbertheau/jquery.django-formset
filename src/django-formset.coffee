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
    template = @find "> .empty-form"
    last_form = @children().last()
    addForm: ->
      new_form = template.clone().removeClass("empty-form")
      new_form.insertAfter last_form
      return

  # Custom selector.
  $.expr[":"].django_formset = (elem) ->

    # Is this element awesome?
    $(elem).text().indexOf("awesome") isnt -1

  return
) jQuery
