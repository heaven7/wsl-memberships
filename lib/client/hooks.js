Memberships.before.insert(function (userId, doc) {
	doc.owners = typeof doc.owners == 'array' ? doc.owners : [];
	doc.owners.push(userId);
	doc.createdAt = Date.now();
});