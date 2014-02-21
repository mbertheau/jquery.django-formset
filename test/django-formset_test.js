(function($) {
  module("jQuery#django_formset", {
    setup: function() {
      var all_fixtures;
      all_fixtures = $("#qunit-fixture");
      this.fixture_simple_list = all_fixtures.find('#simple-list');
      this.fixture_simple_table = all_fixtures.find('#simple-table');
    }
  });
  test("can add form", function() {
    var formset;
    formset = this.fixture_simple_list.django_formset();
    equal(this.fixture_simple_list.find(".empty-form").length, 1, "there's exactly one template form");
    equal(this.fixture_simple_list.find(":visible").length, 3, "and three visible templates");
    formset.addForm();
    equal(this.fixture_simple_list.find(".empty-form").length, 1, "there's still exactly one template form");
    equal(this.fixture_simple_list.find(":visible").length, 4, "but now four visible templates");
  });
  test("adds form at the end", function() {
    var formset, last_child;
    formset = this.fixture_simple_list.django_formset();
    equal(this.fixture_simple_list.find(":visible:last-child").text(), "awesome test markup", "just checking current last form");
    formset.addForm();
    last_child = this.fixture_simple_list.find(":visible:last-child");
    equal(last_child.text(), "template", "first new form was added at the end");
    last_child.text("this is the form that was added first");
    equal(last_child.text(), "this is the form that was added first", "the text of the newly added form was changed");
    formset.addForm();
    last_child = this.fixture_simple_list.find(":visible:last-child");
    equal(last_child.text(), "template", "second new form was added at the end");
  });
  test("adds forms to tables as new rows", function() {
    var formset;
    formset = this.fixture_simple_table.django_formset();
    equal(this.fixture_simple_table.find('tbody > tr:visible').length, 0, "no forms there initially");
    formset.addForm();
    equal(this.fixture_simple_table.find('tbody > tr:visible').length, 1, "one row was added");
  });
})(jQuery);

//# sourceMappingURL=django-formset_test.js.map
