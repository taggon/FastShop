'use strict';

module.exports = function() {
	var ProductOption = Base.extend({
		table : 'product_options',
		fields : ['product_id','name','stock','order','active'],
		initialize : function(attrs) {
			this.set('name', this.attrs.name);
		},
		set : function(name, value) {
			if (name === 'name') {
				value = value.split('|');
				this.set('color', value[0]);
				this.set('size', value[1]);
				return this;
			}

			return Base.prototype.set.call(this, name, value);
		},
		save : function() {
			this.attrs.name = this.attrs.color + '|' + this.attrs.size;
			return Base.prototype.save.call(this);
		},
		toJSON : function() {
			var obj = _.pick(this.attrs, 'id', 'product_id', 'name', 'stock', 'order', 'active');
			obj.color = this.get('color');
			obj.size  = this.get('size');
			return obj;
		}
	});

	return {name : 'ProductOption', model : ProductOption};
}();
