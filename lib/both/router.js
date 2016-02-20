
Router.map(function() {
    return this.route('acceptMembership', {
        path: ':docType/:doc/accept/:token',
        data: function() {
            return {
                token: this.params.token,
                docType: this.params.docType,
                doc: this.params.doc
            };
        },
        subscriptions: function() {
            return [
                Meteor.subscribe('memberships')
            ];
        },
        onBeforeAction: function() {

            var m = Memberships.findOne({
                doc: this.params.doc,
                docType: this.params.docType,
                token: this.params.token
            });
//            console.log(this.data, m);
            if (m !== void 0) {
                Meteor.call('acceptMembership', this.params.token, function(error, result) {
                    console.log('error: ', error, 'result: ', result);
                });
            }
            this.next();
        }
    });
});

/**
 * SignUp route with token
 */

Router.route('signup/:token', {
    path: '/signup/:token',
    template: 'signup',
    onBeforeAction: function() {
        Session.set('inviteToken', this.params.token);
        return this.next();
    }
});

/**
 * Invites route
 */

Router.route('invites', {
    path: '/invites',
    template: 'invites',
    waitOn: function() {
        return Meteor.subscribe('/invites');
    }
});

/**
 * Add invite route to public routes
 */

WSL.routes.public.push('invites');
