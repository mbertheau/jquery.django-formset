var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

(function($) {
  var getTotalFormsValue, moduleSetup;
  moduleSetup = function() {
    var allFixtures;
    allFixtures = $("#qunit-fixture");
    this.fixtureIDontExist = allFixtures.find('#i-dont-exist');
    this.fixtureNoTemplate = allFixtures.find('#no-template');
    this.fixtureNoTotalForms = allFixtures.find('#no-total-forms');
    this.fixtureSimpleList = allFixtures.find('#simple-list');
    this.fixtureSimpleFormAsList = allFixtures.find('#simple-form-as-list');
    this.fixtureSimpleTable = allFixtures.find('#simple-table');
    this.fixtureDivWithForm = allFixtures.find('#div-with-form');
    this.fixtureDivWithFormOneInitial = allFixtures.find('#div-with-form-one-initial');
    this.fixtureTabsNoInitialForms = allFixtures.find('#tabs-no-initial-forms');
    this.fixtureTabsWithFormThreeInitial = allFixtures.find('#tabs-with-form-three-initial');
    this.fixtureTabsWithoutNav = allFixtures.find('#tabs-without-tab-nav');
    this.fixtureTabsNoTabTemplate = allFixtures.find('#tabs-no-tab-template');
    this.fixtureDivWithNestedFormsets = allFixtures.find('#div-with-nested-formsets');
  };
  module("jQuery#djangoFormset - functional tests", {
    setup: moduleSetup
  });
  test("throws when jQuery selection is empty", function() {
    throws((function() {
      return this.fixtureIDontExist.children('li').djangoFormset();
    }), /Empty selector./, "throws Error");
  });
  test("throws on missing TOTAL_FORMS", function() {
    throws((function() {
      return this.fixtureNoTotalForms.children('li').djangoFormset();
    }), /Management form field 'TOTAL_FORMS' not found for prefix no-total-forms/, "throws Error");
  });
  test("throws on missing template", function() {
    throws((function() {
      return this.fixtureNoTemplate.children('li').djangoFormset();
    }), /Can\'t find template \(looking for .empty-form\)/, "throws Error");
  });
  test("can add form", function() {
    var formset;
    formset = this.fixtureSimpleList.children('li').djangoFormset();
    equal(this.fixtureSimpleList.find(".empty-form").length, 1, "there's exactly one template form");
    equal(this.fixtureSimpleList.children(":visible").length, 3, "and three visible templates");
    formset.addForm();
    equal(this.fixtureSimpleList.find(".empty-form").length, 1, "there's still exactly one template form");
    equal(this.fixtureSimpleList.children(":visible").length, 4, "but now four visible templates");
    equal(this.fixtureSimpleList.children(":visible").last().data('djangoFormset.Form'), formset.forms[3], "and the Form object is available as .data('djangoFormset.Form')");
  });
  test("adds form at the end", function() {
    var formset, lastChild;
    formset = this.fixtureSimpleList.children('li').djangoFormset();
    equal(this.fixtureSimpleList.children(":visible:last-child").contents().first().text(), "awesome test markup", "just checking current last form");
    formset.addForm();
    lastChild = this.fixtureSimpleList.children(":visible:last-child").contents().first();
    equal(lastChild.text(), "template", "first new form was added at the end");
    lastChild[0].data = "this is the form that was added first";
    equal(lastChild.text(), "this is the form that was added first", "the text of the newly added form was changed");
    formset.addForm();
    lastChild = this.fixtureSimpleList.children(":visible:last-child").contents().first();
    equal(lastChild.text(), "template", "second new form was added at the end");
  });
  test("adds forms to tables as new rows", function() {
    var formset;
    formset = this.fixtureSimpleTable.children('tbody').children('tr').djangoFormset();
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
    formset = this.fixtureDivWithForm.children('div').djangoFormset();
    equal(parseInt(this.fixtureDivWithForm.find('input[name="div-with-form-TOTAL_FORMS"]').val()), 0, "initially TOTAL_FORMS is 0");
    formset.addForm();
    checkFormIndex(this.fixtureDivWithForm, formset, 0);
    formset.addForm();
    checkFormIndex(this.fixtureDivWithForm, formset, 1);
  });
  test("adds delete button to existing and new forms", function() {
    var checkDeleteButton, fixture, formset;
    fixture = this.fixtureDivWithFormOneInitial;
    formset = fixture.children('div').djangoFormset();
    checkDeleteButton = function(form) {
      var deleteButton, deleteName;
      deleteButton = form.elem.children().last();
      equal(deleteButton[0].outerHTML, '<button type="button" class="btn btn-danger"> Delete </button>', "Last element in form is the delete button");
      deleteName = "" + formset.prefix + "-" + form.index + "-DELETE";
      equal(form.elem.find("input[name='" + deleteName + "']").is(':hidden'), true, "the DELETE input is hidden");
      return equal(form.elem.find("label[for='id_" + deleteName + "']").length, 0, "there's no label for the DELETE input");
    };
    checkDeleteButton(formset.forms[0]);
    formset.addForm();
    checkDeleteButton(formset.forms[1]);
  });
  test("deletes form that was added before", function() {
    var fixture, form, formset, _i, _len, _ref;
    _ref = [this.fixtureDivWithFormOneInitial, this.fixtureDivWithNestedFormsets];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      fixture = _ref[_i];
      formset = fixture.children('div').djangoFormset();
      form = formset.addForm();
      equal(getTotalFormsValue(fixture, formset), 2, "for " + formset.prefix + ": TOTAL_FORMS is 2 now");
      equal(form.elem.find("button:contains('Delete')").length, 1, "The added form has a delete button");
      formset.deleteForm(1);
      equal(fixture.children('div').length, 2, "for " + formset.prefix + ": the added form was deleted again");
      equal(getTotalFormsValue(fixture, formset), 1, "for " + formset.prefix + ": TOTAL_FORMS is back to 1 again");
    }
  });
  test("renumbers when deleting newly added row from the middle", function() {
    var formset;
    formset = this.fixtureDivWithForm.children('div').djangoFormset();
    formset.addForm();
    formset.addForm();
    formset.deleteForm(0);
    equal(this.fixtureDivWithForm.find("input[type='text']").last().attr('name'), 'div-with-form-0-text', "the text input that was at index 1 now has the name objects_set-0-text");
  });
  test("figures out the form prefix itself", function() {
    var formset;
    formset = this.fixtureDivWithForm.children('div').djangoFormset();
    equal(formset.prefix, "div-with-form");
  });
  test("deletes initially existing form", function() {
    var fixture, formset;
    fixture = this.fixtureDivWithFormOneInitial;
    formset = fixture.children('div').djangoFormset();
    formset.deleteForm(0);
    equal(fixture.find("input[name='div-with-form-one-initial-0-DELETE']").val(), "on", "delete checkbox is now checked");
    equal(formset.forms[0].elem.is(':visible'), false, "removed form is now hidden");
  });
  test("add - delete - add adds a one new row", function() {
    var fixture, formset;
    fixture = this.fixtureSimpleTable.children('tbody');
    formset = fixture.children('tr').djangoFormset();
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
    formset = fixture.children('div').djangoFormset();
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
    formset = fixture.children('div').djangoFormset();
    nestedFormset = null;
    $(formset).on('formAdded', function(event, form) {
      return nestedFormset = form.elem.children('div').djangoFormset();
    });
    formset.addForm();
    form = fixture.children('div:visible').last();
    equal(form.children('input[type="text"]').attr('name'), 'div-with-nested-formsets-1-outer', 'one form was added');
    nestedFormset.addForm();
    nestedForm = form.children('div:visible').last();
    equal(nestedForm.children('input[type="text"]').attr('name'), 'div-with-nested-formsets-1-variant_set-0-inner', 'added inner form input has the prefix replaced with the correct id');
  });
  test("Throws on missing tab activator if form template is .tab-pane", function() {
    throws((function() {
      return this.fixtureTabsWithoutNav.find('.tab-content > div').djangoFormset();
    }), /Template is .tab-pane but couldn't find corresponding tab activator./, "Doesn't complain about missing tab activator");
  });
  test("Throws on missing tab template", function() {
    throws((function() {
      return this.fixtureTabsNoTabTemplate.find('.tab-content > div').djangoFormset();
    }), /Tab nav template not found \(looking for .empty-form\)./, "Doesn't complain about missing tab template");
  });
  test("Adds new tab pane and new tab nav after the last form", function() {
    var fixture, formset, lastTabNav, lastTabPane;
    fixture = this.fixtureTabsWithFormThreeInitial;
    formset = fixture.find('.tab-content').children().djangoFormset();
    lastTabPane = fixture.find('.tab-pane').last();
    lastTabNav = fixture.find("[href='#" + (lastTabPane.attr('id')) + "']").closest('.nav > *');
    formset.addForm();
    equal(lastTabPane.next().attr('id'), 'id_tabs-with-form-three-initial-3', "tab pane with id 3 was added");
    equal(lastTabNav.next().find('a').attr('href'), '#id_tabs-with-form-three-initial-3', "the last tab activates the newly added tab pane");
    equal(fixture.find('.nav').children('.active').find("[data-toggle='tab']").attr('href'), '#id_tabs-with-form-three-initial-3', "the new tab pane is active");
  });
  test("deleting first initially existing form activates following tab header", function() {
    var activeTab, fixture, formset;
    fixture = this.fixtureTabsWithFormThreeInitial;
    formset = fixture.find('.tab-content').children().djangoFormset();
    activeTab = fixture.find('.nav').children('.active');
    formset.deleteForm(0);
    equal(activeTab.filter('.active').length, 0, "first tab header is not active anymore");
    activeTab = fixture.find('.nav').children('.active');
    equal(activeTab.find("[data-toggle='tab']").attr('href'), "#id_tabs-with-form-three-initial-1", "following tab header is now active");
  });
  test("deleting middle initially existing form activates following tab header", function() {
    var activeTab, fixture, formset;
    fixture = this.fixtureTabsWithFormThreeInitial;
    formset = fixture.find('.tab-content').children().djangoFormset();
    fixture.find(".nav :visible [data-toggle='tab']").eq(1).trigger('click');
    activeTab = fixture.find('.nav').children('.active');
    formset.deleteForm(1);
    equal(activeTab.is('.active'), false, "previously active tab header is now not active");
    activeTab = fixture.find('.nav').children('.active');
    equal(activeTab.find("[data-toggle='tab']").attr('href'), "#id_tabs-with-form-three-initial-2", "now active tab header is the preceding one");
  });
  test("deleting last initially existing form activates preceding tab header", function() {
    var activeTab, fixture, formset;
    fixture = this.fixtureTabsWithFormThreeInitial;
    formset = fixture.find('.tab-content').children().djangoFormset();
    fixture.find(".nav :visible [data-toggle='tab']").last().trigger('click');
    activeTab = fixture.find('.nav').children('.active');
    formset.deleteForm(2);
    equal(activeTab.filter('.active').length, 0, "previously active tab header is now not active");
    activeTab = fixture.find('.nav').children('.active');
    equal(activeTab.find("[data-toggle='tab']").attr('href'), "#id_tabs-with-form-three-initial-1", "now active tab header is the preceding one");
  });
  test("deleting the only tab deletes the tab header as well", function() {
    var fixture, formset;
    fixture = this.fixtureTabsWithFormThreeInitial;
    formset = fixture.find('.tab-content').children().djangoFormset();
    formset.deleteForm(2);
    formset.deleteForm(1);
    formset.deleteForm(0);
    equal(fixture.find('.nav').children("[data-toggle='tab']:visible").length, 0, "no tab headers are visible");
  });
  test('deleting new form hides current tab and activates following tab', function() {
    var activeTab, fixture, formset;
    fixture = this.fixtureTabsWithFormThreeInitial;
    formset = fixture.find('.tab-content').children().djangoFormset();
    fixture.find(".nav :visible [data-toggle='tab']").last().trigger('click');
    formset.addForm();
    formset.addForm();
    fixture.find(".nav :visible [data-toggle='tab']").eq(3).trigger('click');
    formset.deleteForm(3);
    activeTab = fixture.find('.nav').children('.active');
    equal(activeTab.find("[data-toggle='tab']").attr('href'), "#id_tabs-with-form-three-initial-3", "following tab header is now active");
  });
  test("deleting a non-active tab doesn't change the active tab", function() {
    var activeTab, fixture, formset;
    fixture = this.fixtureTabsWithFormThreeInitial;
    formset = fixture.find('.tab-content').children().djangoFormset();
    activeTab = fixture.find('.nav').children('.active');
    formset.deleteForm(1);
    activeTab = fixture.find('.nav').children('.active');
    equal(activeTab.find("[data-toggle='tab']").attr('href'), "#id_tabs-with-form-three-initial-0", "active tab header is still the same");
  });
  test("Adding a new form to a tabbed formset without initial forms works", function() {
    var fixture, formset;
    fixture = this.fixtureTabsNoInitialForms;
    formset = fixture.find('.tab-content > *').djangoFormset();
    formset.addForm();
    equal(fixture.find('.nav').children(':visible').length, 1, "there's one visible tab");
    equal(fixture.find('.tab-content').children(':visible').length, 1, "there's one visible tab pane");
  });
  test("forms not marked for deletion stay that way when creating the formset", function() {
    var fixture, formset;
    fixture = this.fixtureSimpleFormAsList;
    formset = fixture.children('ul').djangoFormset({
      formTemplateClass: "custom-template-class"
    });
    equal(fixture.find("[name='simple-form-as-list-0-DELETE']").val(), '', "hidden field value is empty");
  });
  test("Initially deleted form is hidden right away", function() {
    var fixture, formset;
    fixture = this.fixtureTabsWithFormThreeInitial;
    fixture.find("input[name='tabs-with-form-three-initial-1-DELETE']").prop('checked', true);
    formset = fixture.find('.tab-content').children().djangoFormset();
    equal(fixture.find(".nav a[href='#id_tabs-with-form-three-initial-1']").closest('.nav > *').is(':visible'), false, "the tab header of the deleted form is not visible");
    equal(fixture.find("[name='tabs-with-form-three-initial-1-DELETE']").val(), "on", "the DELETE element has the value 'on'");
  });
  test("Form without delete checkbox doesn't get delete button", function() {
    var fixture, formset;
    fixture = this.fixtureSimpleList;
    formset = fixture.children('li').djangoFormset();
    equal(fixture.find("button:contains('Delete')").length, 0, "There are no delete buttons in the fixture");
  });
  test("Form without delete checkbox can't be deleted programmatically", function() {
    var fixture, formset;
    fixture = this.fixtureSimpleList;
    formset = fixture.children('li').djangoFormset();
    formset.deleteForm(1);
    equal(fixture.children('li:visible').length, 3, "there's still 3 visible forms");
  });
  test("Form and Tab class can be replaced with a customized version", function() {
    var MyForm, MyTab, fixture, formset, tab;
    MyForm = (function(_super) {
      __extends(MyForm, _super);

      function MyForm() {
        return MyForm.__super__.constructor.apply(this, arguments);
      }

      MyForm.prototype.getDeleteButton = function() {
        return $('<button type="button" class="btn btn-danger my-delete-button-class"> Delete </button>');
      };

      return MyForm;

    })($.fn.djangoFormset.Form);
    MyTab = (function(_super) {
      __extends(MyTab, _super);

      function MyTab(elem) {
        this.elem = elem;
        MyTab.__super__.constructor.apply(this, arguments);
        this.elem.data('mycustomdata', this);
      }

      return MyTab;

    })($.fn.djangoFormset.Tab);
    fixture = this.fixtureTabsWithFormThreeInitial;
    formset = fixture.find('.tab-content').children().djangoFormset({
      formClass: MyForm,
      tabClass: MyTab
    });
    formset.addForm();
    equal(fixture.find("button.my-delete-button-class:contains('Delete')").last().length, 1, "The custom getDeleteButton method was used");
    tab = formset.forms[0].tab;
    equal(tab.elem.data('mycustomdata'), tab, "The custom Tab class was used");
  });
  test("formInitialized is triggered for every existing and added form", function() {
    var fixture, form, formset, index, _i, _len, _ref;
    fixture = this.fixtureSimpleList;
    formset = this.fixtureSimpleList.children('li').djangoFormset({
      on: {
        formInitialized: function(event, form) {
          return form.myProp = "foo";
        }
      }
    });
    formset.addForm();
    _ref = formset.forms;
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      form = _ref[index];
      equal(form.myProp, "foo", "Form #" + index + " has the custom property set");
    }
  });
})(jQuery);

//# sourceMappingURL=django-formset_test.js.map
