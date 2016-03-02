/**
 * Memberships Mongo Collection
 * @type {Mongo.Collection} Memberships
 */

Memberships = new Meteor.Collection('memberships');

/**
 * Ensure index
 */

/*
if(Meteor.isServer) {
    Memberships._ensureIndex({ joinedAt: "date" });
}
*/
Meteor.startup(() => {
    /**
     * WSL memberships settings and methods.
     * @namespace WLS.memberships
     * @type {Object} WSL.memberships
     */

    WSL.memberships = {}

    /**
     * WSL memberships roles
     * Specify if the invitation is connected to a set of roles
     * @namespace WLS.memberships.roles
     * @type {Array} WSL.memberships.roles
     */

    WSL.memberships.roles = []
})
