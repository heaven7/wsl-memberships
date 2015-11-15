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
            joinedAt: {
                $gt: 0
            }
        }).fetch();
        if (exist && exist.length > 0) {
            console.log('membership already exists: ' + EJSON.stringify(exist));
            return 'membership already exists';
        }
        id = Meteor.call('_createMembership');
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
    _createMembership: function(doc, docType) {
        var m, token;
        token = Memberships.generateToken();
        m = Memberships.insert({
            token: token
        });
        console.log('_createMembership: ' + m);
        return m;
    },
    /**
     * inviteMembers
     * check, if emails already exist.
     * if not user can assign name to email and send an invitation
     * @param data all data sent from the form
     */
    inviteMembers: function(data) {
        check(data.doc, String);
        check(data.docType, String);
        check(data.emails, String);

        // http://stackoverflow.com/questions/10346722/how-can-i-split-a-javascript-string-by-white-space-or-comma#23728809
        var emails = data.emails.split(/[ ,]+/).filter(Boolean),
            already_users = [], invite_users = [],
            currentUser = Meteor.user(),
            item = Meteor.call('_getRessource', data.doc, data.docType),
            owner = item.owners[0];

        emails.forEach(function (email) {
            var user = Accounts.findUserByEmail(email);
            if(user) {
                already_users.push(user);
            } else {
                invite_users.push(email);
            }
        });

        // send email to existing users and
        // invite new users
        console.log('notify existing users: ' + already_users);
        console.log('please give a name to this email-adress(es): ' + invite_users);
        return true;
    }
});
