module.exports = {
	env: {
		node: true,
		es2017: true
	},

	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier'
	],

	parser: '@typescript-eslint/parser',

	plugins: ['@typescript-eslint'],
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx']
		},
		'import/resolver': {
			typescript: {}
		}
	},
	parserOptions: {
		tsconfigRootDir: './',
		sourceType: 'module',
		ecmaVersion: 2021
	},
	rules: {
		'@typescript-eslint/no-explicit-any': 'off'
	}
};
