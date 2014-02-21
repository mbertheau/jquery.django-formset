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
