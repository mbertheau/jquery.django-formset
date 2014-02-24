/*! Django Formset - v0.1.0 - 2014-02-24
* https://github.com/mbertheau/jquery.django-formset
* Copyright (c) 2014 Markus Bertheau; Licensed MIT */
var FormsetError,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
      this.totalForms = base.find("#id_" + this.prefix + "-TOTAL_FORMS");
      if (this.totalForms.length === 0) {
        throw new FormsetError("Management form field 'TOTAL_FORMS' not found for prefix " + this.prefix + ".");
      }
      if (base.prop("tagName") === "TABLE") {
        base = base.children("tbody");
      }
      this.template = base.children(".empty-form");
      if (this.template.length === 0) {
        throw new FormsetError("Can't find template (looking for .empty-form)");
      }
      initialForms = base.children().not('.empty-form');
      this.forms = (function(_this) {
        return function() {
          var form, _i, _len, _ref, _results;
          _ref = base.children(':visible');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            form = _ref[_i];
            _results.push(new $.fn.djangoFormset.Form(form, _this));
          }
          return _results;
        };
      })(this)();
      this.insertAnchor = base.children().last();
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
    };

    Formset.prototype.deleteForm = function(index) {
      var form;
      form = this.forms[index];
      form["delete"]();
      this.forms.splice(index, 1);
      this._renumberFormIndexes();
    };

    Formset.prototype._renumberFormIndexes = function() {
      var form, i, _i, _len, _ref, _results;
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
    function Form(elem, formset) {
      this.elem = elem;
      this.formset = formset;
      this["delete"] = __bind(this["delete"], this);
    }

    Form.prototype["delete"] = function() {
      var deleteInput, deleteName, isInitial;
      deleteName = '#{@formset.prefix}-#{index}-DELETE';
      deleteInput = this.elem.find("input:hidden[name='" + deleteName + "']").get(0);
      isInitial = deleteInput != null;
      if (isInitial) {
        this._deleteInitial();
      } else {
        this._deleteNew();
      }
    };

    Form.prototype._deleteNew = function() {
      this.elem.remove();
      return this.formset.totalForms.val(parseInt(this.formset.totalForms.val()) - 1);
    };

    Form.prototype._replaceFormIndex = function(oldIndexPattern, index) {
      var newPrefix, prefixRegex;
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
