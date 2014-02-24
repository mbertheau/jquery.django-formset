/*! Django Formset - v0.1.0 - 2014-02-20
* https://github.com/mbertheau/jquery.django-formset
* Copyright (c) 2014 Markus Bertheau; Licensed MIT */
(function($) {
  $.fn.django_formset = function() {
    return this.each(function(i) {
      $(this).html("awesome" + i);
    });
  };
  $.django_formset = function(options) {
    options = $.extend({}, $.django_formset.options, options);
    return "awesome" + options.punctuation;
  };
  $.django_formset.options = {
    punctuation: "."
  };
  $.expr[":"].django_formset = function(elem) {
    return $(elem).text().indexOf("awesome") !== -1;
  };
})(jQuery);
