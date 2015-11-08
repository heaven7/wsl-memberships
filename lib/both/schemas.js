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
 * Attach schema
 */

Memberships.attachSchema(Schemas.Memberships);
