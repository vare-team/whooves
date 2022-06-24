import context from './context/index.js'

export default {
	context
};

export const commands = {
	...context,
	__category__: {
		name: 'all'
	}
}
