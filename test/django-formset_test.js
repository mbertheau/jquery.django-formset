(function($) {
  module("jQuery#django_formset", {
    setup: function() {
      var allFixtures;
      allFixtures = $("#qunit-fixture");
      this.fixtureSimpleList = allFixtures.find('#simple-list');
      this.fixtureSimpleTable = allFixtures.find('#simple-table');
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
})(jQuery);

//# sourceMappingURL=django-formset_test.js.map
