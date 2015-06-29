Model = function (doc) {
	doc = _.extend({}, doc);
	var attributes = _.omit(doc, '_id');
	this._attributes = _.extend({}, this.constructor.defaults, attributes);
	this._id = this.id = doc._id;
	this._changedAttributes = this.isPersisted() ? {} : this._attributes;
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

});
