(function($) {
  module("jQuery#django_formset", {
    setup: function() {
      this.elems = $("#qunit-fixture").children();
    }
  });
  test("can add form", function() {
    var formset;
    formset = this.elems.django_formset();
    equal(this.elems.find(".empty-form").length, 1, "there's exactly one template form");
    equal(this.elems.find(":visible").length, 3, "and three visible templates");
    formset.addForm();
    equal(this.elems.find(".empty-form").length, 1, "there's still exactly one template form");
    equal(this.elems.find(":visible").length, 4, "but now four visible templates");
  });
  test("adds form at the end", function() {
    var formset, last_child;
    formset = this.elems.django_formset();
    equal(this.elems.find(":visible:last-child").text(), "awesome test markup", "just checking current last form");
    formset.addForm();
    last_child = this.elems.find(":visible:last-child");
    equal(last_child.text(), "template", "first new form was added at the end");
    last_child.text("this is the form that was added first");
    equal(last_child.text(), "this is the form that was added first", "the text of the newly added form was changed");
    formset.addForm();
    last_child = this.elems.find(":visible:last-child");
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
