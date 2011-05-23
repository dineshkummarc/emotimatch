(function () {
	var emoticons, emotes, width, height, ctx;
	emotes = ['angry', 'bigsmile', 'blush', 'confused', 'cool', 'cry', 'eek', 'important', 'kiss', 'lol', 'neutral', 'sad', 'sick', 'smile', 'surprised', 'think', 'tongue', 'twisted', 'wink'];
	width = 640;
	height = 480;

	function createCanvas(width, height) {
		var canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;

		return canvas;
	}


	function bufferImage(src, width, height, callback) {
		var image = document.createElement('img');
		image.onload = function () {
			var canvas = createCanvas(width, height);
			canvas.getContext('2d').drawImage(image, 0, 0, width, height);
			callback(canvas);
		};
		image.src = src;
	}

	function init() {
		var canvas = createCanvas(640, 480);
		ctx = canvas.getContext('2d');
		document.body.appendChild(canvas);

		/* Render all emoticons */
		emotes.forEach(function (emote, index) {
			ctx.drawImage(emoticons[emote], (index * 64) % (64 * 10), Math.floor(index / 10) * 64);
		});
	}

	/* Load all images and render them into a canvas buffer */
	(function () {
		var count = 0;
		emoticons = {};
		emotes.forEach(function (emote) {
			bufferImage('icons/icon_' + emote + '.svg', 64, 64, function (result) {
				emoticons[emote] = result;
				count += 1;
				if (count === emotes.length) {
					init();
				}
			});
		});
	}());
}());
