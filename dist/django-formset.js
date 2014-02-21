/*! Django Formset - v0.1.0 - 2014-02-21
* https://github.com/mbertheau/jquery.django-formset
* Copyright (c) 2014 Markus Bertheau; Licensed MIT */
(function($) {
  $.fn.django_formset = function() {
    var base, lastForm, template;
    base = this;
    if (this.prop("tagName") === "TABLE") {
      base = this.children("tbody");
    }
    template = base.find("> .empty-form");
    lastForm = base.children().last();
    return {
      addForm: function() {
        var newForm;
        newForm = template.clone().removeClass("empty-form");
        newForm.insertAfter(lastForm);
        lastForm = newForm;
      }
    };
  };
})(jQuery);

//# sourceMappingURL=django-formset.js.map
