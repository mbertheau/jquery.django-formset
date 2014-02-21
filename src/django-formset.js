(function($) {
  $.fn.django_formset = function() {
    return this;
  };
  $.expr[":"].django_formset = function(elem) {
    return $(elem).text().indexOf("awesome") !== -1;
  };
})(jQuery);
