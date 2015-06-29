describe('Model', function () {
	describe('static functions', function () {
		beforeEach(function () {
			TestModel.collection.remove({});
		});

		describe('where', function () {
			it('returns a cursor over documents maching the query', function () {
				_.each(Fixtures.documents, TestModel.collection.insert, TestModel.collection);
				TestModel.collection.insert({name: 'find me'});
				TestModel.collection.insert({name: 'find me'});
				expect(TestModel.where({name: 'find me'}).count()).toEqual(2);
			});

			it('transforms the documents into model instances', function () {
				TestModel.collection.insert({name: 'a test'});
				var instance = TestModel.where({name: 'a test'}).fetch()[0];
				expect(instance._attributes).toBeDefined();
				expect(instance._attributes.name).toEqual('a test');
			});
		});

		describe('all', function () {
			it('returns a cursor over all documents', function () {
				_.each(Fixtures.documents, TestModel.collection.insert, TestModel.collection);
				expect(TestModel.all().count()).toEqual(Fixtures.documents.length);
			});

			it('calls where with an empty query and passed options', function () {
				spyOn(TestModel, 'where');
				var options = { sort: { name: -1 }};
				TestModel.all(options);
				expect(TestModel.where).toHaveBeenCalledWith({}, options);
			});
		});
	});
});
