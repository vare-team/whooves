let useCount = 0;
let errorCount = 0;

export default {
	getUseCount() {
		return useCount;
	},

	getErrorCount() {
		return errorCount;
	},

	addUse() {
		useCount++;
	},

	addError() {
		errorCount++;
	},
};
