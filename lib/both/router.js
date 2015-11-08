Router.map(function() {
    return this.route('acceptMembership', {
        path: ':docType/:doc/accept-membership/:token',
        data: function() {
            return {
                token: this.params.token,
                docType: this.params.docType,
                _id: this.params.doc
            };
        },
        waitOn: function() {
            return [Meteor.subscribe('memberships')];
        },
        onBeforeAction: function() {
            var m;
            this.next();
            m = Memberships.findOne({
                doc: this.params.doc,
                docType: this.params.docType,
                token: this.params.token
            });
            if (m !== void 0) {
                return Meteor.call('acceptMembership', this.params.token);
            }
        }
    });
});
