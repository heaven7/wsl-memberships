
Meteor.publish('membershipsAccepted', function() {
    return Memberships.find({});
});

Meteor.publish('membershipsByDoc', function(_id) {
    return Memberships.find({
        doc: _id
    });
});

Meteor.publish('membershipsByUser', function(_id) {
    return Memberships.find({
        owner: _id
    });
});

Meteor.publish('memberships', function() {
    return Memberships.find();
});