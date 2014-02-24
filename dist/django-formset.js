/*! Django Formset - v0.1.0 - 2014-02-24
* https://github.com/mbertheau/jquery.django-formset
* Copyright (c) 2014 Markus Bertheau; Licensed MIT */
var FormsetError,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

FormsetError = (function(_super) {
  __extends(FormsetError, _super);

  function FormsetError() {
    return FormsetError.__super__.constructor.apply(this, arguments);
  }

  return FormsetError;

})(Error);

(function($) {
  $.fn.djangoFormset = function(options) {
    var base, lastForm, setFormIndex, template, totalForms;
    this.opts = $.extend({}, $.fn.djangoFormset.default_options, options);
    base = this;
    if (base.length === 0) {
      throw new FormsetError("Empty selector.");
    }
    totalForms = base.find("#id_" + this.opts.prefix + "-TOTAL_FORMS");
    if (totalForms.length === 0) {
      throw new FormsetError("Management form field 'TOTAL_FORMS' not found for prefix " + this.opts.prefix + ".");
    }
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
  $.fn.djangoFormset.default_options = {
    prefix: "form"
  };
})(jQuery);

//# sourceMappingURL=django-formset.js.map
