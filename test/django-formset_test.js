(function($) {
  module("jQuery#django_formset", {
    setup: function() {
      this.elems = $("#qunit-fixture").children();
    }
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
