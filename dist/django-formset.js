/*! Django Formset - v0.1.0 - 2014-02-22
* https://github.com/mbertheau/jquery.django-formset
* Copyright (c) 2014 Markus Bertheau; Licensed MIT */
(function($) {
  $.fn.django_formset = function(options) {
    var base, lastForm, setFormIndex, template, totalForms;
    this.opts = $.extend({}, $.fn.django_formset.default_options, options);
    base = this;
    totalForms = base.find("#id_" + this.opts.prefix + "-TOTAL_FORMS");
    if (this.prop("tagName") === "TABLE") {
      base = this.children("tbody");
    }
    template = base.find("> .empty-form");
    lastForm = base.children().last();
    setFormIndex = function(form, index) {
      return form.find('input,select,textarea,label').each(function() {
        var attributeName, elem, _i, _len, _ref;
        elem = $(this);
        _ref = ['for', 'id', 'name'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          attributeName = _ref[_i];
          if (elem.attr(attributeName)) {
            elem.attr(attributeName, elem.attr(attributeName).replace('__prefix__', index));
          }
        }
      });
    };
    return {
      addForm: function() {
        var newForm;
        newForm = template.clone().removeClass("empty-form");
        newForm.insertAfter(lastForm);
        totalForms.val(parseInt(totalForms.val()) + 1);
        setFormIndex(newForm, totalForms.val() - 1);
        lastForm = newForm;
      }
    };
  };
  $.fn.django_formset.default_options = {
    prefix: "form"
  };
})(jQuery);

//# sourceMappingURL=django-formset.js.map
