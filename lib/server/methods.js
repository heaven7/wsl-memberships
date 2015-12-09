Meteor.methods({
    requestMembershipByEmail: function(doc, docType) {
        var exist, from, id, item, m, owner, owneremail, subject, text, to, url;
        check([doc, docType], [String]);
        this.unblock();
        item = Meteor.call('_getRessource', doc, docType);

        owner = Meteor.call('_getRessourceOwner', item.owners[0]);
        owneremail = owner.emails[0].address;

        exist = Memberships.findOne({
            doc: doc,
            docType: docType,
            joinedAt: {
                $gt: 0
            },
            invitee: Meteor.userId()
        });
        if (exist && exist.length > 0) {
            console.log('membership already exists: ' + EJSON.stringify(exist));
            throw new Error('membership already exists');
            return false;
        }
        id = Meteor.call('_createMembership', doc, docType, false);
        m = Memberships.findOne({
            _id: id
        });
        url = Memberships.urls.accept(m.token, doc, docType);
        console.log('membership: ' + EJSON.stringify(m));
        if (m && owneremail && url) {
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
        this.unblock();
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
        this.unblock();
        console.log('acceptMembership method: ');
        check([token], [String]);
        if (token && token.length > 0) {
            var m = Memberships.findOne({token: token});
            var ressourceOwner = m.ressourceOwner;
            var currentUserEmail = Meteor.user().emails[0].address;
            var memberShipOwner = Meteor.users.findOne({_id: m.owners[0]});
            var invitee;

            if(!m) {
                console.log('membership request not found');
                return false;
            }

            if(m && m.email != currentUserEmail && m.invited == true) {
                console.log('user is not allowed to accept this request');
                return false;
            }

            if(m && ressourceOwner != Meteor.userId() && m.invited == false) {
                console.log('user is not allowed to accept this request');
                return false;
            }

            // invitation
            if(m.email && m.invited == true) {
                invitee = Meteor.users.findOne({"emails.address" : currentUserEmail});
            }

            // user wants to join the ressource
            if(m && ressourceOwner == Meteor.userId() && m.invited == false) {
                invitee = memberShipOwner;
            }


            if (m && m.token.length > 0) {
                Memberships.update({
                    _id: m._id
                }, {
                    $set: {
                        joinedAt: new Date(),
                        invitee: invitee._id
                    },
                    $unset: {
                        token: token
                    }
                }, function (err, res) {
                    console.log('error: ', err, 'result: ', res);
                });
                return true;
            } else {
                console.log('no membership found to accept (wrong token?)');
                return false;
            }
        } else {
            console.log('no token given for acception');
            return false;
        }
    },
    _createMembership: function(doc, docType, invited, email) {
        var m, invitedAt,
            ressource = Meteor.call('_getRessource', doc, docType),
            token = Memberships.generateToken();

        if(invited)
            invitedAt = Date.now();

        m = Memberships.insert({
            doc: doc,
            owners: [Meteor.userId()],
            createdAt: Date.now(),
            docType: docType,
            token: token,
            invited: invited,
            invitedAt: invitedAt,
            email: email,
            ressourceOwner: ressource.owners[0]
        });
        console.log('_createMembership: ' + m);
        return m;
    },

    /**
     * inviteMembersByEmail
     * check, if emails already exist.
     * only non-existend users will get an invitation
     * @param data all data sent from the form
     */
    inviteMembersByEmail: function(data) {
        this.unblock();
        check(data, Schemas.InviteMembers);

        var doc = data.doc,
            docType = data.docType,
            // http://stackoverflow.com/questions/10346722/how-can-i-split-a-javascript-string-by-white-space-or-comma#23728809
            emails = data.emails.split(/[ ,]+/).filter(Boolean),
            item = Meteor.call('_getRessource', doc, docType);

        emails.forEach(function (email) {
            Meteor.call('_sendInvitation', email, doc, docType, item);
        });

    },
    _sendInvitation: function(email, doc, docType, item) {

        if(!Memberships.findOne({email: email})) {
            var id = Meteor.call('_createMembership', doc, docType, true, email);
            var m = Memberships.findOne({ _id: id});
            var url = Memberships.urls.accept(m.token, doc, docType);
            var to = email;
            var from = Accounts.emailTemplates.from;
            var subject = '(' + Accounts.emailTemplates.siteName + ') Join ' + item.title;
            var text = '';
            var html = Handlebars.templates['send-invite']({
                url: url,
                email: email,
                ressource: item,
                ressourceType: docType

            });

            //console.log('sendMail', to, from, subject, text, html);
            return Meteor.call('sendMail', to, from, subject, text, html);

        } else {
            throw new Meteor.Error('membership already exists');
        }
    }
});
