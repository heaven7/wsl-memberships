Memberships.urls = {};

Memberships.urls.accept = function(token, doc, docType) {
    var item, url;
    check([doc, docType, token], [String]);
    item = Meteor.call('_getRessource', doc, docType);
    if (item !== void 0) {
        url = Meteor.absoluteUrl(docType + '/' + doc + '/accept/' + token);
        console.log('acceptUrl: ' + url);
        return url;
    } else {
        return console.log('no item found');
    }
};

Memberships.generateToken = function() {
    return Random.secret();
};

Memberships.capitalizeFirstLetter = function(str) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};