/**
 * Memberships schema
 * @type {SimpleSchema} Schemas.Memberships
 */

Schemas.Memberships = new SimpleSchema([Schemas.Base,{

    email: {
        type: String,
        optional: true
    },

    invited: {
        type: Boolean,
        defaultValue: false
    },

    ressourceOwner: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },

    invitee: {
        type: String,
        optional: true,
        regEx: SimpleSchema.RegEx.Id
    },

    invitedAt: {
        type: Date,
        optional: true
    },

    joinedAt: {
        type: Date,
        optional: true
    },

    roles: {
        type: [String],
        optional: true
    },

    token: {
        type: String,
        optional: true
    }
}]);


/**
 * InviteMembers schema
 * @type {SimpleSchema} Schemas.InviteMembers
 */

Schemas.InviteMembers = new SimpleSchema({
    doc: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },

    docType: {
        type: String
    },

    emails: {
        type: [Object]
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    }
});

/**
 * InviteMembersWithRoles schema
 * @type {SimpleSchema} Schemas.InviteMembersWithRoles
 */

Schemas.InviteMembersWithRoles = new SimpleSchema({
    doc: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },

    docType: {
        type: String
    },

    emails: {
        type: [Object]
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.roles": {
        type: [String],
        optional: true,
        blackbox: true,
        autoform: {
            type: "select-checkbox",
            options: function() {
                return _.map(WSL.memberships.roles, function(role) {
                    return {label: i18n.t(role), value: role}
                })
            }
        }
    }
});

/**
 * Attach schema
 */

Memberships.attachSchema(Schemas.Memberships);
