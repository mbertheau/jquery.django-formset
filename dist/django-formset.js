/*! Django Formset - v0.1.0 - 2014-02-20
* https://github.com/mbertheau/jquery.django-formset
* Copyright (c) 2014 Markus Bertheau; Licensed MIT */
(function($) {

  // Collection method.
  $.fn.django_formset = function() {
    return this.each(function(i) {
      // Do something awesome to each selected element.
      $(this).html('awesome' + i);
    });
  };

  // Static method.
  $.django_formset = function(options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.django_formset.options, options);
    // Return something awesome.
    return 'awesome' + options.punctuation;
  };

  // Static method default options.
  $.django_formset.options = {
    punctuation: '.'
  };

  // Custom selector.
  $.expr[':'].django_formset = function(elem) {
    // Is this element awesome?
    return $(elem).text().indexOf('awesome') !== -1;
  };

}(jQuery));
