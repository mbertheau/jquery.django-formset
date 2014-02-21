/*! Django Formset - v0.1.0 - 2014-02-21
* https://github.com/mbertheau/jquery.django-formset
* Copyright (c) 2014 Markus Bertheau; Licensed MIT */
(function($) {
  $.fn.django_formset = function() {
    return this;
  };
  $.expr[":"].django_formset = function(elem) {
    return $(elem).text().indexOf("awesome") !== -1;
  };
})(jQuery);
