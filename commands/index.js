import context from './context/index.js';
import dev from './dev/index.js';

export default {
	context,
};

export const commands = {
	...context,
	...dev,
	__category__: {
		name: 'all',
	},
};
