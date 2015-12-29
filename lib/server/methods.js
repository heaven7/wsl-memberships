Meteor.methods({
    requestMembershipByEmail: function(doc, docType) {
        var item, owner, owneremail, invited;
        check([doc, docType], [String]);
        this.unblock();

        item = Meteor.call('_getRessource', doc, docType);
        owner = Meteor.call('_getRessourceOwner', item.owners[0]);
        owneremail = owner.emails[0].address;
        invited = false;

        if (owneremail) {
            Meteor.call('prepareMembership', owneremail, doc, docType, item, invited);
        } else {
            throw new Meteor.Error('no owneremail');
            return false;
        }
    },
    cancelMembership: function(doc) {
        this.unblock();
        check([doc], [String]);
        if (Memberships.remove({doc: doc})) {
            return true;
        } else {
            throw new Meteor.Error('cannot cancel membership');
            return false;
        }
    },
    acceptMembership: function(token) {
        var m, ressourceOwner, memberShipOwner, invitee,
            currentUserEmail = Meteor.user().emails[0].address;
        this.unblock();
        console.log('acceptMembership method: ');
        check([token], [String]);
        if (token && token.length > 0) {
            m = Memberships.findOne({token: token});
            ressourceOwner = m.ressourceOwner;
            memberShipOwner = Meteor.users.findOne({_id: m.owners[0]});

            if(!m) {
                throw new Meteor.Error('membership request not found');
                return false;
            }

            if(m && m.email != currentUserEmail && m.invited == true) {
                throw new Meteor.Error('user is not allowed to accept this request');
                return false;
            }

            if(m && ressourceOwner != Meteor.userId() && m.invited == false) {
                throw new Meteor.Error('user is not allowed to accept this request');
                return false;
            }

            // invitation
            if(m.email && m.invited == true) {
                invitee = Meteor.users.findOne({"emails.address" : currentUserEmail});

                // add roles to user if so
                if(m.roles) {
                    Meteor.call('addUserToRoles', Meteor.userId(), m.roles, m.doc);
                    // set permissions of nested collections
                    m.roles.forEach(function(role) {
                        var splits = role.split('role_');
                        var collectionName = splits[1];
                        var items = Mongo.Collection.get(collectionName).find({doc: m.doc}).fetch();

                        items.forEach(function(item) {
                            Meteor.call('addUserToRoles', Meteor.userId(), [role], item._id);
                        });
                    });
                }
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
                throw new Meteor.Error('no membership found to accept (wrong token?)');
                return false;
            }
        } else {
            throw new Meteor.Error('no token given for acception');
            return false;
        }
    },
    _createMembership: function(doc, docType, invited, email, roles) {
        var m, invitedAt,
            ressource = Meteor.call('_getRessource', doc, docType),
            token = Memberships.generateToken();

        if(invited)
            invitedAt = Date.now();

        m = Memberships.insert({
            doc: doc,
            docType: docType,
            owners: [Meteor.userId()],
            createdAt: Date.now(),
            token: token,
            invited: invited,
            invitedAt: invitedAt,
            email: email,
            roles: roles,
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
        check(data, Schemas.InviteMembersWithRoles);

        var doc = data.doc,
            docType = data.docType,
            // http://stackoverflow.com/questions/10346722/how-can-i-split-a-javascript-string-by-white-space-or-comma#23728809
            //emails = data.emails.split(/[ ,]+/).filter(Boolean),
            emails = data.emails,
            item = Meteor.call('_getRessource', doc, docType),
            invited = true;


        emails.forEach(function (email) {
            Meteor.call('prepareMembership', email.address, doc, docType, item, invited, email.roles);
        });

    },
    prepareMembership: function(email, doc, docType, item, invited, roles) {
        var m, id, to, from, subject, text, buttontext, url, ressourceType, owner, ownername,
            username, html, hello, title, host = Accounts.emailTemplates.siteName;

        if(!Memberships.findOne({email: email})) {

            ressourceType = i18n.t(docType.toLowerCase(), count=1);
            if(invited) {
                id = Meteor.call('_createMembership', doc, docType, invited, email, roles);
                owner = Memberships.findOne({ _id: id}).ressourceOwner;
                ownername = Meteor.users.findOne({ _id: owner}).username;
                if(Meteor.users.findOne({"emails.address": email})) {
                    username = Meteor.users.findOne({"emails.address": email}).username;
                } else {
                    username = i18n.t('you');
                }
                hello = i18n.t('hello_user', {username: username});
                subject = i18n.t('subject_user_is_invited_to_join_ressource', {username: ownername, ressourceTitle: item.title, host: host});
                text = i18n.t('user_is_invited_to_join_ressource', {username: ownername, ressourceTitle: item.title, ressourceType: ressourceType});
                buttontext = i18n.t('join');
            } else {
                id = Meteor.call('_createMembership', doc, docType, invited);
                owner = Memberships.findOne({ _id: id}).ressourceOwner;
                ownername = Meteor.users.findOne({ _id: owner}).username;
                hello = i18n.t('hello_user', {username: ownername});
                username = Meteor.user().username;
                subject = i18n.t('subject_user_wants_to_join_ressource', {username: username, ressourceTitle: item.title, host: host});
                text = i18n.t('user_wants_to_join_ressource', {username: username, ressourceTitle: item.title, ressourceType: ressourceType});
                buttontext = i18n.t('accept');
            }

            m = Memberships.findOne({ _id: id});
            url = Memberships.urls.accept(m.token, doc, docType);
            to = email;
            from = Accounts.emailTemplates.from;
            teamName = host;

            html = Handlebars.templates['send-request']({
                url: url,
                hello: hello,
                text: text,
                buttontext: buttontext,
                teamName: teamName
            });

            //console.log('sendMail', to, from, subject, html);
            return Meteor.call('sendMail', to, from, subject, html);

        } else {
            throw new Meteor.Error('membership already exists');
        }
    }
});
