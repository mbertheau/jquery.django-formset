/*! Django Formset - v0.1.0 - 2014-02-21
* https://github.com/mbertheau/jquery.django-formset
* Copyright (c) 2014 Markus Bertheau; Licensed MIT */
(function($) {
  $.fn.django_formset = function() {
    var base, last_form, template;
    base = this;
    if (this.prop("tagName") === "TABLE") {
      base = this.children("tbody");
    }
    template = base.find("> .empty-form");
    last_form = base.children().last();
    return {
      addForm: function() {
        var new_form;
        new_form = template.clone().removeClass("empty-form");
        new_form.insertAfter(last_form);
        last_form = new_form;
      }
    };
  };
})(jQuery);

//# sourceMappingURL=django-formset.js.map
