'use strict';

const RED = 0;
const GREEN = 1;
const BLUE = 2;
const BORDER_ENERGY = 1000;

/** Seam carver removes low energy seams in an image from HTML5 canvas. */
export default class Seamcarver {
	/**
	 *
	 * Init seam carver
	 *
	 * @param {Canvas} canvas canvas with image on it.
	 *
	 */
	constructor(canvas) {
		this.canvas = canvas;
		this.width = canvas.width;
		this.height = canvas.height;
		this.context = canvas.getContext('2d');
		this.imageData = this.context.getImageData(0, 0, this.width, this.height);
		this.picture = this.imageData.data;

		// Simple implementation of energy matrix as array of arrays.
		// Because we need to remove items, when removing the seam,
		// maybe some sort of linked structure is more efficient.
		this.energyMatrix = new Array(this.width);
		this.minsumMatrix = new Array(this.width);
		this.minxMatrix = new Array(this.width);
		for (let i = 0; i < this.width; i++) {
			this.energyMatrix[i] = new Float32Array(this.height);
			this.minsumMatrix[i] = new Float32Array(this.height);
			this.minxMatrix[i] = new Uint16Array(this.height);
		}

		this.createEnergyMatrix();
	}

	/**
	 * Converts pixel to index.
	 *
	 * @param {number} x The x val
	 * @param {number} y The y val
	 * @return {number} Index of 1D array
	 *
	 */
	pixelToIndex(x, y) {
		if (x < 0 || x >= this.width * 4 || y < 0 || y >= this.height) {
			throw new Error(`IndexOutOfBoundsException : ${x},${y}`);
		}
		// * 4 for rgba
		return (y * this.width + x) * 4;
	}

	indexToX(index) {
		return parseInt((index / 4) % this.width);
	}

	indexToY(index) {
		return parseInt(index / (this.width * 4));
	}

	rgbToNum(red, green, blue) {
		let rgb = red;
		rgb = (rgb << 8) + green;
		rgb = (rgb << 8) + blue;
		return rgb;
	}

	numToRgb(num) {
		const red = (num >> 16) & 0xff;
		const green = (num >> 8) & 0xff;
		const blue = num & 0xff;
		return [red, green, blue];
	}

	isBorderPixel(x, y) {
		return x <= 0 || y <= 0 || x >= this.width - 1 || y >= this.height - 1;
	}

	pixelInRange(x, y) {
		return x >= 0 && y >= 0 && x <= this.width - 1 && y <= this.height - 1;
	}

	/**
	 * Energy for single pixel.
	 *
	 * @param {number} x The x val.
	 * @param {number} y The y val.
	 * @return {number} The energy val.
	 */
	energy(x, y) {
		if (this.isBorderPixel(x, y)) {
			return BORDER_ENERGY;
		}

		const pos_xant = this.pixelToIndex(x - 1, y);
		const pos_xpost = this.pixelToIndex(x + 1, y);
		const pos_yant = this.pixelToIndex(x, y - 1);
		const pos_ypost = this.pixelToIndex(x, y + 1);

		const p = this.picture; // Just to make it more readable ...

		const score = Math.sqrt(
			(p[pos_xpost + RED] - p[pos_xant + RED]) * (p[pos_xpost + RED] - p[pos_xant + RED]) +
				(p[pos_xpost + GREEN] - p[pos_xant + GREEN]) * (p[pos_xpost + GREEN] - p[pos_xant + GREEN]) +
				(p[pos_xpost + BLUE] - p[pos_xant + BLUE]) * (p[pos_xpost + BLUE] - p[pos_xant + BLUE]) +
				(p[pos_ypost + RED] - p[pos_yant + RED]) * (p[pos_ypost + RED] - p[pos_yant + RED]) +
				(p[pos_ypost + GREEN] - p[pos_yant + GREEN]) * (p[pos_ypost + GREEN] - p[pos_yant + GREEN]) +
				(p[pos_ypost + BLUE] - p[pos_yant + BLUE]) * (p[pos_ypost + BLUE] - p[pos_yant + BLUE])
		);
		return score;
	}

	/**
	 * Calculate energy_matrix information for pixel x,y.
	 * Assumes x and y in range.
	 */
	recalculate(x, y) {
		const energy_cell = {};

		energy_cell.energy = this.energy(x, y);
		energy_cell.vminsum = Number.POSITIVE_INFINITY;

		// last row
		if (y >= this.height - 1) {
			energy_cell.vminsum = energy_cell.energy;
			energy_cell.minx = x;
		} else {
			let cursum = 0;

			// below left
			if (x - 1 >= 0) {
				energy_cell.vminsum = this.minsumMatrix[x - 1][y + 1] + energy_cell.energy;
				energy_cell.minx = x - 1;
			}

			// below
			if (x < this.width) {
				cursum = this.minsumMatrix[x][y + 1] + energy_cell.energy;
				if (cursum < energy_cell.vminsum) {
					energy_cell.vminsum = cursum;
					energy_cell.minx = x;
				}
			}

			// below right
			if (x + 1 < this.width) {
				cursum = this.minsumMatrix[x + 1][y + 1] + energy_cell.energy;
				if (cursum < energy_cell.vminsum) {
					energy_cell.vminsum = cursum;
					energy_cell.minx = x + 1;
				}
			}
		}

		return energy_cell;
	}

	/**
	 * Iterate from bottom to top. For each pixel calculate:
	 *     * The energy for the pixel.
	 *     * From the three pixels below the current pixel, calculate the
	 *       `minx` pixel. The `minx` pixel is the pixel with the smallest
	 *       cumulative energy (defined below).
	 *     * Set the cumulative energy for this pixel as the energy of this
	 *       pixel plus the cumulative energy of th `minx` pixel.
	 *
	 * The cumulative energy of the pixels in the bottom row is simply its own
	 * energy.
	 *
	 */
	createEnergyMatrix() {
		// This has to be reverse order (bottom to top)
		this.maxVminsum = 0;
		for (let y = this.height - 1; y >= 0; y--) {
			// This can be in any order ...
			for (let x = 0; x < this.width; x++) {
				const energy = this.recalculate(x, y);
				this.maxVminsum = Math.max(energy.vminsum, this.maxVminsum);
				this.energyMatrix[x][y] = energy.energy;
				this.minsumMatrix[x][y] = energy.vminsum;
				this.minxMatrix[x][y] = energy.minx;
			}
		}
	}

	/**
	 * Backtrack from smallest on first row to choosing always smallest child.
	 *
	 */
	findVerticalSeam() {
		const vseam = [];

		let xminsum = 0;
		let vminsum = Number.POSITIVE_INFINITY;

		// Find smallest sum on first row
		for (let x = 0; x < this.width; x++) {
			if (this.minsumMatrix[x][0] < vminsum) {
				vminsum = this.minsumMatrix[x][0];
				xminsum = x;
			}
		}

		vseam[0] = xminsum;

		// Follow down to get array
		let y = 0;
		while (y < this.height - 1) {
			xminsum = this.minxMatrix[xminsum][y];
			y++;
			vseam[y] = xminsum;
		}

		return vseam;
	}

	/**
	 * Remove pixels from rgb, energy and vminsum representations
	 * of image.
	 *
	 */
	removePixelsFromDataStructures(vseam) {
		this.imageData = this.context.createImageData(this.width - 1, this.height);
		for (let row = this.height - 1; row >= 0; row--) {
			const deletedCol = vseam[row];

			// copy across pixels before seam col
			for (let col = 0; col < deletedCol; col++) {
				const oldPos = this.pixelToIndex(col, row);
				const pos = oldPos - row * 4;
				for (let i = 0; i < 4; i++) {
					this.imageData.data[pos + i] = this.picture[oldPos + i];
				}
			}

			// Start at deleted col
			// Can ignore last column as we will delete it
			for (let col = deletedCol; col < this.width - 1; col++) {
				// copy across pixels after seam col
				const pos = this.pixelToIndex(col, row) - row * 4;
				const pos_right = this.pixelToIndex(col + 1, row);
				for (let i = 0; i < 4; i++) {
					this.imageData.data[pos + i] = this.picture[pos_right + i];
				}

				// copy across energy_matrix
				const energy_right = this.energyMatrix[col + 1][row];
				let minx_right = this.minxMatrix[col + 1][row];
				const minsum_right = this.minsumMatrix[col + 1][row];
				minx_right--;
				this.energyMatrix[col][row] = energy_right;
				this.minxMatrix[col][row] = minx_right;
				this.minsumMatrix[col][row] = minsum_right;
			}
		}

		// chop off last column
		this.energyMatrix.splice(this.width - 1, 1);
		this.minxMatrix.splice(this.width - 1, 1);
		this.minsumMatrix.splice(this.width - 1, 1);
		this.picture = this.imageData.data;
		this.width--;
	}

	/**
	 * Recalculate energy only when necessary: pixels adjacent
	 * (up, down and both sides) to the removed seam, ie the affected
	 * pixels.
	 * For any affected pixel, if the new energy is different to the previous one
	 * it's vmin sum must be recalculated therefore it is added to an array
	 * and returned by this method.
	 *
	 * @return {list} List of affected pixels for which the vminsum may be affected.
	 */
	recalculateEnergiesAndFindAffectedPixels(vseam) {
		const queue = [];

		// bottom to top, ignore last row
		for (let row = this.height - 2; row >= 0; row--) {
			const deletedCol = vseam[row];
			const affectedCols = [];

			for (let i = -1; i < 1; i++) {
				const col = deletedCol + i;

				if (this.pixelInRange(col, row)) {
					this.energyMatrix[col][row] = this.energy(col, row);
					// enqueue pixel in range
					affectedCols.push(col);
				}
			}
			queue[row] = affectedCols;
		}
		return queue;
	}

	/**
	 * Recalculate vminsum for affected pixels
	 */
	recalculateVminsumForAffectedPixels(queue) {
		const marked = {};
		const enqueued = {};
		// start at second to last row
		let row = this.height - 2;
		let enqueuedCols = queue[row];
		// used later in loop so as not to go past borders
		const lastCol = this.width - 1;

		while (enqueuedCols) {
			// This iterates in topological order (bottom to top)
			const col = enqueuedCols.pop();
			const pixelIndex = this.pixelToIndex(col, row);
			if (enqueuedCols.length === 0) enqueuedCols = queue[--row];

			// already explored this pixel
			if (marked[pixelIndex]) continue;

			marked[pixelIndex] = true;

			const nodeEnergy = this.energyMatrix[col][row];
			const oldVminsum = this.minsumMatrix[col][row];
			this.minsumMatrix[col][row] = Number.POSITIVE_INFINITY;

			// check three parents in row below
			for (var i = Math.max(col - 1, 0); i < Math.min(col + 2, lastCol + 1); i++) {
				const parentVminsum = this.minsumMatrix[i][row + 1];
				const newVminsum = parentVminsum + nodeEnergy;

				if (newVminsum < this.minsumMatrix[col][row]) {
					this.minsumMatrix[col][row] = newVminsum;
					this.minxMatrix[col][row] = i;
				}
			}

			// If we are on first row, no potentially affected children in row
			// above so skip next step.
			if (row === 0) continue;

			// Only enqueue the children if the vminsum has changed
			if (oldVminsum === this.minsumMatrix[col][row]) continue;

			// enqueue three affected children from row above
			for (let i = Math.max(col - 1, 0); i < Math.min(col + 2, lastCol + 1); i++) {
				const childIndex = this.pixelToIndex(i, row - 1);
				if (!enqueued[childIndex]) {
					enqueued[childIndex] = true;
					queue[row - 1].push(i);
				}
			}
		}
	}

	/**
	 * Removes vertical seam.
	 * Recalculates pixels depending on removed pixel.
	 */
	removeVerticalSeam(vseam) {
		this.removePixelsFromDataStructures(vseam);

		const affectedPixels = this.recalculateEnergiesAndFindAffectedPixels(vseam);

		this.recalculateVminsumForAffectedPixels(affectedPixels);
	}

	/*
	 * Takes field as arg to print matrix, default is rgb, accepts energy.
	 *
	 */
	reDrawImage(options) {
		const field = options.field;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.canvas.width = this.imageData.width;
		this.canvas.height = this.imageData.height;

		if (field === 'energy' || field === 'vminsum' || field !== this.imageData.dataField) {
			this.imageData = this.context.createImageData(this.width, this.height);
			this.imageData.dataField = field;

			for (let row = 0; row < this.height; row++) {
				for (let col = 0; col < this.width; col++) {
					const pos = this.pixelToIndex(col, row);
					let normalizedVal;

					if (field === 'energy') {
						normalizedVal = Math.min(255, (this.energyMatrix[col][row] / 255) * 255);
					} else if (field === 'minsum') {
						normalizedVal = ((this.minsumMatrix[col][row] - 1000) / (this.maxVminsum - 1000)) * 255;
					} else if (field === 'minx') {
						const direction = this.minxMatrix[col][row] - col + 1;
						for (var i = 0; i < 3; i++) {
							this.imageData.data[pos + i] = 0;
						}
						if (direction >= 0 && direction <= 2) {
							this.imageData.data[pos + direction] = 255;
						}
						this.imageData.data[pos + 3] = 255;
						continue;
					} else {
						// rgb
						for (let i = 0; i < 4; i++) {
							this.imageData.data[pos + i] = this.picture[pos + i];
						}
						continue;
					}

					for (let i = 0; i < 3; i++) {
						this.imageData.data[pos + i] = normalizedVal;
					}
					// make opaque
					this.imageData.data[pos + 3] = 255;
				}
			}
		}

		this.context.putImageData(this.imageData, 0, 0);
	}

	/**
	 * Prints one of the values of the energy_matrix. Useful for debugging.
	 */
	printMatrix(field) {
		// eslint-disable-next-line
		console.log(this.toString(field));
	}

	/**
	 * Returns string of internal matrix
	 */
	toString(field) {
		field = field || 'rgb';
		let lines = '';
		if (field === 'rgb') {
			for (let y = 0; y < this.height; y++) {
				for (let x = 0; x < this.width; x++) {
					const pos = this.pixelToIndex(x, y);
					const rgb = Array.prototype.slice.call(this.picture, pos, pos + 3);
					lines += `${(this.rgbToNum(rgb[0], rgb[1], rgb[2]) / 100000).toFixed(2)}\t`;
				}
				lines += '\n';
			}
		} else {
			for (let y = 0; y < this.height; y++) {
				for (let x = 0; x < this.width; x++) {
					let val;

					if (field === 'energy') {
						val = this.energyMatrix[x][y];
					} else if (field === 'minsum') {
						val = this.minsumMatrix[x][y];
					} else if (field === 'minx') {
						val = this.minxMatrix[x][y];
					}

					if (val || val === 0) {
						lines += `${val.toFixed(2)}\t`;
					} else {
						lines += '-----\t';
					}
				}
				lines += '\n';
			}
		}
		return lines;
	}
}
