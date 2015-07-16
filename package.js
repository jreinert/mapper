Package.describe({
	name: 'jreinert:mapper',
	version: '0.0.7',
	summary: 'An ODM (Object-Document Mapper) for Meteor',
	git: 'https://github.com/jreinert/mapper.git',
	documentation: 'README.md'
});

Package.onUse(function(api) {
	api.versionsFrom('1.1.0.2');
	api.use('underscore');
	api.addFiles('lib/helpers.js');
	api.addFiles('lib/mapper_model.js');
	api.export('MapperModel');
});

Package.onTest(function(api) {
	api.use('sanjo:jasmine@0.14.0');
	api.use('jreinert:mapper');
	api.use('mongo');
	api.addFiles(['tests/test_model.js', 'tests/fixtures.js']);
	api.addFiles('tests/server/model-spec.js', 'server');
});
