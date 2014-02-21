(function($) {
  $.fn.django_formset = function() {
    var last_form, template;
    template = this.find("> .empty-form");
    last_form = this.children().last();
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
