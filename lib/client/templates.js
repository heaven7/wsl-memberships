Template.membershipButton.onCreated(function () {
    this.doc = new ReactiveVar();
    this.docType = new ReactiveVar();

});

Template.membershipButton.onRendered(function() {
    this.doc.set(this.data._id);
    this.docType.set(this.data.collection);
});

Template.membershipButton.events({
    'click .membership': function(e, t) {
        var doc, docType;
        doc = Template.instance().doc.get();
        docType = Template.instance().docType.get();
        return Meteor.call('requestMembershipByEmail', doc, docType, function(error) {
            if (error) {
                return wAlert.error(error.message);
            } else {
                return wAlert.success('You requested a membership for this. An Email is sent to the owner.');
            }
        });
    },
    'click .cancel-membership': function(e, t) {
        return Meteor.call('cancelMembership', Template.instance().doc.get(), function(error) {
            if (error) {
                return wAlert.error(error.message);
            } else {
                return wAlert.success('Membership cancelled.');
            }
        });
    }
});

Template.buttonLink.helpers({
    buttontext: function() {
        return this.buttontext ? this.buttontext : i18n.t("join");
    }
});

Template.membershipPending.helpers({
    cancel: function() {
        return i18n.t("cancel");
    }
});

Template.inviteMembersForm.events({
    'click #cancelMembersForm': function(e, t) {
        Session.set('inviteMembers', '');
        return false;
    }
});
Template.inviteMembersForm.helpers({
    inviteMembersSchema: function() {
        return Schemas.InviteMembers;
    }
});


Template.acceptMembership.helpers({
    ressource: function() {
       var tressource = Mongo.Collection.get(this.docType.toLowerCase()).findOne({
           _id: this.doc
       });
       return tressource;
    },
    ressourceLink: function() {
       return '/' + this.docType.toLowerCase() + '/' + this.doc;
    },
    invited: function() {
        return !!Memberships.findOne({invitee: Meteor.userId(), intited: true});
    }

});