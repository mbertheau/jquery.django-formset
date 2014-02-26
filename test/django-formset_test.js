(function($) {
  var getTotalFormsValue;
  module("jQuery#djangoFormset", {
    setup: function() {
      var allFixtures;
      allFixtures = $("#qunit-fixture");
      this.fixtureIDontExist = allFixtures.find('#i-dont-exist');
      this.fixtureNoTemplate = allFixtures.find('#no-template');
      this.fixtureNoTotalForms = allFixtures.find('#no-total-forms');
      this.fixtureSimpleList = allFixtures.find('#simple-list');
      this.fixtureSimpleTable = allFixtures.find('#simple-table');
      this.fixtureDivWithForm = allFixtures.find('#div-with-form');
      this.fixtureDivWithFormOneInitial = allFixtures.find('#div-with-form-one-initial');
      this.fixtureDivWithNestedFormsets = allFixtures.find('#div-with-nested-formsets');
    }
  });
  test("throws when jQuery selection is empty", function() {
    throws((function() {
      return this.fixtureIDontExist.children('li').djangoFormset();
    }), /Empty selector./, "throws Error");
  });
  test("throws on missing TOTAL_FORMS", function() {
    throws((function() {
      return this.fixtureNoTotalForms.children('li').djangoFormset({
        prefix: 'no-total-forms'
      });
    }), /Management form field 'TOTAL_FORMS' not found for prefix no-total-forms/, "throws Error");
  });
  test("throws on missing template", function() {
    throws((function() {
      return this.fixtureNoTemplate.children('li').djangoFormset({
        prefix: 'no-template'
      });
    }), /Can\'t find template \(looking for .empty-form\)/, "throws Error");
  });
  test("can add form", function() {
    var formset;
    formset = this.fixtureSimpleList.children('li').djangoFormset({
      prefix: 'simple-list'
    });
    equal(this.fixtureSimpleList.find(".empty-form").length, 1, "there's exactly one template form");
    equal(this.fixtureSimpleList.find(":visible").length, 3, "and three visible templates");
    formset.addForm();
    equal(this.fixtureSimpleList.find(".empty-form").length, 1, "there's still exactly one template form");
    equal(this.fixtureSimpleList.find(":visible").length, 4, "but now four visible templates");
  });
  test("adds form at the end", function() {
    var formset, lastChild;
    formset = this.fixtureSimpleList.children('li').djangoFormset({
      prefix: 'simple-list'
    });
    equal(this.fixtureSimpleList.find(":visible:last-child").text(), "awesome test markup", "just checking current last form");
    formset.addForm();
    lastChild = this.fixtureSimpleList.find(":visible:last-child");
    equal(lastChild.text(), "template", "first new form was added at the end");
    lastChild.text("this is the form that was added first");
    equal(lastChild.text(), "this is the form that was added first", "the text of the newly added form was changed");
    formset.addForm();
    lastChild = this.fixtureSimpleList.find(":visible:last-child");
    equal(lastChild.text(), "template", "second new form was added at the end");
  });
  test("adds forms to tables as new rows", function() {
    var formset;
    formset = this.fixtureSimpleTable.children('tbody').children('tr').djangoFormset({
      prefix: 'simple-table'
    });
    equal(this.fixtureSimpleTable.find('tbody > tr:visible').length, 0, "no forms there initially");
    formset.addForm();
    equal(this.fixtureSimpleTable.find('tbody > tr:visible').length, 1, "one row was added");
  });
  getTotalFormsValue = function(fixture, formset) {
    return parseInt(fixture.find("input[name='" + formset.prefix + "-TOTAL_FORMS']").val());
  };
  test("replaces form index template and updates TOTAL_FORMS", function() {
    var checkFormIndex, formset;
    checkFormIndex = function(fixture, formset, index) {
      var element, idValue, nameValue, selector, type, types_and_selectors;
      equal(getTotalFormsValue(fixture, formset), index + 1, "after adding one form TOTAL_FORMS is " + (index + 1));
      types_and_selectors = {
        select: 'select',
        textarea: 'textarea',
        text: 'input[type="text"]',
        checkbox: 'input[type="checkbox"]'
      };
      for (type in types_and_selectors) {
        selector = types_and_selectors[type];
        element = fixture.find("div:visible " + selector + "[name$='" + type + "']").last();
        nameValue = element.attr('name');
        idValue = element.attr('id');
        equal(nameValue, "" + formset.prefix + "-" + index + "-" + type, "the " + type + "'s name has the id " + index + " in it");
        if (idValue !== void 0) {
          equal(idValue, "id_" + nameValue, "the " + type + "'s id value is the same as name with id_ prefix");
        }
      }
      return equal(fixture.find('div:visible label').last().attr('for'), fixture.find('div:visible input[type="checkbox"]').last().attr('id'), "the label's for attribute has the same value as the checkbox' id attribute");
    };
    formset = this.fixtureDivWithForm.children('div').djangoFormset({
      prefix: 'div-with-form'
    });
    equal(parseInt(this.fixtureDivWithForm.find('input[name="div-with-form-TOTAL_FORMS"]').val()), 0, "initially TOTAL_FORMS is 0");
    formset.addForm();
    checkFormIndex(this.fixtureDivWithForm, formset, 0);
    formset.addForm();
    checkFormIndex(this.fixtureDivWithForm, formset, 1);
  });
  test("deletes form that was added before", function() {
    var fixture, formset, prefix, _ref;
    _ref = {
      'div-with-form-one-initial': this.fixtureDivWithFormOneInitial,
      'div-with-nested-formsets': this.fixtureDivWithNestedFormsets
    };
    for (prefix in _ref) {
      fixture = _ref[prefix];
      formset = fixture.children('div').djangoFormset({
        prefix: prefix
      });
      formset.addForm();
      equal(getTotalFormsValue(fixture, formset), 2, "for " + prefix + ": TOTAL_FORMS is 2 now");
      formset.deleteForm(1);
      equal(fixture.children('div').length, 2, "for " + prefix + ": the added form was deleted again");
      equal(getTotalFormsValue(fixture, formset), 1, "for " + prefix + ": TOTAL_FORMS is back to 1 again");
    }
  });
  test("renumbers when deleting newly added row from the middle", function() {
    var formset;
    formset = this.fixtureDivWithForm.children('div').djangoFormset({
      prefix: 'div-with-form'
    });
    formset.addForm();
    formset.addForm();
    formset.deleteForm(0);
    equal(this.fixtureDivWithForm.find("input[type='text']").last().attr('name'), 'div-with-form-0-text', "the text input that was at index 1 now has the name objects_set-0-text");
  });
  test("deletes initially existing form", function() {
    var fixture, formset;
    fixture = this.fixtureDivWithFormOneInitial;
    formset = fixture.children('div').djangoFormset({
      prefix: 'div-with-form-one-initial'
    });
    formset.deleteForm(0);
    equal(fixture.find("input[name='div-with-form-one-initial-0-DELETE']").val(), "on", "delete checkbox is now checked");
    equal(formset.forms[0].elem.is(':visible'), false, "removed form is now hidden");
  });
  test("add - delete - add adds a one new row", function() {
    var fixture, formset;
    fixture = this.fixtureSimpleTable.children('tbody');
    formset = fixture.children('tr').djangoFormset({
      prefix: 'simple-table'
    });
    equal(fixture.children('tr:visible').length, 0, "initially there's 0 forms");
    formset.addForm();
    equal(fixture.children('tr:visible').length, 1, "after adding one there's 1");
    formset.addForm();
    equal(fixture.children('tr:visible').length, 2, "after adding another one there's 2");
    formset.deleteForm(1);
    equal(fixture.children('tr:visible').length, 1, "after deleting one it's 1 again");
    formset.addForm();
    equal(fixture.children('tr:visible').length, 2, "and after adding one again it's 2 again");
    formset.deleteForm(1);
    equal(fixture.children('tr:visible').length, 1, "after deleting one it's 1 again");
    formset.deleteForm(0);
    equal(fixture.children('tr:visible').length, 0, "after deleting the last one it's 0");
    formset.addForm();
    equal(fixture.children('tr:visible').length, 1, "and after adding one again it's 1 again");
  });
  test("replaces only first prefix when adding outer forms in nested formset", function() {
    var fixture, form, forms, formset, nestedEmptyForm, nestedInput;
    fixture = this.fixtureDivWithNestedFormsets;
    formset = fixture.children('div').djangoFormset({
      prefix: 'div-with-nested-formsets'
    });
    formset.addForm();
    forms = fixture.children('div:visible');
    equal(forms.length, 2, "there's two visible outer forms now");
    form = forms.last();
    equal(form.find('input[type="text"]').first().attr('name'), "div-with-nested-formsets-1-outer", "outer form element has prefix correctly replaced in input name");
    nestedEmptyForm = form.find('.empty-form');
    equal(nestedEmptyForm.length, 1, "nested form template was copied as well");
    nestedInput = nestedEmptyForm.find('input[type="text"]');
    equal(nestedInput.attr('name'), "div-with-nested-formsets-1-variant_set-__prefix__-inner", "nested input in template has only first prefix replaced");
  });
  test("addForm on added inner formset works", function() {
    var fixture, form, formset, nestedForm, nestedFormset;
    fixture = this.fixtureDivWithNestedFormsets;
    formset = fixture.children('div').djangoFormset({
      prefix: 'div-with-nested-formsets'
    });
    nestedFormset = null;
    $(formset).on('formAdded', function(event, form) {
      return nestedFormset = form.elem.children('div').djangoFormset({
        prefix: "" + this.prefix + "-" + form.index + "-variant_set"
      });
    });
    formset.addForm();
    form = fixture.children('div:visible').last();
    equal(form.children('input[type="text"]').attr('name'), 'div-with-nested-formsets-1-outer', 'one form was added');
    nestedFormset.addForm();
    nestedForm = form.children('div:visible').last();
    equal(nestedForm.children('input[type="text"]').attr('name'), 'div-with-nested-formsets-1-variant_set-0-inner', 'added inner form input has the prefix replaced with the correct id');
  });
})(jQuery);

//# sourceMappingURL=django-formset_test.js.map
