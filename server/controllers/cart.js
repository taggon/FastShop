'use strict';

module.exports = function(app) {
	app.get('/cart', function(req, res){

	});

	app.get('/api/cart', function(req, res){
		/*
		if (!req.session.user) {
			res.status(403).json({error:'회원 권한이 필요합니다.'});
			return false;
		}
		*/

		var userId = /*req.session.user.id*/1;

		db.all('SELECT option_id, quantity FROM carts WHERE user_id=?', userId, function(err, rows){
			if (err) {
				console.error(err.stack);
				return res.status(500).json({error:'데이터베이스 에러: '+err});
			}

			ProductOption.find({$id:_.pluck(rows, 'option_id')})
				.then(function(options) {
					var productIds = [];

					_.each(options, function(opt){
						var row = _.findWhere(rows, {option_id:opt.id});

						productIds.push(+opt.get('product_id'));
						_.extend(row, _.pick(opt.toJSON(), 'product_id', 'color', 'size', 'stock'));
						row.id = opt.id;
						delete row.option_id;
					});

					return Product.find({$id:productIds});
				})
				.then(function(products) {
					_.each(products, function(product){
						_.chain(rows).where({product_id:product.id}).each(function(row){
							row.product = product.toJSON();
							delete row.product_id;
							delete row.product.options;
						});
					});

					res.json({status:1, statusText:'OK', items:rows});
				})
				.fail(function(err) {
					console.error(err.stack);
					return res.status(500).json({error:'데이터베이스 에러: ' + err});
				});
		});
	});

	app.post('/api/cart', function(req, res){
		/*
		if (!req.session.user) {
			res.status(403).json({error:'회원 권한이 필요합니다.'});
			return false;
		}*/

		if (!+req.body.option_id) {
			return res.status(400).json({error:'option_id를 설정하세요.'});
		}

		var where = {
			$user_id : /*req.session.user_id*/1,
			$option_id : +req.body.option_id
		};

		db.get(
			'SELECT * FROM carts WHERE user_id=$user_id AND option_id=$option_id',
			where,
			function(err, row) {
				var sql = '';

				if (err) {
					console.error(err.stack);
					return res.status(500).json({error:'데이터베이스 에러: ' + err});
				}

				// set quantity value
				where.$quantity = +req.body.quantity || 1;

				if (row) {
					sql = 'UPDATE carts SET quantity=quantity+$quantity WHERE user_id=$user_id AND option_id=$option_id';
				} else {
					sql = 'INSERT INTO carts (user_id, option_id, quantity) VALUES ($user_id, $option_id, $quantity)';
				}

				db.run(sql, where, function(err){
					if (err) {
						console.error(err.stack);
						return res.status(500).json({error:'데이터베이스 에러: '+err});
					}
					res.json({status:1, statusText:'OK'});
				});
			}
		);
	});

	app.put('/api/cart/:option_id', function(req, res){
		if (!req.session.user) {
			res.status(403).json({error:'회원 권한이 필요합니다.'});
			return false;
		}

		var where = {
			$user_id : req.session.user.id,
			$option_id : req.params.option_id
		};

		db.get(
			'SELECT * FROM carts WHERE user_id=$user_id AND option_id=$option_id',
			where,
			function(err, row){
				if (err) return res.status(500).json({error:'데이터베이스 에러: '+err});

				where.$quantity = req.body.quantity;

				db.run(
					'UPDATE carts SET quantity=$quantity WHERE user_id=$user_id AND option_id=$option_id',
					where,
					function(err) {
						if (err) return res.status(500).json({error:'데이터베이스 에러: '+err});
						res.json({status:1, statusText:'OK'});
					}
				);
			}
		);
	});

	app.delete('/api/cart/:option_id', function(req, res){
		if (!req.session.user) {
			res.status(403).json({error:'회원 권한이 필요합니다.'});
			return false;
		}

		db.run(
			'DELETE FROM carts WHERE user_id=$user_id AND option_id=$option_id',
			{$user_id:req.session.user.id, $option_id:req.params.option_id},
			function(err) {
				if (err) return res.status(500).json({error:'데이터베이스 에러'});
				res.json({status:1, statusText:'OK'});
			}
		);
	});
};
