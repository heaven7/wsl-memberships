AutoForm.hooks({
    inviteMembersForm: {
        onSubmit: function(insert, doc) {
            console.log('submitted: ', doc);
            //return false;
        },
        onError: function(insert, error, template) {
            console.log('error: ', error);
        },
        onSuccess: function(insert, doc) {
            console.log(doc);
            wAlert.success(i18n.t('invitation_send_successfully'));
        }
    }
});

Memberships.before.insert(function (userId, doc) {
	doc.owners = typeof doc.owners == 'array' ? doc.owners : [];
	doc.owners.push(userId);
	doc.createdAt = Date.now();
});

Meteor.subscribe('memberships');