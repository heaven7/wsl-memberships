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

    invitedAt: {
        type: Date,
        optional: true
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
 * Attach schema
 */

Memberships.attachSchema(Schemas.Memberships);
