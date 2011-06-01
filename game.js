(function (window, document) {
	if (!this.Mocha) {
		load('mocha.js');
	}

	var game, images, emotes, repaint, width, height, states, state;
	emotes = ['angry', 'bigsmile', 'blush', 'confused', 'cool', 'cry', 'eek', 'important', 'kiss', 'lol', 'neutral', 'sad', 'sick', 'smile', 'surprised', 'think', 'tongue', 'twisted', 'wink'];
	width = 640;
	height = 480;
	states = {};
	game = {
		width: width,
		height: height
	};

	function createArray(length, defaultValue) {
		var arr = [], j;
		for (j = 0; j < length; j += 1) {
			arr[j] = defaultValue;
		}

		return arr;
	}

	function rand(min, max) {
		return min + Math.random() * (max - min);
	}

	game.init = function(context) {
		state = 'loading';

		/* Load all images and render them into a canvas buffer */
		var count = 0, queue = [];
		images = {};

		queue.push({
			name: 'logo',
			src: 'images/logo.png'
		});

		queue.push({
			name: 'cloud',
			src: 'images/cloud.png'
		});

		queue.forEach(function (item) {
			context.loadImage(item.src, function (result) {
				images[item.name] = result;
				count += 1;
				if (count === queue.length) {
					state = 'title';
				}
			});
		});
	};

	game.start = function () {};

	game.update = function (delta) {
		states[state].update(delta);
	};

	game.render = function (ctx) {
		states[state].render(ctx);
	};

	/* Loading screen */
	states.loading = {
		update: function (delta) {},
		render: function (ctx) {
			ctx.setColor('#30a1f0');
			ctx.fillRect(0, 0, width, height);
		}
	};

	/* Title screen */
	states.title = (function () {
		var clouds, Cloud;
		Cloud = function () {
			this.reset();
			this.x = rand(0, width);
		};

		Cloud.prototype.reset = function () {
			this.x = width;
			this.y = rand(0, height);
			this.vx = rand(-1.0, -2.0);
		};

		Cloud.prototype.update = function (delta) {
			this.x += this.vx * (delta / 10);
			if (this.x < -260) {
				this.reset();
			}
		};

		Cloud.prototype.render = function (ctx) {
			ctx.drawImage(images.cloud, this.x, this.y);
		};

		clouds = createArray(10).map(function () {
			return new Cloud();
		});

		return {
			update: function (delta) {
				clouds.forEach(function (cloud) {
					cloud.update(delta);
				});
			},

			render: function (ctx) {
				ctx.setColor('#30a1f0');
				ctx.fillRect(0, 0, width, height);

				clouds.forEach(function (cloud) {
					cloud.render(ctx);
				});

				ctx.drawImage(images.logo, 0, 0);
			}
		};
	}());

	new Mocha(game).start();

}(this, this.document));
