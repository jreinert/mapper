Package.describe({
	name: 'jreinert:mapper',
	version: '0.0.1',
	summary: 'An ODM (Object-Document Mapper) for Meteor',
	git: 'https://github.com/jreinert/mapper.git',
	documentation: 'README.md'
});

Package.onUse(function(api) {
	api.versionsFrom('1.1.0.2');
});
