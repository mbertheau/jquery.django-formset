(function($) {
  module("jQuery#django_formset", {
    setup: function() {
      var allFixtures;
      allFixtures = $("#qunit-fixture");
      this.fixtureSimpleList = allFixtures.find('#simple-list');
      this.fixtureSimpleTable = allFixtures.find('#simple-table');
      this.fixtureDivWithForm = allFixtures.find('#div-with-form');
    }
  });
  test("can add form", function() {
    var formset;
    formset = this.fixtureSimpleList.django_formset();
    equal(this.fixtureSimpleList.find(".empty-form").length, 1, "there's exactly one template form");
    equal(this.fixtureSimpleList.find(":visible").length, 3, "and three visible templates");
    formset.addForm();
    equal(this.fixtureSimpleList.find(".empty-form").length, 1, "there's still exactly one template form");
    equal(this.fixtureSimpleList.find(":visible").length, 4, "but now four visible templates");
  });
  test("adds form at the end", function() {
    var formset, lastChild;
    formset = this.fixtureSimpleList.django_formset();
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
    formset = this.fixtureSimpleTable.django_formset();
    equal(this.fixtureSimpleTable.find('tbody > tr:visible').length, 0, "no forms there initially");
    formset.addForm();
    equal(this.fixtureSimpleTable.find('tbody > tr:visible').length, 1, "one row was added");
  });
  test("replaces form index template and updates TOTAL_FORMS", function() {
    var checkFormIndex, formset;
    checkFormIndex = function(formset, index) {
      equal(parseInt(formset.find('input[name="object_set-TOTAL_FORMS"]').val()), index + 1, "after adding one form TOTAL_FORMS is " + (index + 1));
      equal(formset.find('div:visible input[type="text"]').last().attr('name'), "object_set-" + index + "-text", "the text input's name has the id " + index + " in it");
      equal(formset.find('div:visible select').last().attr('name'), "object_set-" + index + "-select", "the select's name has the id " + index + " in it");
      equal(formset.find('div:visible textarea').last().attr('name'), "object_set-" + index + "-textarea", "the textarea's name has the id " + index + " in it");
      equal(formset.find('div:visible input[type="checkbox"]').last().attr('name'), "object_set-" + index + "-check", "the checkbox input's name has the id " + index + " in it");
      return equal(formset.find('div:visible label').last().attr('for'), formset.find('div:visible input[type="checkbox"]').last().attr('id'), "the label's for attribute has the same value as the checkbox' id attribute");
    };
    formset = this.fixtureDivWithForm.django_formset({
      prefix: 'object_set'
    });
    equal(parseInt(this.fixtureDivWithForm.find('input[name="object_set-TOTAL_FORMS"]').val()), 0, "initially TOTAL_FORMS is 0");
    formset.addForm();
    checkFormIndex(this.fixtureDivWithForm, 0);
    formset.addForm();
    return checkFormIndex(this.fixtureDivWithForm, 1);
  });
})(jQuery);

//# sourceMappingURL=django-formset_test.js.map
