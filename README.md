# Django Formset

Add new forms to Django form sets dynamically. Supports nested formsets and Bootstrap tabs.

[![Build Status](https://travis-ci.org/mbertheau/jquery.django-formset.png?branch=master)](https://travis-ci.org/mbertheau/jquery.django-formset)

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/mbertheau/jquery.django-formset/master/dist/django-formset.min.js
[max]: https://raw.github.com/mbertheau/jquery.django-formset/master/dist/django-formset.js

## Examples

### A simple formset as a list

```html
<ul id="formset">
    {{ formset.management_form }}
    {{ formset.non_form_errors }}
    <li class="empty-form">
        {{ formset.empty_form.as_p }}
    </li>
    {% for form in formset %}
        <li>
            {{ form.as_p }}
        </li>
    {% endfor %}
</ul>
<button type="button" class="action-add-formset"></button>

<script type="text/javascript">
    $(function() {
        formset = $('#formset').children('li').djangoFormset();
        $('#formset').on('click', '.action-add-formset', function(event) {
            formset.addForm();
        });
    });
</script>
```

You have to create an "add another form" `<button>` or `<a>` yourself somewhere and on click call
the `addForm` method on the object returned by `djangoFormset()`.

### How it works

Pass a jQuery selection of the form elements in your formset. One of the form elements must be a
form template, and it must have the CSS class passed as option `formTemplateClass` (`'empty-form'`
by default). That class should be styled to be invisible. The correct form prefix is derived from
the name of the first form element in the form template. For every form a Form object is created. If
a form includes a delete checkbox it is replaced with a delete button. Dynamically added forms
always have a delete button. The form object is also accessible via `.data('djangoFormset.Form')` on
the any of the form elements.

When a form is added the template is copied and its `empty-form` CSS class is removed. The new form
is always added after the last existing form, or after the form template, if there are no existing
forms. Inside the new form in the attributes of the following elements the correct form index is
put in place of `__prefix__`:

* `id` and `name` attributes of `<input>`, `<select>` and `<textarea>`
* `for` attribute of `<label>`
* `id` attribute of the form's root element if that's a `<div>`

After adding the `formAdded` event is triggered to which you can attach a listener to do additional
setup on the new form. The listener is passed the newly created form object. The `elem` member of
the form object is the jquery object that contains the DOM node of the new form.

When a form is deleted that was dynamically added before, it is removed from the DOM completely and
the remaining forms are renumbered. If a form is deleted that existed on page load, it is just
hidden and marked as deleted.

Forms can be deleted from JavaScript by calling `delete()` on the form object or `deleteForm(index)`
on the object returned by `djangoFormset`. `index` is the 0-based form number. Hidden forms count
towards this index as well.

If something doesn't work have a look at the JavaScript console. For a number of error conditions
exceptions are raised.

### A Bootstrap-tabbed formset

```html
<div id="formset">
    {{ formset.management_form }}
    {{ formset.non_form_errors }}
    <ul class="nav nav-tabs">
        <li class="empty-form">
            <a href="#{{ formset.empty_form.prefix }}" data-toggle="tab">New tab</a>
        </li>
        {% for form in formset %}
            <li class="{% if forloop.first %}active{% endif %}">
                <a href="#{{ form.prefix }}" data-toggle="tab">
                    {{ forloop.counter }}
                </a>
            </li>
        {% endfor %}
        <li>
            <a class="btn action-add-formset">"Add another form</a>
        </li>
    </ul>

    <div class="tab-content form-inline">
        <div class="tab-pane empty-form" id="{{ formset.empty_form.prefix }}">
            {{ formset.empty_form.as_p }}
        </div>
        {% for form in formset %}
            <div class="tab-pane{% if forloop.first %} active{% endif %}"
                 id="{{ form.prefix }}">
                {% if form.instance.pk %}{{ form.DELETE }}{% endif %}
                {{ form.as_p }}
            </div>
        {% endfor %}
    </div>
</div>

<script type="text/javascript">
    $(function() {
        formset = $('#formset').find('.tab-content > .tab-pane').djangoFormset();
        $('#formset').on('click', '.action-add-formset', function(event) {
            /* set tab handle text */
            form.tab.elem.find('a').text(form.index + 1);
            formset.addForm();
        });
    });
</script>
```

### How it works

The tab functionality is triggered by the template form having the CSS class `tab-pane`.

To find the tab navigation `djangoFormset` then looks for a child of a `.nav` that has an `<a>` or a
`<button>` with a `href` or `data-target` that references the `id` of the form template root
element.  In the example that `id` is the form prefix.

When a new form is added a new tab is added after the last visible tab or after the template tab if
there's no visible tab. Inside the tab the `href` and `data-target` attributes of `<a>` and
`<button>` elements are updated to reflect the new form index.

When a form is deleted the tab is hidden or removed depending on whether the form existed at page
load time or not.

### A nested Bootstrap-tabbed formset

Use the python package [django-nested-formset] for the Django side of things.

[django-nested-formset]: https://pypi.python.org/pypi/django-nested-formset

In the view:

```python
formset_class = nestedformset_factory(
    models.Block,
    models.Building,
    nested_formset=inlineformset_factory(models.Building, models.Tenant),
)
```

In the template:
```html
{{ outer_formset.management_form }}
{{ outer_formset.non_form_errors }}
<ul class="nav nav-tabs">
    <li class="empty-form">
        <a href="#{{ outer_formset.empty_form.prefix }}" data-toggle="tab">New tab</a>
    </li>
    {% for outer_form in outer_formset %}
        <li class="{% if forloop.first %}active{% endif %}">
            <a href="#{{ outer_form.prefix }}" data-toggle="tab">Existing tab</a>
        </li>
    {% endfor %}
    <li>
        <a class="btn action-add-outer-form">{% trans "Add another outer form" %}</a>
    </li>
</ul>

<div class="tab-content">
    <div class="tab-pane empty-form" id="{{ outer_formset.empty_form.prefix }}">
        <div>
            {{ outer_formset.empty_form.nested.management_form }}
            <div class="empty-form">
                {{ outer_formset.empty_form.nested.empty_form.as_p }}
            </div>
            {% for inner_form in outer_formset.empty_form.nested %}
                <div>
                    {{ inner_form.as_p }}
                </div>
            {% endfor %}
        </div>
        <div>
            {{ outer_formset.empty_form.as_p }}
        </div>
    </div>
    {% for outer_form in outer_formset %}
        <div class="tab-pane{% if forloop.first %} active{% endif %}"
             id="{{ outer_form.prefix }}">
            <div>
                {{ outer_form.nested.management_form }}
                {{ outer_form.nested.non_form_errors }}
                <div class="empty-form">
                    {{ outer_form.nested.empty_form.as_p }}
                </div>
                {% for inner_form in outer_form.nested %}
                    <div>
                        {{ inner_form.as_p }}
                    </div>
                {% endfor %}
                <button type="button" class="btn btn-primary action-add-inner-form">
                    Add another inner form
                </button>
            </div>
            <div>
                {{ outer_form.as_p }}
            </div>
        </div>
    {% endfor %}
    <div class="actions">
        <button type="button" class="btn btn-primary action-add-outer-form">
            Add another outer form
        </button>
    </div>
</div>

<script type="text/javascript">
    var outerFormset = $("div.tab-content > div.tab-pane").not('.actions')
        .djangoFormset({
        on: {
            formInitialized: function(event, form) {
                /* Init inner formset */
                var innerFormsetElem = form.elem.children('div').first();
                var innerFormset = innerFormsetElem.children('div').djangoFormset();
                innerFormsetElem.on('click', '.action-add-inner-form', function(event) {
                    innerFormset.addForm();
                });
            },
            formAdded: function(event, form) {
                /* Optionally set tab header text on new forms */
                form.tab.elem.find('a').text("Form number " + (form.index + 1));
            }
        }
    });
    /* Add new outer form on add button click */
    $().on('click', '.action-add-outer-form', function(event) {
        outerFormset.addForm();
    });
    /* Optionally update tab label based on input value */
    $().on('change', 'input:not([name*="__prefix__"]):first', function() {
        var tabLabel = "First input value is " + $(this).val();
        form = $(this).closest('.tab-pane').data('djangoFormset.Form');
        form.tab.elem.find('a').text(tabLabel);
    });
</script>
```

### How it works

The plugin takes care to replace just the first occurrence of the template marker `__prefix__`. It
also is careful not to leave the boundaries of the current form instance when it applies the needed
modifications to the DOM. Lastly it provides events to hook up the initialization of the inner
formset.

I haven't tried it, but more than one nesting level should work just as fine.

## Release History

### 0.2.0 (2014-09-02)

* Add option `deleteButtonText` to change the text from the default "Delete"
* Add method `Form.field(name)` to get a form field by its non-prefixed name
* Add method `Form.prev()` to get the previous non-deleted form

### 0.1.0 (2014-03-08)

Initial Release
