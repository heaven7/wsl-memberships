Meteor.methods({
    requestMembershipByEmail: function(doc, docType) {
        var exist, from, id, item, m, owner, owneremail, subject, text, to, url, user;
        check([doc, docType], [String]);
        this.unblock();
        user = Meteor.user();
        item = Meteor.call('_getRessource', doc, docType);

        owner = Meteor.call('_getRessourceOwner', item.owners[0]);
        owneremail = owner[0].emails[0].address;
        exist = Memberships.find({
            doc: doc,
            docType: docType,
            owner: item.owner,
            joinedAt: {
                $gt: 0
            }
        }).fetch();
        if (exist && exist.length > 0) {
            console.log('membership already exists: ' + EJSON.stringify(exist));
            return 'membership already exists';
        }
        id = Meteor.call('_createMembership', doc, docType, item.owner);
        m = Memberships.find({
            _id: id
        }).fetch();
        url = Memberships.urls.accept(m[0].token, doc, docType);
        console.log('membership: ' + EJSON.stringify(m));
        if (m.length > 0 && owneremail && owneremail.length > 0 && url.length > 0) {
            to = owneremail;
            from = Accounts.emailTemplates.from;
            subject = '(' + Accounts.emailTemplates.siteName + ') Membership request';
            text = 'membership request from\n' + '<a href="' + url + '">accept membership</a>';
            return Meteor.call('sendMail', to, from, subject, text);
        } else {
            return console.log('no owneremail');
        }
    },
    cancelMembership: function(doc) {
        check([doc], [String]);
        if (Memberships.remove({
                doc: doc
            })) {

        } else {
            console.log('error cancelling membership of: ' + doc);
            return 'error';
        }
    },
    acceptMembership: function(token) {
        var m, u;
        check([token], [String]);
        if (token && token.length > 0) {
            m = Memberships.find({
                token: token
            }).fetch();
            if (m && m[0] && m[0]._id.length > 0) {
                u = Memberships.update({
                    _id: m[0]._id
                }, {
                    $set: {
                        joinedAt: new Date()
                    },
                    $unset: {
                        token: token
                    }
                });
                return console.log('acceptMembership: ' + u);
            } else {
                return console.log('no membership found to accept (wrong token?)');
            }
        } else {
            return console.log('no token given for acception');
        }
    },
    _createMembership: function(doc, docType, owner) {
        var m, token;
        token = Memberships.generateToken();
        m = Memberships.insert({
            doc: doc,
            docType: docType,
            owner: owner,
            token: token
        });
        console.log('_createMembership: ' + m);
        return m;
    }
});
