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
    this

  # Custom selector.
  $.expr[":"].django_formset = (elem) ->

    # Is this element awesome?
    $(elem).text().indexOf("awesome") isnt -1

  return
) jQuery
