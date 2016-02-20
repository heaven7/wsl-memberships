### Memberships package

This package is meant not to work 'standalone', but as a part of [wsl] (https://github.com/heaven7/wsl).

A working example can be found [here] (https://github.com/heaven7/wsl-memberships-demo)
If you want to use it in your project try this (replace 'Projects' with the name of your collection):

## Installation
This package depends on some others, so to get it fully function add these packages:
```
meteor add heaven7:wsl-memberships
meteor add heaven7:wsl-theme-semantic-ui
meteor add heaven7:wsl-alert
meteor add heaven7:wsl-i18n
meteor add heaven7:wsl-translations
```

## Prerequisites
This package depends on the accounts package. Give your users the possibility to login or use
```
meteor add heaven7:wsl-useraccounts
```
and use in your template
```
{{> atForm}}
```
Define a collection
```
Projects = new Meteor.Collection('projects');
```
and use a scheme for your collection
```
Schemas.Projects = new SimpleSchema([Schemas.Base, {
  title: {
        type: String
    },

    description: {
        type: String,
        optional: true
    }
}])
Projects.attachSchema(Schemas.Projects);
```
Notice the Schemas.Base, where ownerships are handled automatically. You can check, if the 
base schema is correctly added by testing in your browser console, if your collection has the right
schema keys:
```
Projects._c2._simpleSchema._schemaKeys
```
will show
```
["_id", "doc", "docType", "owners", "createdAt", "modifiedAt", "owners.$", "title", "description"]
```

Use hook to define ownership
```
WSL.collection.addOwnershipBefore(Projects);
``` 

This package works with iron-router, a route to your collection needs to be defined
```
Router.route('/', function () {
  this.render('projects');
});
```

## Usage
Add a membership button to the template of your collection
```
{{> membershipButton collection='Projects' _id=_id }}
```

List the count of memberships of your collection with
```
{{membershipsCount _id}}
```


