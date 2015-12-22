Template.membershipsFormBody.onCreated(function() {
    this.doc = new ReactiveVar();
    this.docType = new ReactiveVar();
});

Template.membershipsFormBody.onRendered(function() {
    this.doc.set(this.data.doc);
    this.docType.set(this.data.docType);
});

Template.membershipsFormBody.helpers({
    invite: function() {
        return i18n.t("invite");
    },
    cancel: function() {
        return i18n.t("cancel");
    },
    doc: function() {
        return Template.instance().doc.get();
    },
    docType: function() {
        return Template.instance().docType.get();
    }
});

Template.inviteMembersForm.helpers({
    inviteMembersSchema: function() {
        return Schemas.InviteMembers;
    }
});

Template.inviteMembersWithRolesForm.helpers({
    inviteMembersWithRolesSchema: function() {
        return Schemas.InviteMembersWithRoles;
    }
});