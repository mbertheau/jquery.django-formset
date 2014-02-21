(function($) {
  module("jQuery#django_formset", {
    setup: function() {
      var all_fixtures;
      all_fixtures = $("#qunit-fixture");
      this.fixture_simple_list = all_fixtures.find('#simple-list');
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
  module(":django_formset selector", {
    setup: function() {
      this.elems = $("#qunit-fixture").children();
    }
  });
  test("is awesome", function() {
    expect(1);
    deepEqual(this.elems.filter(":django_formset").get(), this.elems.last().get(), "knows awesome when it sees it");
  });
})(jQuery);

//# sourceMappingURL=django-formset_test.js.map
