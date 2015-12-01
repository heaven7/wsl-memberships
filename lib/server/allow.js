Memberships.allow({
    insert: function(userId, doc) {
        if (doc.owners.indexOf(userId) > -1) {
            return true;
        }
    },
    update: function(userId, doc, fields, modifier) {
        var user = Meteor.users(userId);
        if (doc.email == user.emails[0].address || doc.owners.indexOf(userId) > -1) {
            return true;
        }
    },
    remove: function(userId, doc) {
        if (doc.owners.indexOf(userId) > -1) {
            return true;
        }
    }
});