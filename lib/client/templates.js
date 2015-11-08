Template.membershipButton.events({
    'click .btn-membership': function(e, t) {
        var doc, docType;
        doc = $(e.currentTarget).attr('doc');
        docType = $(e.currentTarget).attr('docType');
        return Meteor.call('requestMembershipByEmail', doc, docType, function(error) {
            if (error) {
                return wAlert.error(error.message);
            } else {
                return wAlert.success('You requested a membership for this. An Email is sent to the owner.');
            }
        });
    },
    'click .btn-cancel-membership': function(e, t) {
        return Meteor.call('cancelMembership', $(e.currentTarget).attr('doc'), function(error) {
            if (error) {
                return wAlert.error(error.message);
            } else {
                return wAlert.success('Membership cancelled.');
            }
        });
    }
});
