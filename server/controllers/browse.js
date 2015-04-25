'use strict';

module.exports = function(app) {
	// common task
	app.use(function(req, res, next){
		if (/^\/api\//.test(req.path)) return next();

		// get categories
		Category.find({$parent_id : 0})
			.then(function(objs){
				res.locals.categories = _.map(objs, function(obj){ return obj.toJSON(); });
			})
			.fail(function(err){
				console.error('[ERROR] '+err);
			})
			.fin(function(){
				next();
			});

		// in_sale variable
		res.locals.in_sale = (req.body.sale === 'true');
	});

	app.get('/browse', function(req, res){
		res.redirect('/browse/all');
	});

	app.get('/browse/:category', function(req, res){
		var where = {filter:[]};

		_.each(res.locals.categories, function(obj){
			if (req.params.category === obj.slug) {
				res.locals.root_category = obj;
				res.locals.category = obj;
			} else {
				_.each(obj.children, function(child) {
					if (req.params.category === child.slug) {
						res.locals.root_category = obj;
						res.locals.category = child;
						child.is_active = true;
					}
				});
			}
		});

		if (req.params.category != 'all') {
			where.$category_id = [res.locals.category.id];
			_.each(res.locals.category.children, function(c){ where.$category_id.push(c.id); });
		}

		if (req.query.q) {
			where.filter.push('(name LIKE \'%'+req.query.q+'%\' OR description LIKE \'%'+req.query.q+'%\')');
		}

		if (req.query.sale === 'true') {
			where.filter.push('(retail_price > 0)');
		}

		Product.find(where).then(
			function(products){
				res.locals.products = _.map(products, function(product){ return product.toJSON() });
				res.render('category');
			},
			function(err) {
				console.error('[ERROR] '+err);
				res.status(500).send(err);
			}
		);
	});

	app.get('/browse/:category/:product_id', function(req, res){
		Product.get(req.params.product_id)
			.then(function(prod){
				res.locals.product = prod.toJSON();
console.log(res.locals.product);
				return Product.find({$category_id:prod.category.id, filter:'id != '+prod.id, limit:6});
			})
			.then(function(products){
				res.locals.suggestion = _.map(products, function(prod){ return prod.toJSON(); });
			}, function(err){
				console.log(err.stack);
			})
			.fin(function(){
				res.render('product');
			});
	});

	// APIs
	app.get('/api/products', function(req, res){

	});

	// product information
	app.get('/api/products/:product_id', function(req, res){
		Product.get(req.params.product_id).then(function(product){
			res.json(product.toJSON());
		});
	});

	// product options
	app.get('/api/products/:product_id/options(/:color)?', function(req, res){
		ProductOption.find({$product_id:req.params.product_id, orderBy:'`order`'}).then(
			function (options) {
				options = _.map(options, function(opt){ var id = +opt.id; opt = opt.toJSON(); opt.id = id; return opt; });

				if (req.params.color) {
					options = _.where(options, {color:req.params.color.substr(1)});
					options.forEach(function(opt){ opt.name = opt.size; });
				} else {
					options = _.chain(options).pluck('color').unique().value();
				}

				res.json({options:options});
			},
			function (err) {
				console.log(err.stack);
				res.json({error:'데이터베이스 에러: ' + err});
			}
		);
	});
};
