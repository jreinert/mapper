Model = function (doc) {
	doc = _.extend({}, doc);
	var attributes = _.omit(doc, '_id');
	this._attributes = _.extend({}, this.constructor.defaults, attributes);
	this._id = this.id = doc._id;
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
	}
});

Model.extend = extend;
