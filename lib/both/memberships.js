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
