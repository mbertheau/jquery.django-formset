var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

(function($) {
  var moduleSetup;
  moduleSetup = function() {
    var allFixtures;
    allFixtures = $("#qunit-fixture");
    this.fixtureTabsNoInitialForms = allFixtures.find('#tabs-no-initial-forms');
    this.fixtureTabsWithFormThreeInitial = allFixtures.find('#tabs-with-form-three-initial');
    this.fixtureTabsWithoutNav = allFixtures.find('#tabs-without-tab-nav');
    this.fixtureTabsNoTabTemplate = allFixtures.find('#tabs-no-tab-template');
  };
  module("jQuery#djangoFormset - functional tests", {
    setup: moduleSetup
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
  test("Initially deleted form is hidden right away", function() {
    var fixture, formset;
    fixture = this.fixtureTabsWithFormThreeInitial;
    fixture.find("input[name='tabs-with-form-three-initial-1-DELETE']").prop('checked', true);
    formset = fixture.find('.tab-content').children().djangoFormset();
    equal(fixture.find(".nav a[href='#id_tabs-with-form-three-initial-1']").closest('.nav > *').is(':visible'), false, "the tab header of the deleted form is not visible");
    equal(fixture.find("[name='tabs-with-form-three-initial-1-DELETE']").val(), "on", "the DELETE element has the value 'on'");
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
})(jQuery);

//# sourceMappingURL=django-formset_test-bootstrap.js.map
