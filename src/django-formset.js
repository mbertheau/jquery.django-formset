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
