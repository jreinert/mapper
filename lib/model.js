Model = function (doc) {
	doc = _.extend({}, doc);
	this._id = this.id = doc._id;
	if (this.isPersisted()) {
		this._attributes = _.omit(doc, '_id');
		this._changedAttributes = {};
	} else {
		this._attributes = {};
		this._changedAttributes = _.omit(doc, '_id');
	}
	var defaults = {};
	_.each(this.constructor.defaults, function (value, key) {
		if (!_.has(this._attributes, key)) defaults[key] = value;
	}, this);
	_.defaults(this._changedAttributes, defaults);
};

_.extend(Model, {
	where: function (query, options) {
		var model = this;
		return this.collection.find(query, _.extend({
			transform: function (doc) {
				return new model(doc);
			}
		}, options));
	},

	all: function (options) {
		return this.where({}, options);
	},

	find: function (id, options) {
		var model = this;
		return this.collection.findOne(id, _.extend({
			transform: function (doc) {
				return new model(doc);
			}
		}, options));
	}
});

Model.findBy = Model.find;
Model.extend = extend;

_.extend(Model.prototype, {
	isPersisted: function (key, value) {
		return !!this._id;
	},

	hasChanged: function (key) {
		var changed;
		if (key) {
			changed = _.has(this._changedAttributes, key);
		} else {
			changed = !_.isEmpty(this._changedAttributes);
		}
		return changed;
	},

	get: function (key) {
		return _.extend({}, this._attributes, this._changedAttributes)[key];
	},

	setAttributes: function (attributes) {
		var newChangedAttributes = _.omit(this._changedAttributes, _.keys(attributes));
		_.each(attributes, function (value, key) {
			var current = _.extend({}, this._attributes, this._changedAttributes)[key];
			if (!_.isEqual(current, value) && !_.isEqual(this._attributes[key], value)) {
				newChangedAttributes[key] = value;
			}
		}, this);
		this._changedAttributes = newChangedAttributes;

		return _.extend({}, this._attributes, this._changedAttributes);
	},

	set: function (key, value) {
		var attributes = {};
		attributes[key] = value;
		this.setAttributes(attributes);
		return value;
	},

	push: function (key) {
		var elements = _.rest(arguments);
		var result = (this.get(key) || []).concat(elements);
		this.set(key, result);
		return result.length;
	},

	pull: function (key) {
		var elements = _.rest(arguments);
		var current = this.get(key);
		var afterPull = [];
		var deleted = [];
		_.each(current, function (element) {
			var i = _.indexOf(elements, element);
			if (i !== -1) {
				elements.splice(i, 1);
				deleted.push(element);
			} else {
				afterPull.push(element);
			}
		});
		this.set(key, afterPull);
		var result = arguments.length === 2 ? deleted[0] : deleted;
		return result;
	},

	save: function () {
		if (this.isPersisted()) {
			if (!this.hasChanged()) return false;
			this.constructor.collection.update(this._id, {$set: this._changedAttributes});
		} else {
			this._id = this.id = this.constructor.collection.insert(this._changedAttributes);
			if (Meteor.isClient) this.dependency('persisted').changed();
		}
		_.extend(this._attributes, this._changedAttributes);
		this._changedAttributes = {};

		return true;
	}
});
