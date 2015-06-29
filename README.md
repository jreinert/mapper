# Mapper

An ODM (Object-Document Mapper) for Meteor.

## Features

- Plain javascript, only dependency is underscore
- Basic CRUD functionality
- Dirty-Tracking
- Well tested

## WIP

- Relations (has many, belongs to, etc.)
- Reactive getters in client

## TODO

- Validation
- Coercion

## Model definition

``` javascript
MyModel = MapperModel.extend({
	collection: new Mongo.Collection('foobar'),
	defaults: {
		name: 'foo',
		createdAt: function () { return new Date() }
	}
});
```

For extending the model prototype pass a second object with prototype functions:

``` javascript
MyModel = MapperModel.extend({
	collection: new Mongo.Collection('foobar')
},{
	isPublished: function () {
		if (!this.get('publishedFlag')) return false;
		return this.get('publishingDate') <= new Date();
	}
});
```

## Usage

``` javascript
var instance = new MyModel({foo: 'bar'});
instance.isPersisted();
// false
instance.save();
// true
instance.isPersisted();
// true

instance = MyModel.create({foo: 'bar'});
instance.isPersisted();
// true
instance.getAttributes();
// {name: 'foo', createdAt: Mon Jun 29 2015 17:57:10 GMT+0200 (CEST), foo: 'bar'}
instance.set('name', 'bar');
instance.get('name');
// 'bar'
instance.hasChanged();
// true
instance.hasChanged('name');
// true
instance.hasChanged('foo');
// false
instance.save();
// true
instance.hasChanged();
// false
instance.save();
// false

instance = MyModel.find('some_object_id');
var instances = MyModel.where({name: 'bar'});
// where() returns a cursor
instances.forEach(function (instance) {
	console.log(instance.get('name'));
});
instances = MyModel.all();
// so does all()

instance.setAttributes({multiple: 'attributes', at: 'once'});
instance.hasChanged();
// true
instance.updateAttributes({multiple: 'attributes', at: 'once'});
instance.hasChanged();
// false (already persisted)

instance = new MyModel({array: ['foo', 'bar', 'baz']});
instance.push('array', 'foobar', 'foo');
instance.get('array');
// ['foo', 'bar', 'baz', 'foobar', 'foo']
instance.pull('array', 'foobar', 'foo');
instance.get('array');
// ['bar', 'baz', 'foo']

instance.destroy();
instance.isPersisted();
// false
```

## Contribute!

Please post issues at github if you run into bugs or if you're really awesome
fork the repo, fix it yourself and make a pull request.

For questions you can contact me via irc on freenode under the nickname `jokke`.
