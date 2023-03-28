import { Image } from 'canvas';
import randomIntInc from '../utils/random-int-inc.js';

export function greyscale(ctx, x, y, width, height) {
	const data = ctx.getImageData(x, y, width, height);
	for (let i = 0; i < data.data.length; i += 4) {
		const brightness = 0.34 * data.data[i] + 0.5 * data.data[i + 1] + 0.16 * data.data[i + 2];
		data.data[i] = brightness;
		data.data[i + 1] = brightness;
		data.data[i + 2] = brightness;
	}
	ctx.putImageData(data, x, y);
	return ctx;
}

export function invert(ctx, x, y, width, height) {
	const data = ctx.getImageData(x, y, width, height);
	for (let i = 0; i < data.data.length; i += 4) {
		data.data[i] = 255 - data.data[i];
		data.data[i + 1] = 255 - data.data[i + 1];
		data.data[i + 2] = 255 - data.data[i + 2];
	}
	ctx.putImageData(data, x, y);
	return ctx;
}

export function sepia(ctx, x, y, width, height) {
	const data = ctx.getImageData(x, y, width, height);
	for (let i = 0; i < data.data.length; i += 4) {
		const brightness = 0.34 * data.data[i] + 0.5 * data.data[i + 1] + 0.16 * data.data[i + 2];
		data.data[i] = brightness + 100;
		data.data[i + 1] = brightness + 50;
		data.data[i + 2] = brightness;
	}
	ctx.putImageData(data, x, y);
	return ctx;
}

export function contrast(ctx, x, y, width, height) {
	const data = ctx.getImageData(x, y, width, height);
	const factor = 259 / 100 + 1;
	const intercept = 128 * (1 - factor);
	for (let i = 0; i < data.data.length; i += 4) {
		data.data[i] = data.data[i] * factor + intercept;
		data.data[i + 1] = data.data[i + 1] * factor + intercept;
		data.data[i + 2] = data.data[i + 2] * factor + intercept;
	}
	ctx.putImageData(data, x, y);
	return ctx;
}

export function distort(ctx, x = 0, y = 0, width = 0, height = 0, amplitude = 60, strideLevel = 4) {
	const data = ctx.getImageData(x, y, width, height);
	const temp = ctx.getImageData(x, y, width, height);
	const stride = width * strideLevel;
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			const xs = Math.round(amplitude * Math.sin(2 * Math.PI * 3 * (j / height)));
			const ys = Math.round(amplitude * Math.cos(2 * Math.PI * 3 * (i / width)));
			const dest = j * stride + i * strideLevel;
			const src = (j + ys) * stride + (i + xs) * strideLevel;
			data.data[dest] = temp.data[src];
			data.data[dest + 1] = temp.data[src + 1];
			data.data[dest + 2] = temp.data[src + 2];
		}
	}
	ctx.putImageData(data, x, y);
	return ctx;
}

export function glitch_gif(ctx, gif, image) {
	const width = image.width;
	const height = image.height;

	gif.setFrameRate(24);
	gif.setQuality(30);
	gif.setRepeat(0);
	gif.setTransparent(0x000000);

	gif.writeHeader();

	for (let frame = 1; frame < 37; frame++) {
		ctx.drawImage(
			image,
			randomIntInc(-15, 15),
			randomIntInc(-15, 15),
			randomIntInc(width - width / 1.8, width + width * 1.3),
			randomIntInc(height - height / 1.8, height + height * 1.3)
		);

		let glitch = ctx.getImageData(
			randomIntInc(1, width - 1),
			randomIntInc(1, height - 1),
			randomIntInc(1, width - 1),
			randomIntInc(1, height - 1)
		);
		for (let i = 0; i < glitch.data.length; i += 4) {
			glitch.data[i] = 255 - glitch.data[i];
			glitch.data[i + 1] = 255 - glitch.data[i + 1];
			glitch.data[i + 2] = 255 - glitch.data[i + 2];
		}
		ctx.putImageData(glitch, randomIntInc(1, width - width / 1.5), randomIntInc(1, height - height / 1.6));

		glitch = ctx.getImageData(
			randomIntInc(1, width - 1),
			randomIntInc(1, height - 1),
			randomIntInc(1, width - 1),
			randomIntInc(1, height - 1)
		);
		for (let i = 0; i < glitch.data.length; i += 4) {
			glitch.data[i] = glitch.data[i] * 3.59 + -331.52;
			glitch.data[i + 1] = glitch.data[i + 1] * 3.59 + -331.52;
			glitch.data[i + 2] = glitch.data[i + 2] * 3.59 + -331.52;
		}
		ctx.putImageData(glitch, randomIntInc(1, width - width / 1.4), randomIntInc(1, height - height / 1.8));

		glitch = ctx.getImageData(
			randomIntInc(1, width - 1),
			randomIntInc(1, height - 1),
			randomIntInc(1, width - 1),
			randomIntInc(1, height - 1)
		);
		ctx.putImageData(glitch, randomIntInc(1, width - width / 1.3), randomIntInc(1, height - height / 2));

		gif.addFrame(ctx.getImageData(0, 0, width, height).data);
	}

	gif.finish();
}

export function glitch(ctx, image) {
	const ava = new Image();
	ava.src = image;
	for (let i = 0; i < 5; i++) ava.src = replaceAt(ava.src, randomIntInc(50, ava.src.length - 50), '0');
	ctx.drawImage(ava, 0, 0);
}

function replaceAt(str, index, replacement) {
	return str.slice(0, index) + replacement + str.slice(index + replacement.length);
}
