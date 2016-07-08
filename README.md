OPAL Pathway provides developers with a highly extensible method of
working with complex forms in [OPAL](https://github.com/openhealthcare/opal).
It provides Wizards, long multi-model forms, custom validation and much more,
all usable either in full page or modal contexts.

## Installation

Add to your application's requirements:

    -e git+https://github.com/openhealthcare/opal-pathway.git@master#egg=opal_pathway

and install with pip:

    $ pip install -r requirements


## Defining pathways

Pathways are an OPAL Discoverable feature, so we expect your pathway definitions to be in
a python module named `pathways.py` inside a Django App. Individual pathways are defined
by subclassing the `pathways.Pathway` class. We must set at least the display name, and
often want to also set a slug.

```python
from pathway import pathways

class MyPathway(pathways.Pathway):
    display_name = 'My Awesome Pathway'
    slug         = 'awesomest-pathway'
```

### Pathway steps

A pathway is made up of 1-n `Steps`. These are defined on the pathway class using the
`Pathway.steps` tuple.

In the simplest case, we can simply add OPAL `Subrecords` to this tuple, and the Pathway
will use the default form from `Subrecord.get_form_template`.

For instance, to create a simple wizard style pathway with three steps to record a
patient's allergies, treatment and past medical history, we could use the following:

```python
from pathway import pathways
from myapp import models

class SimplePathway(pathways.Pathway):
    display_name = 'A simple pathway'
    slug         = 'simples'
    steps        = (
        models.Allergies,
        models.Treatment,
        models.PastMedicalHistory
    )
```

You could access this pathway from e.g. `http:\\localhost:8000\pathway\#\simples\`.

### Success redirects

Often, after succesfully saving a pathway, we want to redirect the user to a different
url - we do this by overriding the `redirect_url` method on the pathway. For example -
to create a pathway that always logged the user out after a successfull save:

```python
class LogoutPathway(pathways.Pathway):
    display_name = 'Logout-O-Matic'
    steps        = (...)

    def redirect_url(self, patient):
        return '/accounts/logout/'
```

#### Redirect mixins

The pathways plugin provides some helpful mixins for common redirect patterns:

```python
class PatientRedirectPathway(pathways.RedirectsToPatientMixin, pathways.Pathway):
    display_name = 'Redirector example Pathway'
    steps = (...)
```

##### pathways.RedirectsToPatientMixin

Redirect to the patient detail page for this patient.

##### pathways.RedirectsToEpisodeMixin

Redirect to the patient detail page, viewing the last episode for this patient.

## Types of Pathway

The pathways plugin provides three types of pathway out of the box.

### Pathway

A wizard-style pathway displaying one step at a time, with next and back controls.

### UnrolledPathway

Displays each step as a separate panel, one after the other, all visible at the same
time.

### ModalPathway

A pathway typwe for use inside OPAL modals.

# Reference

## pathways.Pathway

The base pathway class.

### Pathway.Pathway. _attributes_

#### Pathway.display_name

The human readable display name for this pathway. Will be used in the base template for
full page pathways.

#### Pathway.slug

The slug to use in the URL for accessing an individual pathway, and the string that can
be passed to `Pathway.get()` that will return i.t

#### Pathway.steps

The steps that make up this pathway. A tuple of either `opal.models.Subrecord` or
`pathway.pathways.Step` subclasses.

### Pathway. _methods_

#### Pathway.redirect_url(self, patient)

Returns a string that we should redirect to on success. Defaults to `None`.

## pathways.RedirectsToPatientMixin

Redirect to the patient detail page for this patient.

## pathways.RedirectsToEpisodeMixin

Redirect to the patient detail page, viewing the last episode for this patient.
