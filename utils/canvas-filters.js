import randomIntInc from '../utils/random-int-inc.js';
import { respondError } from './respond-messages.js';

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

export function glitch(ava, canvas, ctx, interaction) {
	ava.src = canvas.toDataURL('image/jpeg');
	for (let i = 0; i < 5; i++) ava.src = replaceAt(ava.src, randomIntInc(50, ava.src.length - 50), '0');
	try {
		ctx.drawImage(ava, 0, 0);
	} catch (e) {
		return respondError(
			interaction,
			'При компиляции файл был повреждён слишком сильно.\nПопробуйте снова через время.'
		);
	}
}

function replaceAt(str, index, replacement) {
	return str.slice(0, index) + replacement + str.slice(index + replacement.length);
}
