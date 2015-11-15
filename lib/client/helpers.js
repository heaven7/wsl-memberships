AutoForm.hooks({
    inviteMembersForm: {
        onSubmit: function(insert, doc) {},
        onError: function(insert, error, template) {
            return console.log(error);
        },
        onSuccess: function(insert, doc) {
            console.log(doc);
            // render the template
           // UI.insert(UI.render(Template.inviteMembersPreview), parentNode, beforeNode);


        }
    }
});

Template.registerHelper('membershipsByDoc', function(_id) {
    var m;
    if (typeof window['Memberships'] !== 'undefined') {
        return m = Memberships.find({
            doc: _id,
            joinedAt: {
                $exists: true,
                $not: {
                    $size: 0
                }
            }
        }, {
            sort: {
                joinedAt: -1
            }
        }).fetch();
    }
});

Template.registerHelper('membershipIsRequested', function(_id) {
    if (typeof window['Memberships'] !== 'undefined') {
        return Memberships.findOne({
            doc: _id,
            token: {
                $exists: true,
                $not: {
                    $size: 0
                }
            }
        });
    }
});

Template.registerHelper('membershipsByUser', function(_id) {
    if (typeof window['Memberships'] !== 'undefined') {
        return Memberships.find({
            owner: Meteor.userId(),
            joinedAt: {
                $not: void 0
            }
        }, {
            sort: {
                createdAt: -1
            }
        }).fetch();
    }
});

Template.registerHelper('membershipsByCollection', function(collection) {
    var Memberships, members;
    if (typeof window['Memberships'] !== 'undefined') {
        Memberships = [];
        members = window['Memberships'].find({
            owner: Meteor.userId(),
            joinedAt: {
                $exists: true,
                $not: {
                    $size: 0
                }
            }
        }, {
            sort: {
                createdAt: -1
            }
        }).fetch();
        collection = window[collection];
        _.each(members, function(member) {
            if (collection.findOne({
                    _id: member.doc
                })) {
                return Memberships.push(collection.findOne({
                    _id: member.doc
                }));
            }
        });
        return Memberships;
    }
});

Template.registerHelper('membershipsCount', function(_id) {
    if (typeof window['Memberships'] !== 'undefined') {
        return Memberships.find({
            doc: _id,
            joinedAt: {
                $exists: true,
                $not: {
                    $size: 0
                }
            }
        }).fetch().length;
    }
});

Template.registerHelper('isAccepted', function(_id) {
    if (Memberships.find({
            doc: _id,
            joinedAt: {
                $exists: true,
                $not: {
                    $size: 0
                }
            }
        }).count() > 0) {
        return true;
    }
    return false;
});

Template.registerHelper('userIsItemOwner', function(_id, docType) {
    var m;
    m = Mongo.Collection.get(docType.toLowerCase()).findOne(_id);
    if (m && m.owners.indexOf(Meteor.userId()) > -1) {
        return true;
    }
    return false;
});


