import context from "./context";

export default {
	context
};

export const commands = {
	...context,
	__category__: {
		name: 'all'
	}
}
