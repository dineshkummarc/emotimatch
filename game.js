(function () {
	var images, emotes, repaint, width, height, states, state;
	emotes = ['angry', 'bigsmile', 'blush', 'confused', 'cool', 'cry', 'eek', 'important', 'kiss', 'lol', 'neutral', 'sad', 'sick', 'smile', 'surprised', 'think', 'tongue', 'twisted', 'wink'];
	width = 640;
	height = 480;
	states = {};

	Date.now = Date.now || (function () {
		return new Date().getTime();
	}());

	repaint = window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(function () {
				callback(Date.now());
			}, 20);
		};

	function createCanvas(width, height) {
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;

		return canvas;
	}

	function createArray(length, defaultValue) {
		var arr = [], j;
		for (j = 0;j < length;j += 1) {
			arr[j] = defaultValue;
		}

		return arr;
	}

	function rand(min, max) {
		return min + Math.floor(Math.random () * (max - min));
	}

	function bufferImage(src, width, height, callback) {
		var image = document.createElement('img');
		image.onload = function () {
			var canvas = createCanvas(width || image.width, height || image.height);
			canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
			callback(canvas);
		};

		image.src = src;
	}

	function init() {
		var ctx, canvas, lastUpdate = Date.now();
		canvas = createCanvas(640, 480);
		ctx = canvas.getContext('2d');
		document.body.appendChild(canvas);

		state = 'title';

		/* Set up render loop */
		(function loop(time) {
			repaint(loop);

			var delta = time = lastUpdate;
			states[state].update(delta);
			states[state].render(ctx);
		}(Date.now() - lastUpdate));

		/* Render all emoticons */
		emotes.forEach(function (emote, index) {
			ctx.drawImage(images[emote], (index * 64) % (64 * 10), Math.floor(index / 10) * 64);
		});
	}

	/* Title screen */
	states['title'] = (function () {
		return {
			update: function (delta) {
			},

			render: function (ctx) {
				ctx.fillStyle = '#30a1f0';
				ctx.fillRect(0, 0, width, height);
				ctx.drawImage(images.logo, 10, 10);
			}
		};
	}());

	/* Load all images and render them into a canvas buffer */
	(function () {
		var count = 0, queue = [];
		images = {};

		emotes.forEach(function (emote) {
			queue.push({
				name: emote,
				src: 'images/icon_' + emote + '.svg',
				width: 64,
				height: 64
			});
		});

		queue.push({
			name: 'logo',
			src: 'images/logo.png'
		});

		queue.push({
			name: 'cloud',
			src: 'images/cloud.png'
		});

		queue.forEach(function (item) {
			bufferImage(item.src, item.width, item.height, function (result) {
				images[item.name] = result;
				count += 1;
				if (count === queue.length) {
					init();
				}
			});
		});
	}());
}());
