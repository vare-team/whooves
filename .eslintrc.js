module.exports = {
	env: {
		node: true,
		commonjs: true,
		es2021: true,
	},
	extends: ['eslint:recommended', 'plugin:prettier/recommended'],
	parserOptions: {
		ecmaVersion: 12,
	},
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': 'error',
		'no-prototype-builtins': 'off',
		'no-console': 'warn',
	},
};
