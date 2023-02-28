import context from './context/index.js';
import dev from './dev/index.js';
import images from './images/index.js';
import mod from './mod/index.js';
import others from './others/index.js';

export default {
	context,
};

export const commands = {
	...mapAllCommands([context, dev, images, others, mod]),
	__category__: {
		name: 'all',
	},
};

/**
 * @param categories {Object[]}
 * @return {Object}
 */
function mapAllCommands(categories) {
	const cmds = {};
	categories = categories.map(x => Object(x)[0]);
	for (const category of categories) {
		for (const cmd of category) {
			cmds[cmd.command.name] = cmd;
		}
	}
	return cmds;
}
