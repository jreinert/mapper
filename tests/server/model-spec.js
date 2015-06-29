describe('Model', function () {
	describe('constructor', function () {
		it('stores all attributes from given document in _attributes', function () {
			var instance = new TestModel({name: 'test', color: 'green'});
			expect(instance._attributes).toBeDefined();
			expect(instance._attributes.name).toEqual('test');
			expect(instance._attributes.color).toEqual('green');
		});

		it('stores the _id property in id and _id', function () {
			var instance = new TestModel({_id: 'an id'});
			expect(instance._id).toEqual('an id');
			expect(instance.id).toEqual('an id');
		});
	});

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

		describe('find', function () {
			it('returns a single model instance for the given id', function () {
				var id = TestModel.collection.insert({name: 'test'});
				var instance = TestModel.find(id);
				expect(instance._attributes.name).toEqual('test');
				expect(instance.id).toEqual(id);
			});

			it('returns undefined if no document is found', function () {
				var instance = TestModel.find({});
				expect(instance).toBeUndefined();
			});
		});

		describe('findBy', function () {
			it('is an alias for find', function () {
				expect(TestModel.findBy).toEqual(TestModel.find);
			});
		});
	});

	describe('isPersisted', function () {
		it ('returns true if and only if _id is set', function () {
			var instance = new TestModel({_id: 'is set'});
			expect(instance.isPersisted()).toBe(true);
			instance = new TestModel({name: 'is set'});
			expect(instance.isPersisted()).toBe(false);
		});
	});
});
