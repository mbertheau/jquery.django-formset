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
    @each (i) ->

      # Do something awesome to each selected element.
      $(this).html "awesome" + i
      return



  # Static method.
  $.django_formset = (options) ->

    # Override default options with passed-in options.
    options = $.extend({}, $.django_formset.options, options)

    # Return something awesome.
    "awesome" + options.punctuation


  # Static method default options.
  $.django_formset.options = punctuation: "."

  # Custom selector.
  $.expr[":"].django_formset = (elem) ->

    # Is this element awesome?
    $(elem).text().indexOf("awesome") isnt -1

  return
) jQuery
