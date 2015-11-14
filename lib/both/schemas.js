/**
 * Memberships schema
 * @type {SimpleSchema} Schemas.Memberships
 */

Schemas.Memberships = new SimpleSchema([Schemas.Base,{

    invited: {
        type: Boolean,
        defaultValue: false
    },
    joinedAt: {
        type: Date,
        optional: true
    },
    token: {
        type: String,
        optional: true
    }
}]);

/**
 * Invite Members schema
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
        type: String,
        optional: false
    }
});

/**
 * Attach schema
 */

Memberships.attachSchema(Schemas.Memberships);
