describe('Model', function () {
	describe('constructor', function () {
		it('stores all attributes from a persisted document in _attributes', function () {
			var instance = new TestModel({_id: 'foo', name: 'test', color: 'green'});
			expect(instance._attributes).toBeDefined();
			expect(instance._attributes.name).toEqual('test');
			expect(instance._attributes.color).toEqual('green');
		});

		it('stores the _id property in id and _id', function () {
			var instance = new TestModel({_id: 'an id'});
			expect(instance._id).toEqual('an id');
			expect(instance.id).toEqual('an id');
		});

		it('sets _changedAttributes to the given document if it is not yet persisted', function () {
			var instance = new TestModel({foo: 'bar'});
			expect(instance._changedAttributes).toEqual({foo: 'bar'});
		});

		it ('sets _changedAttributes to {} if the document is persisted', function () {
			var instance = new TestModel({_id: 'foo', bar: 'baz'});
			expect(instance._changedAttributes).toEqual({});
		});

		it ('stores defaults in _changedAttributes if _attributes does not have them', function () {
			var ModelWithDefaults = TestModel.extend({
				defaults: {
					foo: 'bar',
					test: 'green'
				}
			});
			var instance = new ModelWithDefaults({foo: 'baz'});
			expect(instance._changedAttributes).toEqual({foo: 'baz', test: 'green'});
			instance = new ModelWithDefaults({_id: 'id', foo: 'baz'});
			expect(instance._changedAttributes).toEqual({test: 'green'});
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

	describe('hasChanged', function () {
		describe('without arguments', function () {
			it ('returns true if and only if _changedAttributes is not empty', function () {
				var instance = new TestModel();
				instance._changedAttributes = {name: 'test'};
				expect(instance.hasChanged()).toBe(true);
				instance._changedAttributes = {};
				expect(instance.hasChanged()).toBe(false);
			});
		});
		describe('with key as argument', function () {
			it ('returns true if and only if _changedAttributes has that key', function () {
				var instance = new TestModel();
				instance._changedAttributes = {something: false};
				expect(instance.hasChanged('something')).toBe(true);
				expect(instance.hasChanged('something else')).toBe(false);
			});
		});
	});

	describe('get', function () {
		it ('returns the value for a given key from _attributes/_changedAttributes', function () {
			var instance = new TestModel({test: 'green'});
			expect(instance.get('test')).toEqual('green');
		});
	});

	describe('setAttributes', function () {
		it ('adds given key value pairs to _changedAttributes', function () {
			var instance = new TestModel({test: 'red'});
			instance.setAttributes({test: 'green', foo: 'bar'});
			expect(instance._changedAttributes).toEqual({test: 'green', foo: 'bar'});
		});

		it ('removes values from _changedAttributes that are changed back to persisted state', function () {
			var instance = new TestModel({_id: 'id', test: 'red'});
			instance.setAttributes({test: 'green', foo: 'bar'});
			expect(instance._changedAttributes).toEqual({test: 'green', foo: 'bar'});
			instance.setAttributes({test: 'red'});
			expect(instance._changedAttributes).toEqual({foo: 'bar'});
		});

		it ('returns current attributes', function () {
			var instance = new TestModel({_id: 'id', test: 'red'});
			var result = instance.setAttributes({test: 'green', foo: 'bar'});
			expect(result).toEqual({test: 'green', foo: 'bar'});
		});
	});

	describe('set', function () {
		it ('sets the given key value pair in _changedAttributes', function () {
			var instance = new TestModel();
			instance.set('foo', 'bar');
			expect(instance._changedAttributes).toEqual({foo: 'bar'});
		});

		it ('delegates to setAttributes', function () {
			var instance = new TestModel();
			spyOn(instance, 'setAttributes');
			instance.set('foo', 'bar');
			expect(instance.setAttributes).toHaveBeenCalledWith({foo: 'bar'});
		});	

		it ('returns the set value', function () {
			var instance = new TestModel();
			expect(instance.set('foo', 'bar')).toEqual('bar');
		});
	});

	describe('push', function () {
		it ('adds given values to an array attribute', function () {
			var instance = new TestModel({fruit: ['apples']});
			instance.push('fruit', 'oranges');
			expect(instance._changedAttributes).toEqual({fruit: ['apples', 'oranges']});
			instance.push('fruit', 'pears', 'pineapples');
			expect(instance._changedAttributes).toEqual({
				fruit: ['apples', 'oranges', 'pears', 'pineapples']
			});
		});

		it ('returns the new length of the array attribute', function () {
			var instance = new TestModel({fruit: ['apples']});
			var result = instance.push('fruit', 'oranges');
			expect(result).toEqual(2);
		});

		it ('creates an array attribute with the given value if not present', function () {
			var instance = new TestModel();
			instance.push('fruit', 'oranges');
			expect(instance._changedAttributes).toEqual({fruit: ['oranges']});
		});
	});

	describe('pull', function () {
		it ('removes given values from an array attribute', function () {
			var instance = new TestModel({
				fruit: ['apples', 'apples', 'oranges', 'pears', 'pineapples']
			});
			instance.pull('fruit', 'apples');
			expect(instance._changedAttributes).toEqual({
				fruit: ['apples', 'oranges', 'pears', 'pineapples']
			});
			instance.pull('fruit', 'apples', 'oranges');
			expect(instance._changedAttributes).toEqual({
				fruit: ['pears', 'pineapples']
			});
		});

		it ('returns the actually removed elements', function () {
			var instance = new TestModel({fruit: ['apples', 'oranges']});
			var result = instance.pull('fruit', 'oranges', 'pineapples');
			expect(result).toEqual(['oranges']);
			result = instance.pull('fruit', 'apples');
			expect(result).toEqual('apples');
		});
	});
});
