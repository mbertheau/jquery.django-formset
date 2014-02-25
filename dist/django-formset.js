/*! Django Formset - v0.1.0 - 2014-02-25
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
    return new $.fn.djangoFormset.Formset(this, options);
  };
  $.fn.djangoFormset.Formset = (function() {
    function Formset(base, options) {
      var initialForms, opts;
      opts = $.extend({}, $.fn.djangoFormset.default_options, options);
      this.prefix = opts.prefix;
      if (base.length === 0) {
        throw new FormsetError("Empty selector.");
      }
      this.totalForms = $("#id_" + this.prefix + "-TOTAL_FORMS");
      if (this.totalForms.length === 0) {
        throw new FormsetError("Management form field 'TOTAL_FORMS' not found for prefix " + this.prefix + ".");
      }
      this.template = base.filter(".empty-form");
      if (this.template.length === 0) {
        throw new FormsetError("Can't find template (looking for .empty-form)");
      }
      initialForms = base.not('.empty-form');
      this.forms = base.filter(':visible').map((function(_this) {
        return function(index, element) {
          return new $.fn.djangoFormset.Form($(element), _this, index);
        };
      })(this));
      if (this.forms.length !== parseInt(this.totalForms.val())) {
        console.error("TOTAL_FORMS is " + (this.totalForms.val()) + ", but " + this.forms.length + " visible children found.");
      }
      this.insertAnchor = base.filter(':visible').last();
      if (this.insertAnchor.length === 0) {
        this.insertAnchor = this.template;
      }
      return;
    }

    Formset.prototype.addForm = function() {
      var newForm, newFormElem;
      newFormElem = this.template.clone().removeClass("empty-form");
      newForm = new $.fn.djangoFormset.Form(newFormElem, this);
      newForm.initFormIndex(this.totalForms.val());
      this.totalForms.val(parseInt(this.totalForms.val()) + 1);
      newFormElem.insertAfter(this.insertAnchor);
      this.insertAnchor = newFormElem;
      this.forms.push(newForm);
      $(this).trigger("formAdded", [newForm]);
      return newForm;
    };

    Formset.prototype.deleteForm = function(index) {
      var form;
      form = this.forms[index];
      form["delete"]();
    };

    Formset.prototype.handleFormRemoved = function(index) {
      var form, i, _i, _len, _ref, _results;
      this.totalForms.val(parseInt(this.totalForms.val()) - 1);
      this.forms.splice(index, 1);
      _ref = this.forms;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        form = _ref[i];
        _results.push(form.updateFormIndex(i));
      }
      return _results;
    };

    return Formset;

  })();
  $.fn.djangoFormset.Form = (function() {
    function Form(elem, formset, index) {
      this.elem = elem;
      this.formset = formset;
      this.index = index;
    }

    Form.prototype["delete"] = function() {
      var deleteInput, deleteName, isInitial;
      deleteName = "" + this.formset.prefix + "-" + this.index + "-DELETE";
      deleteInput = this.elem.find("input[name='" + deleteName + "']");
      isInitial = deleteInput.get(0) != null;
      if (isInitial) {
        deleteInput.val('on');
        this.hide();
      } else {
        this.elem.remove();
        this.formset.handleFormRemoved(this.index);
      }
    };

    Form.prototype.hide = function() {
      return this.elem.hide();
    };

    Form.prototype._replaceFormIndex = function(oldIndexPattern, index) {
      var newPrefix, prefixRegex;
      this.index = index;
      prefixRegex = new RegExp("^(id_)?" + this.formset.prefix + "-" + oldIndexPattern);
      newPrefix = "" + this.formset.prefix + "-" + index;
      return this.elem.find('input,select,textarea,label').each(function() {
        var attributeName, elem, _i, _len, _ref;
        elem = $(this);
        _ref = ['for', 'id'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          attributeName = _ref[_i];
          if (elem.attr(attributeName)) {
            elem.attr(attributeName, elem.attr(attributeName).replace(prefixRegex, "id_" + newPrefix));
          }
        }
        if (elem.attr('name')) {
          elem.attr('name', elem.attr('name').replace(prefixRegex, newPrefix));
        }
      });
    };

    Form.prototype.initFormIndex = function(index) {
      return this._replaceFormIndex("__prefix__", index);
    };

    Form.prototype.updateFormIndex = function(index) {
      return this._replaceFormIndex('\\d+', index);
    };

    return Form;

  })();
  $.fn.djangoFormset.default_options = {
    prefix: "form"
  };
})(jQuery);

//# sourceMappingURL=django-formset.js.map
