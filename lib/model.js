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

});
