/**
 * Memberships Mongo Collection
 * @type {Mongo.Collection} Items
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
