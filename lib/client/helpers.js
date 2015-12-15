membershipsByDoc = function(_id) {
    if (typeof window['Memberships'] !== 'undefined') {
        return Memberships.find({
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
        });
    }
};

Template.registerHelper('membershipsByDoc', function(_id) {
    return membershipsByDoc(_id);
});

Template.registerHelper('currentUserIsMember', function(_id) {
    return !!Memberships.findOne({
        doc: _id,
        invitee: Meteor.userId()
    });
});

Template.registerHelper('membershipIsRequested', function(_id) {
    console.log(_id);
    if (typeof window['Memberships'] !== 'undefined') {
        return !!Memberships.findOne({
            doc: _id,
            invited: false,
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
        return Memberships.findOne({
            "owners": Meteor.userId(),
            joinedAt: {
                $not: void 0
            }
        }, {
            sort: {
                createdAt: -1
            }
        });
    }
});

Template.registerHelper('membershipsByCollection', function(collection) {
    var Memberships, members;
    if (typeof window['Memberships'] !== 'undefined') {
        Memberships = [];
        members = window['Memberships'].findOne({
            "owners": Meteor.userId(),
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
        });
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
    return !!Memberships.findOne({
        doc: _id,
        joinedAt: {
            $exists: true,
            $not: {
                $size: 0
            }
        },
        invitee: {
            $exists: true,
            $not: {
                $size: 0
            }
        }
    });
});

Template.registerHelper('userIsItemOwner', function(_id, docType) {
    var m;
    m = Mongo.Collection.get(docType.toLowerCase()).findOne(_id);
    if (m && m.owners.indexOf(Meteor.userId()) > -1) {
        return true;
    }
    return false;
});


